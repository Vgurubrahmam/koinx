"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { type TAXLOST, holdingsData } from "@/components/data/holdingsData"

// Define the context type
type TaxHarvestingContextType = {
  selectedData: TAXLOST[]
  setSelectedData: (data: TAXLOST[]) => void
  toggleSelection: (id: string) => void
  isSelected: (id: string) => boolean
  clearSelections: () => void
}

// Create the context with a default value
const TaxHarvestingContext = createContext<TaxHarvestingContextType | undefined>(undefined)

// Provider component
export function TaxHarvestingProvider({ children }: { children: ReactNode }) {
  const [selectedData, setSelectedData] = useState<TAXLOST[]>([])

  // Toggle selection of an item by ID
  const toggleSelection = (id: string) => {
    setSelectedData((prev) => {
      const isAlreadySelected = prev.some((item) => item.id === id)
      if (isAlreadySelected) {
        return prev.filter((item) => item.id !== id)
      } else {
        const itemToAdd = holdingsData.find((item) => item.id === id)
        if (itemToAdd) {
          return [...prev, itemToAdd]
        }
        return prev
      }
    })
  }

  // Check if an item is selected
  const isSelected = (id: string) => {
    return selectedData.some((item) => item.id === id)
  }

  // Clear all selections
  const clearSelections = () => {
    setSelectedData([])
  }

  return (
    <TaxHarvestingContext.Provider
      value={{
        selectedData,
        setSelectedData,
        toggleSelection,
        isSelected,
        clearSelections,
      }}
    >
      {children}
    </TaxHarvestingContext.Provider>
  )
}

// Custom hook to use the context
export function useTaxHarvesting() {
  const context = useContext(TaxHarvestingContext)
  if (context === undefined) {
    throw new Error("useTaxHarvesting must be used within a TaxHarvestingProvider")
  }
  return context
}
