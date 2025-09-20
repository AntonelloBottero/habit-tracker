'use client'

import TabsWindow from "@/components/TabsWindow"
import SetupForm from "@/components/SetupForm"
import { useState } from 'react'

export default function Page() {
    const [tab, setTab] = useState(0)

    const handleSetupFormSubmit = () => {
        console.log('handleSetupFormSubmit')
        setTab(1)
    }

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
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
                        <h1>Tab 2</h1>
                    </div>
                </TabsWindow>
            </main>
        </div>
    )
}