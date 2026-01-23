import { ReactNode, ChangeEvent } from "react"

interface Props<T> {
  value: unknown
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
	items: T[]
	valueProp?: keyof T
	titleProp?: keyof T
  content?: (item: T, selected: boolean) => ReactNode
}

export default function CardsInput<T extends object>({ value, onChange, items, valueProp = 'id', titleProp = 'name', content}: Props<T>) {
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
    <div className="grid grid-cols-1 gap-3" role="cards-input">
      {items.map(item => (
        <div
          key={item[valueProp]}
          role="cards-input-item"
          className={`ht-interaction pt-2 pb-2 px-4 rounded-lg ${value === item[valueProp] ? 'bg-green-50 outline-green-200' : 'bg-white outline-stone-200' } outline-1 outline-offset-1 flex flex-col gap-2`}
          onClick={() => { handleItemClick(item) }}
        >
          {!content
            ? item[titleProp]
            : content(item, value === item[valueProp])}
        </div>
      ))}
    </div>
  )
}