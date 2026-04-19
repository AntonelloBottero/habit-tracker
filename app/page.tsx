'use client'

import { useState, useEffect, lazy, Suspense } from "react"
import Link from "next/link"
import PageLoader from '@/components/PageLoader'
import useHabits from "@/hooks/useHabits"
import { ChatFilled } from '@project-lary/react-material-symbols-700-rounded'

const HabitsCalendar = lazy(() => import('@/components/HabitsCalendar')) // HabitsCalendar is an heavy component and should be loaded only when user has finished setup

let skipSetup = false // In strict mode we need to prevent useDb.setup() to be executed twice

export default function Home() {
  const { setup } = useHabits()

  const [setupCompleted, setSetupCompleted] = useState<boolean>(false)
  const [setupLoading, setSetupLoading] = useState<boolean>(true)
  useEffect(() => {
    if(!skipSetup) {
      setup().then(value => {
        setSetupCompleted(value)
        setSetupLoading(false)
      })
    }

    return () => {
      skipSetup = true
    }
  }, [])

  return (
    <main className="font-sans w-full h-[100vh]">
      {setupLoading ? (
        <PageLoader />
      ) : !setupCompleted ? (
        <div className="w-full h-full min-h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl font-monda">welcome!</h1>
          <p className="mt-1 mb-3">New in here?<br />Start by stating your objectives.</p>
          <Link href="/setup" className="ht-btn ht-btn--size-default ht-interaction bg-green-200 shadow-ht">
            <ChatFilled className="size-4" />
            Tell us about yourself
          </Link>
        </div>
      ) : (
        <Suspense fallback={<PageLoader />}>
          <HabitsCalendar />
        </Suspense>
      )}
    </main>
  )
}
