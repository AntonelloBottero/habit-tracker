'use client'

import { useState } from 'react'
import Form from 'next/form'
import useDb from '@/db/useDb'
import { ArrowForward } from "@project-lary/react-material-symbols-700-rounded"
import Loader from '@/components/Loader'

interface Props {
    onSubmit?: (name: string) => void | never
}

export default function SetupForm({ onSubmit }: Props) {
  const { createOption } = useDb()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    if(!name) { return }
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
            className="bg-green-200 ht-interaction shadow-ht rounded-full text-sm p-2.5 text-center inline-flex items-center"
          >
            {!loading ? <ArrowForward className="size-7" /> : <Loader />}
          </button>
        </div>
      </div>
    </Form>
  )
}