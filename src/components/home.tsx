"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table_harvesting"
import { DataTableDemo } from "@/components/ui/datatabledemo"
import { Info } from "lucide-react"
import { useTaxHarvesting } from "@/context/TaxHarvestingContext"

type GainType = {
  profits: number
  losses: number
  gain?: number
}

export default function Hero() {
  const { selectedData } = useTaxHarvesting()

  type CapitalGains = {
    stcg: GainType
    ltcg: GainType
  }

  type RowKey = "profits" | "losses" | "net"

  type Row = {
    label: string
    key: RowKey
  }

  const capitalGains: CapitalGains = {
    stcg: { profits: 600, losses: 500 },
    ltcg: { profits: 1200, losses: 1100 },
  }

  const rows: Row[] = [
    { label: "Profits", key: "profits" },
    { label: "Losses", key: "losses" },
    { label: "Net Capital Gains", key: "net" },
  ]

  const shortTermNet = capitalGains.stcg.profits - capitalGains.stcg.losses
  const longTermNet = capitalGains.ltcg.profits - capitalGains.ltcg.losses
  const realisedGains = shortTermNet + longTermNet

  return (
    <section className="min-h-screen flex flex-col items-start justify-start overflow-hidden sm:px-4">
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-2xl font-semibold">Tax Harvesting</h1>
        <HoverCard>
          <HoverCardTrigger className="text-primary font-semibold text-md underline underline-offset-4">
            How it works?
          </HoverCardTrigger>
          <HoverCardContent className=" text-sm font-normal">
            Lorem ipsum dolor sit amet consectetur. Vel mattis duis morbi tellus.{" "}
            <span className="text-primary underline underline-offset-3">Know More</span>
          </HoverCardContent>
        </HoverCard>
      </div>
      <Accordion
        type="single"
        collapsible
        className="w-full bg-primary/10 px-4 py-0 my-4 mr-3 overflow-hidden  border-1 rounded-xl border-primary"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex  items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Info className="text-primary" />
              <span className="font-semibold md:text-lg sm:text-md"> Important Notes & Disclaimers</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc font-medium md:text-md  w-full px-4">
              <li>
                Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax
                advisor before making any decisions.
              </li>
              <li>
                Tax harvesting does not apply to derivatives or futures. These are handled separately as business income
                under tax rules.{" "}
              </li>
              <li>
                Price and market value data is fetched from Coingecko, not from individual exchanges. As a result,
                values may slightly differ from the ones on your exchange.
              </li>
              <li>
                Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything
                as long-term.
              </li>
              <li>
                Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* harvesting */}
      <div className="flex flex-wrap w-full gap-5">
        <div className="w-full lg:w-[calc(50%-0.625rem)] bg-white dark:bg-gray-700/45 dark:text-white shadow rounded-md p-3">
          <h1 className="font-semibold text-xl">Pre Harvesting</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-5 font-normal text-base"></TableHead>
                <TableHead className="px-5 font-normal text-base text-right">Short-term</TableHead>
                <TableHead className="px-5 font-normal text-base text-right">Long-term</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const isNet = row.key === "net"
                const short = isNet ? shortTermNet : capitalGains.stcg[row.key as "profits" | "losses"]
                const long = isNet ? longTermNet : capitalGains.ltcg[row.key as "profits" | "losses"]

                const labelClass = "px-3 " + (isNet ? " font-medium" : "")
                const valueClass = "px-3 text-right " + (isNet ? " font-semibold" : "")

                return (
                  <TableRow key={row.label}>
                    <TableCell className={labelClass}>{row.label}</TableCell>
                    <TableCell className={valueClass}>
                      {short < 0 ? "- $" : "$"} {Math.abs(short)}
                    </TableCell>
                    <TableCell className={valueClass}>
                      {long < 0 ? "- $" : "$"} {Math.abs(long)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <p className="text-lg font-medium px-2">
            Realised Capital Gains: <span className="text-2xl font-bold">${realisedGains}</span>
          </p>
        </div>

        <div className="w-full lg:w-[calc(50%-0.625rem)] bg-primary text-white shadow rounded-md p-3">
          <h1 className="font-semibold text-xl">After Harvesting</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-5 text-white font-normal text-base"></TableHead>
                <TableHead className="px-5 text-white font-normal text-base text-right">Short-term</TableHead>
                <TableHead className="px-5 text-white font-normal text-base text-right">Long-term</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const isNet = row.key === "net"

                // Calculate STCG profits and losses
                const stcg = selectedData.length
                  ? selectedData.reduce(
                      (acc, curr) => {
                        const gain = curr.stcg.gain
                        if (gain > 0) acc.profits += gain
                        else if (gain < 0) acc.losses += Math.abs(gain)
                        return acc
                      },
                      { profits: 0, losses: 0 },
                    )
                  : capitalGains.stcg

                // Calculate LTCG profits and losses
                const ltcg = selectedData.length
                  ? selectedData.reduce(
                      (acc, curr) => {
                        const gain = curr.ltcg.gain
                        if (gain > 0) acc.profits += gain
                        else if (gain < 0) acc.losses += Math.abs(gain)
                        return acc
                      },
                      { profits: 0, losses: 0 },
                    )
                  : capitalGains.ltcg

                // Determine values to show
                const short = isNet ? stcg.profits - stcg.losses : stcg[row.key as "profits" | "losses"]

                const long = isNet ? ltcg.profits - ltcg.losses : ltcg[row.key as "profits" | "losses"]

                const labelClass = "px-3 " + (isNet ? "font-medium" : "")
                const valueClass = "px-3 text-right " + (isNet ? "font-semibold" : "")

                return (
                  <TableRow key={row.label}>
                    <TableCell className={labelClass}>{row.label}</TableCell>
                    <TableCell className={valueClass}>
                      {short < 0 ? "- $" : "$"} {Math.abs(short).toFixed(2)}
                    </TableCell>
                    <TableCell className={valueClass}>
                      {long < 0 ? "- $" : "$"} {Math.abs(long).toFixed(2)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <p className="text-xl font-semibold px-2 mt-2">
            Effective Capital Gains:{" "}
            <span className="text-xl font-bold">
              $
              {selectedData.length > 0
                ? selectedData.reduce((acc, curr) => acc + curr.stcg.gain + curr.ltcg.gain, 0).toFixed(2)
                : realisedGains.toFixed(2)}
            </span>
          </p>
          {/* Savings message */}
          {selectedData.length > 0 &&
            (() => {
              const currentRealised = selectedData.reduce((acc, curr) => acc + curr.stcg.gain + curr.ltcg.gain, 0)
              const saving = realisedGains - currentRealised
              return saving > 0 ? (
                <p className="text-white font-medium px-2">🎉 You are going to save upto $ {saving.toFixed(2)}</p>
              ) : null
            })()}
        </div>
      </div>

      {/* table data */}
      <DataTableDemo />
    </section>
  )
}
