'use client'

import { useState, useEffect, useRef, lazy, Suspense } from "react"
import Link from "next/link"
import PageLoader from '@/components/PageLoader'
import { ChatFilled } from '@project-lary/react-material-symbols-700-rounded'
import useSetup from "../src/shared/adapters/useSetup"
import { useInfrastructure } from "@/src/shared/infrastructure/InfrastructureContext"

const HabitsCalendar = lazy(() => import('@/components/HabitsCalendar')) // HabitsCalendar is an heavy component and should be loaded only when user has finished setup


export default function Home() {
  const { user } = useInfrastructure()
  const { setup } = useSetup()

  const [setupCompleted, setSetupCompleted] = useState<boolean>(false)
  const [setupLoading, setSetupLoading] = useState<boolean>(true)
  const skipSetup = useRef<boolean | string | number>(false) // In strict mode we need to prevent useSetup.setup() to be executed twice
  useEffect(() => {
    if(skipSetup.current !== (user?.id || true)) {
      if(!user) {
        setSetupCompleted(false)
        setSetupLoading(false)
      } else {
        setup().then((value) => {
          setSetupCompleted(value)
          setSetupLoading(false)
        })
      }
    }

    return () => {
      skipSetup.current = user?.id || true // we skip strict mode and act only the first time or when the user changes
    }
  }, [user])

  return (
    <main className="font-sans w-full h-[100vh]">
      {setupLoading ? (
        <PageLoader />
      ) : !setupCompleted ? (
        <div className="w-full h-full min-h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl font-monda">welcome!</h1>
          <p className="mt-1 mb-3">New in here?<br />Start by stating your objectives.</p>
          <Link href="/setup" className="ht-btn ht-btn--size-large ht-interaction bg-green-200 shadow-ht">
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
