interface Props<T> {
	items: T[]
	itemValue?: keyof T
	itemTitle?: keyof T
}

export default function CardsInput<T extends Record<string, never>>({ items, itemValue = 'id', itemTitle = 'name'}: Props<T>) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {items.map(item => (
        <div key={item[itemValue]} className="ht-interaction pt-2 pb-2 px-4 rounded-lg bg-white outline-1 outline-offset-1 outline-green-200 flex flex-col gap-2">
          {item[itemTitle]}
        </div>
      ))}
    </div>
  )
}