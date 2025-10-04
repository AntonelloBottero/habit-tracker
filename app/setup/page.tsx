'use client'

import { useOptions } from '@/hooks/useOptions'
import TabsWindow from "@/components/TabsWindow"
import SetupForm from "@/components/SetupForm"
import HabitsSetup from "@/components/HabitsSetup"
import { useState, useEffect } from 'react'

export default function Page() {
    const { getOption } = useOptions()
    const [name, setName] = useState('')
    const [tab, setTab] = useState(0)
    const getName = async () => {
        const nameOption = await getOption('name')
        setName(nameOption || '')
    }
    useEffect(() => {
        if(name) {
            setTab(1)
        }
    }, [name])
    useEffect(() => {
        getName()
    }, [])
    const handleSetupFormSubmit = () => {
        getName()
    }


    return (
        <div className="overflow-hidden font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen w-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col row-start-2 items-center sm:items-start">
                <TabsWindow value={tab}>
                    <div className="w-full max-w-90">
                        <h1 className="text-4xl font-monda">Welcome habiter!</h1>
                        <p>New in here? Start by inserting your name...<br />
                        ...or whatever you want us to call you</p>
                        <div className="w-full mt-4">
                            <SetupForm onSubmit={handleSetupFormSubmit} />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-monda mb-2">It's all about your Habits in here</h1>
                        <HabitsSetup />
                    </div>
                </TabsWindow>
            </main>
        </div>
    )
}