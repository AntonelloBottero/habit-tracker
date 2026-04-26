
import { CalendarApi } from '@fullcalendar/core/index.js'
import FullCalendar from '@fullcalendar/react'
import { ChevronLeft, ChevronRight } from '@project-lary/react-material-symbols-700-rounded'
import { DateTime } from 'luxon'
import { useState, useTransition, useEffect, type ReactElement, RefObject } from 'react'

interface Props {
	ref: RefObject<FullCalendar | null>
  className?: string
	children?: ReactElement
}

export default function CalendarToolbar({ ref, className = '', children }: Props) {
  const [rangeStr, setRangeStr] = useState<string | undefined>(undefined)
  const [, startTransition] = useTransition()

  function calendarApi(): CalendarApi | undefined {
    return ref.current?.getApi()
  }

  useEffect(() => {
    setParams()
  }, [ref])

  function setParams() {
    startTransition(() => {
      const _calendarApi = calendarApi()
      if(!_calendarApi) { return undefined }

      const view = _calendarApi?.view.type
      const date = DateTime.fromJSDate(_calendarApi.getDate())
      const from = DateTime.fromJSDate(_calendarApi.view.activeStart)
      const to = DateTime.fromJSDate(_calendarApi.view.activeEnd)

      setRangeStr((() => {
        if(!date || !from || !to) { return '' }

        switch(view) {
        case 'dayGridMonth':
          return date.toFormat('LLLL yyyy')
        case 'dayGridDay':
          return date.toFormat('dd LLLL yyyy')
        default:
          let fromFormat = 'dd'
          if(from.toFormat('MM') !== to.toFormat('MM')) { fromFormat += ' LLLL' }
          if(from.toFormat('yyyy') !== to.toFormat('MM')) { fromFormat += ' yyyy' }
          return `From ${from.toFormat(fromFormat)} To ${to.toFormat('dd LLLL yyyy')}`
        }
      })())
    })
  }

  function calendarAction(action?: () => void) {
    if(!action) { return undefined }
    action()
    setParams()
  }

  return calendarApi() ? (
    <div className={`${className} flex items-center gap-2`}>
      <button type="button" className="ht-btn ht-interaction py-1.5 px-1.5 -my-1 rounded-lg bg-neutral-800 text-white" onClick={() => calendarAction(() => calendarApi()?.prev())}>
        <ChevronLeft className="text-2xl" />
      </button>
      <button type="button" className="ht-btn ht-interaction py-1.5 px-1.5 -my-1 rounded-lg bg-neutral-800 text-white" onClick={() => calendarAction(() => calendarApi()?.next())}>
        <ChevronRight className="text-2xl" />
      </button>
      <div className="text-xl font-monda font-bold ml-2 mr-auto">
        { rangeStr }
      </div>

      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  ) : null
}