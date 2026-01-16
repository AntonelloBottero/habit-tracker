import { useState, useEffect, forwardRef, useImperativeHandle, type ReactNode } from 'react'
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

  return (
    <aside className="gradient-primary h-full flex-shrink overflow-y-auto border-l-1 border-stone-200 z-100" style={{ maxWidth: width, flexBasis: width }}>
      <div className="py-4 px-4">
        {title && (
          <div className="text-2xl font-monda font-bold mb-4">
            {title}
          </div>
        )}
        {children}
      </div>
    </aside>
  )
})

export default Sidebar