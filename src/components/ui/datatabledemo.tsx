"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { holdingsData as holdings } from "@/components/data/holdingsData"
import { useTaxHarvesting } from "@/context/TaxHarvestingContext"
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {}

export type holdingsDataTypes = {
  id: string
  coin: string
  coinName: string
  logo: string
  currentPrice: number
  totalHolding: number
  averageBuyPrice: number
  stcg: {
    balance: number
    gain: number
  }
  ltcg: {
    balance: number
    gain: number
  }
  amountToSell: number
  email: string
}

export const columns: ColumnDef<holdingsDataTypes>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "coin",
    header: "Asset",
    cell: ({ row }) => {
      const { coin, coinName, logo } = row.original
      return (
        <div className="flex items-center gap-2">
          <img src={logo || "/placeholder.svg"} alt={coin} className="h-5 w-5" />
          <div>
            <div className="font-medium">{coinName}</div>
            <div className="text-xs text-muted-foreground">{coin}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "totalHolding",
    header: "Holdings",
    cell: ({ row }) => {
      const value = row.original.totalHolding.toFixed(6)
      const rate = `$${row.original.currentPrice.toFixed(2)}/${row.original.coin}`
      return (
        <div>
          <div>
            {value} {row.original.coin}
          </div>
          <div className="text-xs text-muted-foreground">{rate}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "totalValue",
    header: "Total Current Value",
    cell: ({ row }) => {
      const totalValue = row.original.totalHolding * row.original.currentPrice
      return (
        <div className="font-medium">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(totalValue)}
        </div>
      )
    },
  },
  {
    accessorKey: "stcg",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Short-term
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.stcg.gain
      const b = rowB.original.stcg.gain
      return a - b
    },
    cell: ({ row }) => {
      const stcg = row.original.stcg
      const gain = stcg.gain
      const color = gain >= 0 ? "text-green-600" : "text-red-600"
      return (
        <div className={color}>
          {gain >= 0 ? "+" : ""}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(gain)}
          <div className="text-xs text-muted-foreground">
            {stcg.balance.toFixed(4)} {row.original.coin}
          </div>
        </div>
      )
    },
  },

  {
    accessorKey: "ltcg",
    header: "Long-term",
    cell: ({ row }) => {
      const ltcg = row.original.ltcg
      const gain = ltcg.gain
      const color = gain >= 0 ? "text-green-600" : "text-red-600"
      return (
        <div className={color}>
          {gain >= 0 ? "+" : ""}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(gain)}
          <div className="text-xs text-muted-foreground">
            {ltcg.balance.toFixed(4)} {row.original.coin}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "amountToSell",
    header: "Amount to Sell",
    cell: ({ row }) => {
      const amount = row.original.totalHolding
      return (
        <div className="text-right">
          {row.getIsSelected() && amount > 0 ? amount.toFixed(4) + ` ${row.original.coin}` : "-"}
        </div>
      )
    },
  },
]

export function DataTableDemo({}: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const { setSelectedData } = useTaxHarvesting()

  const table = useReactTable<holdingsDataTypes>({
    data: holdings,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === "function" ? updater(rowSelection) : updater
      setRowSelection(newSelection)

      // Get the selected rows data
      const selectedItems = Object.keys(newSelection)
        .filter((key) => newSelection[key])
        .map((key) => holdings[Number.parseInt(key)])
        .filter(Boolean)

      // Update the context with the selected data
      setSelectedData(selectedItems)
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full bg-white dark:bg-gray-700/45 shadow p-4 my-5">
      <p className="font-semibold">Holdings</p>

      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
