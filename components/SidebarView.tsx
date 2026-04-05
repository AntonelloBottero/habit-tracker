import { useEffect, useMemo, type ReactNode, type ChangeEvent } from 'react'
import useBreakpoints, { type BreakpointKey } from '@/hooks/useBreakpoints'
import { RightPanelClose } from '@project-lary/react-material-symbols-700-rounded'

interface SidebarChangeEvent {
  target: {
    value: boolean
  }
}

interface Props {
    value: boolean
    onChange?: (e: SidebarChangeEvent) => void
    breakpoint?: BreakpointKey
    width?: number
    align?: 'left' | 'right'
    bordered?: boolean
		content: ReactNode | ReactNode[] // content of the sidebar
    children: ReactNode | ReactNode[] // view content
}

export default function SidebarView({ value, onChange, breakpoint = 'md', width = 256, align = 'left', bordered = true, content, children }: Props) {
  function change(value: boolean): void {
    if(onChange) {
      onChange({
        target: {
          value
        }
      })
    }
  }

  // --- Manage breakpoint ---
  const { windowWidth, breakpoints } = useBreakpoints()

  const hasBreakpoint = useMemo(() => {
    return breakpoints ? breakpoints[breakpoint] : false
  }, [breakpoint, breakpoints])

  useEffect(() => {
    change(hasBreakpoint)
  }, [hasBreakpoint])

  // --- JSX attrs ---
  const transitionClassName = 'duration-500 ease-in-out'

  const safeWidth = `${width <= (windowWidth - 40) ? width : (windowWidth - 40)}px`

  const wrapperAttrs = {
    style: {
      paddingLeft: value && hasBreakpoint && align === 'left' ? safeWidth : '0px',
      paddingRight: value && hasBreakpoint && align === 'right' ? safeWidth : '0px'
    }
  }

  const childrenWrapperAttrs = {
    className: [
      { class: `transition-${align}`, value: true },
      { class: transitionClassName, value: !hasBreakpoint },
      { class: 'min-w-full h-full max-h-full overflow-y-auto relative z-2', value: true }
    ].filter(cn => cn.value).map(cn => cn.class).join(' '),
    style: {
      [align]: value && !hasBreakpoint ? safeWidth : '0px',
    }
  }

  const asideAttrs = {
    className: [
      { class: 'border-r-1', value: bordered && align === 'left' },
      { class: 'border-l-1', value: bordered && align === 'right' },
      { class: 'border-stone-200', value: bordered },
      { class: `transition-${align}`, value: true },
      { class: `absolute top-0 h-full overflow-y-auto bg-white ${transitionClassName}`, value: true, }
    ].filter(cn => cn.value).map(cn => cn.class).join(' '),
    style: {
      width: safeWidth,
      [align]: !value ? `-${safeWidth}` : '0px'
    }
  }

  return (
    <div {...wrapperAttrs} className={`w-full h-full min-h-full relative overflow-hidden transition-padding ${transitionClassName}`}>
      <div {...childrenWrapperAttrs}>
        {children}
        {value && !hasBreakpoint && (
          <>
            <div className="absolute top-0 left-0 w-full h-full bg-neutral-800 opacity-90 z-3" />
            {onChange && (
              <div className="absolute top-0 right-0 z-4 mt-6 mr-1">
                <button type="button" className=" ht-btn ht-interaction py-2 px-2 rounded-lg text-white" onClick={() => { change(!value) }}>
                  <RightPanelClose className="text-2xl" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <aside {...asideAttrs}>
        <div className="py-4 px-4 flex flex-col gap-4">
          {content}
        </div>
      </aside>
    </div>
  )
}