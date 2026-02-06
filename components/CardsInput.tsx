import { ReactNode, ChangeEvent } from "react"
import { PlaylistRemove } from '@project-lary/react-material-symbols-700-rounded'

interface Props<T> {
  value: unknown
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
	items: T[]
	valueProp?: keyof T
	titleProp?: keyof T
  content?: (item: T, selected: boolean) => ReactNode
  className?: string
}

export default function CardsInput<T extends object>({ value, onChange, items, valueProp = 'id' as keyof T, titleProp = 'name' as keyof T, content, className = '' }: Props<T>) {
  function handleItemClick(item: T) {
    if(onChange) {
      onChange({
        target: {
          value: item[valueProp]
        }
      } as unknown as ChangeEvent<HTMLInputElement>)
    }
  }

  return (
    <div className={`${className} grid grid-cols-1 gap-3 outline-1 outline-offset-2 outline-white rounded-lg`} role="cards-input">
      {items.map(item => (
        <div
          key={item[valueProp] as string | number}
          role="cards-input-item"
          className={`ht-interaction pt-2 pb-2 px-3 rounded-lg ${value === item[valueProp] ? 'bg-green-50 outline-green-200' : 'bg-white outline-stone-200' } outline-1 outline-offset-1 flex flex-col gap-1`}
          onClick={() => { handleItemClick(item) }}
        >
          {!content
            ? item[titleProp] as string
            : content(item, value === item[valueProp])}
        </div>
      ))}
      {!items.length && (
        <div className="py-1 flex items-center gap-2 mx-2">
          <PlaylistRemove className="text-4xl text-gray-300" />
          <span className="text-base text-gray-500">
            No options available
          </span>
        </div>
      )}
    </div>
  )
}