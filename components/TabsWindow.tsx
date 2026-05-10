import { Children, ReactElement } from 'react'

interface Props {
  children: ReactElement[]
  value: number | null | undefined
}

export default function TabsWindow({children, value = 0 }: Props) {
  return (
    <div className="w-full">
      <div className="relative">
        {Children.map(children, (child, index) => (
          <div
            key={index}
            className={`w-full transition-transform duration-500 ease-in-out
                ${value === index
            ? 'translate-x-0 opacity-100' // Active tab
            : 'translate-x-full opacity-0' // Non active tab, hidden on the right
          }
                ${value !== index && 'absolute'}
                `}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}