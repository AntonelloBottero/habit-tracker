'use client'

import { useState, useEffect } from 'react'
import Form from 'next/form'
import { createOption } from '@/hooks/useOptions'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Loader from '@/components/Loader'

interface Props {
    onSubmit?: Function
}

export default function SetupForm({ onSubmit }: Props) {
    const [name, setName] = useState('')
    const [canSubmit, setCanSubmit] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(!name) {
            setCanSubmit(false)
            return
        }
        setCanSubmit(true)
    }, [name])

    const submit = async () => {
        if(!canSubmit) { return }
        setLoading(true)
        await createOption('name', name)
        setLoading(false)
        if(onSubmit) {
            onSubmit(name)
        }
    }

    return (
        <Form action={submit}>
            <div className="flex gap-2 w-full">
                <input
                    id="name"
                    type="text"
                    name="name"
                    className="grow rounded-full px-6 py-3 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 rounded-full"
                    placeholder="Your whatever goes here"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <div>
                    <button
                        type="submit"
                        className="bg-primary outline-glass hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        {!loading ? <ArrowRightIcon className="size-6" /> : <Loader />}
                    </button>
                </div>
            </div>
        </Form>
    )
}