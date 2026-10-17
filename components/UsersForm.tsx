'use client'

import { ArrowForward } from "@project-lary/react-material-symbols-700-rounded"
import Loader from '@/components/Loader'
import useUsersCrud from '@/src/users/adapters/useUsersCrud'
import { UserRawProps } from '@/src/users/mappers/UserMapper'

interface Props {
  onSave?: (values: UserRawProps) => void | never
}

export default function UsersForm({ onSave }: Props) {
  const { form, loadingSave } = useUsersCrud({ onSave })

  return (
    <form onSubmit={form.handleFormSubmit}>
      <div className="flex gap-2 w-full">
        <input
          id="name"
          type="text"
          name="name"
          className="grow rounded-full px-6 py-3 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 rounded-full"
          placeholder="Your whatever goes here"
          value={form.model.name}
          onChange={e => form.changeField('name', e.target.value)}
        />
        <div>
          <button
            type="submit"
            className="bg-green-200 ht-interaction shadow-ht rounded-full text-sm p-2.5 text-center inline-flex items-center"
          >
            {!loadingSave ? <ArrowForward className="size-7" /> : <Loader />}
          </button>
        </div>
      </div>
    </form>
  )
}