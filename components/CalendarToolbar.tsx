
import { CalendarApi } from '@fullcalendar/core/index.js'
import FullCalendar from '@fullcalendar/react'
import { ChevronLeft, ChevronRight } from '@project-lary/react-material-symbols-700-rounded'
import { DateTime } from 'luxon'
import { useState, useEffect, type ReactElement, RefObject } from 'react'

interface Props {
	ref: RefObject<FullCalendar | null>
  className?: string
	children?: ReactElement
}

export default function CalendarToolbar({ ref, className = '', children }: Props) {
  const [view, setView] = useState<string | undefined>(undefined)
  const [date, setDate] = useState<DateTime | undefined>(undefined)
  const [from, setFrom] = useState<DateTime | undefined>(undefined)
  const [to, setTo] = useState<DateTime | undefined>(undefined)

  function calendarApi(): CalendarApi | undefined {
    return ref.current?.getApi()
  }

  useEffect(() => {
    setParams()
  }, [ref])

  function setParams() {
    const _calendarApi = calendarApi()
    if(!_calendarApi) { return undefined }

    setView(_calendarApi?.view.type)
    setDate(DateTime.fromJSDate(_calendarApi.getDate()))
    setFrom(DateTime.fromJSDate(_calendarApi.view.activeStart))
    setTo(DateTime.fromJSDate(_calendarApi.view.activeEnd))
  }

  function calendarAction(action?: () => void) {
    if(!action) { return undefined }
    action()
    setParams()
  }

  const rangeStr = (() => { // even though this could be considered an expensive calculation, almost every dependency involved changes at the same time (batch), so caching the result with useMemo wouldn't give any kind of benefit
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
  })()

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