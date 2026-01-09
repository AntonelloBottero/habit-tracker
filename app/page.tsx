'use client'

import { useState, useEffect } from "react"
import useDb from "@/db/useDb"
import Link from "next/link"

export default function Home() {
  const { getOption } = useDb()

  const [setupCompleted, setSetupCompleted] = useState<boolean>(false)
  useEffect(() => {
    getOption('setup_completed').then(value => {
      setSetupCompleted(!!value)
    })
  }, [])

  return (
    <div className="overflow-hidden font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen w-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="w-full max-w-90">
          {!setupCompleted && (
            <div className="text-center">
              <h1 className="text-4xl font-monda">welcome!</h1>
              <p className="mt-1 mb-3">New in here?<br />Start by stating your objectives.</p>
              <Link href="/setup" className="ht-btn ht-btn--size-default ht-interaction ht-btn--variant-primary shadow-ht">
                Tell us about yourself
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
