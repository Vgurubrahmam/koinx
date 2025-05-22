"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ModeToggle } from "@/components/ui/modetoggle"

export default function Navbar() {
  const [isOpen] = useState(false)



//   const navItems = [
//     { name: "Home", href: "#home" },
//     { name: "About", href: "#about" },
//     { name: "Projects", href: "#projects" },
//     { name: "Services", href: "#services" },
//     { name: "Contact", href: "#contact" },
//   ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full bg-white dark:bg-gray-700/45 backdrop-blur-md">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "w-full md:w-[90%] transition-all duration-300  rounded-b-lg",
          // scrolled
          //   ? "bg-background/60 backdrop-blur-md border-b border-border shadow-sm"
          //   : "bg-transparent border-transparent",
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="#home" className="text-2xl font-bold text-foreground">
               <img src="/koinx_logo.png" />
              </Link>
            </div>

            {/* <div className="hidden md:flex items-center justify-end space-x-5 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground font-medium transition-colors  duration-300 text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div> */}

            <div className="flex pl-4 items-center gap-x-2">
              {/* <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full md:hidden"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button> */}
              <ModeToggle />
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
          className={`md:hidden overflow-hidden bg-card border-b border-border`}
        >
          {/* <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div> */}
        </motion.div>
      </motion.nav>
    </div>
  )
}
