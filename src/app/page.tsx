
import Hero from "@/components/home";
import Navbar from "@/components/navbar";
export default function Home() {
  return (
    <main className="min-h-screen pt-[5.2rem] md:px-[4.5rem]  px-[0.5rem] bg-gray-200 dark:bg-black">
      <Navbar />
      <Hero />
    </main>
  );
}
