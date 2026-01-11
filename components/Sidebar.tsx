import { useState, useEffect, forwardRef, useImperativeHandle, type ReactNode } from 'react'
import { SidebarRef } from '@/app/types'

interface Props {
    initialValue?: boolean
    width?: string // 300px, 70%, ecc
    align?: 'left' | 'right'
    bordered?: boolean
    children?: ReactNode
}

const Sidebar = forwardRef<SidebarRef, Props>(({ initialValue = false, width = '256px', align = 'left', bordered = true, children }, ref) => {
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
    <aside className="gradient-primary h-full flex-shrink overflow-y-scroll" style={{ maxWidth: width, flexBasis: width }}>
      <div className="pa-6">
        {children}
      </div>
    </aside>
  )
})

export default Sidebar