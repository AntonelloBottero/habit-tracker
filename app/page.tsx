'use client'

import { useState, useEffect } from "react"
import { DateTime } from "luxon"
import useHabits from "@/hooks/useHabits"
import { DbResourceSchema, SlotsSchema } from "@/db/DbClass"

export default function Home() {
  const { fetchActiveSlots } = useHabits()

  const [activeSlots, setActiveSlots] = useState<DbResourceSchema<SlotsSchema>[]>([])
  useEffect(() => {
    fetchActiveSlots(DateTime.now().toISO()).then(as => {
      setActiveSlots(as)
    })
  }, [])

  return (
    <div className="overflow-hidden font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen w-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="w-full max-w-90">
          <h1 className="text-4xl font-monda">Welcome!</h1>
        </div>
      </main>
    </div>
  )
}
