'use client'

import { useRouter } from 'next/navigation'
import TabsWindow from "@/components/TabsWindow"
import SetupForm from "@/components/SetupForm"
import HabitsSetup from "@/components/HabitsSetup"
import { useState, useEffect } from 'react'
import { useInfrastructure } from '@/src/shared/infrastructure/InfrastructureContext'

export default function Page() {
  const { user } = useInfrastructure()
  const [tab, setTab] = useState(0)

  useEffect(() => {
    if(user) {
      setTab(1)
    }
  }, [user])

  const router = useRouter()
  function onSetup() {
    router.push('/')
  }


  return (
    <div className="overflow-hidden font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen w-screen p-8 gap-16 sm:p-20 box-border">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <TabsWindow value={tab}>
          <div className="w-full max-w-90">
            <h1 className="text-4xl font-monda">welcome!</h1>
            <p>New in here? Start by inserting your name...<br />
              ...or whatever you want us to call you</p>
            <div className="w-full mt-4">
              <SetupForm />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-monda mb-2">It's all about your Habits in here</h1>
            <HabitsSetup onSetup={onSetup} />
          </div>
        </TabsWindow>
      </main>
    </div>
  )
}