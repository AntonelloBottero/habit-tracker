import { useState, useEffect, forwardRef, useImperativeHandle, type ReactNode, useMemo } from 'react'
import useBreakpoints from '@/hooks/ueBreakpoints'
import { SidebarRef } from '@/app/types'

interface Props {
    breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
    width?: string // 300px, 70%, ecc
    align?: 'left' | 'right'
    bordered?: boolean
    title?: string,
    children?: ReactNode
}

const Sidebar = forwardRef<SidebarRef, Props>(({ breakpoint = 'md', width = '256px', align = 'left', bordered = true, title, children }, ref) => {
  const { breakpoints, currents } = useBreakpoints()

  const [value, setValue] = useState<boolean>(false)
  function toggle(show: boolean) {
    setValue(show)
  }
  useImperativeHandle(ref, () => ({
    toggle,
  }))
  useEffect(() => {
    console.log('breakpoints', breakpoints)
    setValue(breakpoints[breakpoint])
  }, [breakpoint, breakpoints])

  const className = useMemo(() => {
    return [
      { class: 'border-r-1', value: bordered && align === 'left' },
      { class: 'border-l-1', value: bordered && align === 'right' },
      { class: 'border-stone-200', value: bordered }
    ].filter(cn => cn.value).map(cn => cn.class).join(' ')
  }, [bordered, align])

  return value ? (
    <aside className={`${className} gradient-primary h-full min-h-[100vh] flex-shrink self-stretch overflow-y-auto z-10`} style={{ maxWidth: width, flexBasis: width }}>
      <div className="py-4 px-4 flex flex-col gap-4">
        {title && (
          <div className="text-xl font-monda font-bold my-2">
            {title}
          </div>
        )}
        {children}
      </div>
    </aside>
  ) : null
})

export default Sidebar