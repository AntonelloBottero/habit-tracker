import { useState, useEffect, forwardRef, useImperativeHandle, type ReactNode, useMemo } from 'react'
import { SidebarRef } from '@/app/types'

interface Props {
    initialValue?: boolean
    width?: string // 300px, 70%, ecc
    align?: 'left' | 'right'
    bordered?: boolean
    title?: string,
    children?: ReactNode
}

const Sidebar = forwardRef<SidebarRef, Props>(({ initialValue = false, width = '256px', align = 'left', bordered = true, title, children }, ref) => {
  const [value, setValue] = useState<boolean>(false)
  function toggle(show: boolean) {
    setValue(show)
  }
  useImperativeHandle(ref, () => ({
    toggle,
  }))
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const className = useMemo(() => {
    return [
      { class: 'border-r-1', value: bordered && align === 'left' },
      { class: 'border-l-1', value: bordered && align === 'right' },
      { class: 'border-stone-200', value: bordered }
    ].filter(cn => cn.value).map(cn => cn.class).join(' ')
  }, [bordered, align])

  return (
    <aside className={`${className} gradient-primary h-full flex-shrink overflow-y-auto z-10`} style={{ maxWidth: width, flexBasis: width }}>
      <div className="py-4 px-4 flex flex-col gap-4">
        {title && (
          <div className="text-2xl font-monda font-bold">
            {title}
          </div>
        )}
        {children}
      </div>
    </aside>
  )
})

export default Sidebar