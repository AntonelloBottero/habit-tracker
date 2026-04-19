'use client'

import { useState, useEffect, lazy, Suspense } from "react"
import Link from "next/link"
import useHabits from "@/hooks/useHabits"

const HabitsCalendar = lazy(() => import('@/components/HabitsCalendar')) // HabitsCalendar is an heavy component and should be loaded only when user has finished setup

let skipSetup = false // In strict mode we need to prevent useDb.setup() to be executed twice

export default function Home() {
  const { setup } = useHabits()

  const [setupCompleted, setSetupCompleted] = useState<boolean>(false)
  useEffect(() => {
    if(!skipSetup) {
      setup().then(value => {
        setSetupCompleted(value)
      })
    }

    return () => {
      skipSetup = true
    }
  }, [])

  return (
    <>
      {!setupCompleted ? (
        <div className="overflow-hidden font-sans grid items-center justify-items-center min-h-screen w-screen p-8 pb-20 gap-16 sm:p-20">
          <main className="flex flex-col row-start-2 items-center sm:items-start">
            <div className="w-2xl">
              <div className="text-center">
                <h1 className="text-4xl font-monda">welcome!</h1>
                <p className="mt-1 mb-3">New in here?<br />Start by stating your objectives.</p>
                <Link href="/setup" className="ht-btn ht-btn--size-default ht-interaction ht-btn--variant-primary shadow-ht">
                  Tell us about yourself
                </Link>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <main className="font-sans w-full h-[100vh]">
          <Suspense fallback={<p>Loading calendar...</p>}>
            <HabitsCalendar />
          </Suspense>
        </main>
      )}
    </>
  )
}
