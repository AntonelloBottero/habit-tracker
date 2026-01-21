import { ReactNode } from "react"

interface Props<T> {
  value: never,
	items: T[]
	itemValue?: keyof T
	itemTitle?: keyof T
  content?: (item: T, selected: boolean) => ReactNode
}

export default function CardsInput<T extends Record<string, never>>({ value, items, itemValue = 'id', itemTitle = 'name', content}: Props<T>) {

  return (
    <div className="grid grid-cols-1 gap-3">
      {items.map(item => (
        <div key={item[itemValue]} className={`ht-interaction pt-2 pb-2 px-4 rounded-lg ${value === item[itemValue] ? 'bg-green-50 outline-green-200' : 'bg-white outline-stone-200' } outline-1 outline-offset-1 flex flex-col gap-2`}>
          {!content
            ? item[itemTitle]
            : content(item, value === item[itemValue])}
        </div>
      ))}
    </div>
  )
}