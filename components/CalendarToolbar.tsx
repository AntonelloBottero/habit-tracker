
import FullCalendar from '@fullcalendar/react'
import { ChevronLeft, ChevronRight } from '@project-lary/react-material-symbols-700-rounded'
import { DateTime } from 'luxon'
import { useState, useEffect, useMemo, type ReactElement, RefObject } from 'react'

interface Props {
	ref: RefObject<FullCalendar | null>
	actions?: ReactElement
}

export default function CalendarToolbar({ ref, actions }: Props) {
  const today = DateTime.now().toISODate()

  const [view, setView] = useState<string | null>(null)
  const [date, setDate] = useState<DateTime | null>(null)
  const [from, setFrom] = useState<DateTime | null>(null)
  const [to, setTo] = useState<DateTime | null>(null)

  useEffect(() => {
    setParams()
  }, [ref])

  function setParams() {
    const calendarApi = ref?.current?.getApi()
    if(!calendarApi) { return undefined }
    setView(calendarApi.view.type)
    setDate(DateTime.fromJSDate(calendarApi.getDate()))
    setFrom(DateTime.fromJSDate(calendarApi.view.activeStart))
    setTo(DateTime.fromJSDate(calendarApi.view.activeEnd))
  }

  const todayIsInRange = useMemo(() => {
    if(!from || !to) { return false }

    return today >= from.toISODate() && today <= to.toISODate()
  }, [from, to])

  const rangeStr = useMemo(() => {
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
  }, [date, from, to, view])

  return (
    <div className="flex items-center">
      <button type="button" className="ht-btn ht-interaction py-2 px-2 mr-2 rounded-lg bg-neutral-800 text-white">
        <ChevronLeft className="text-2xl" />
      </button>
      <button type="button" className="ht-btn ht-interaction py-2 px-2 mr-2 rounded-lg bg-neutral-800 text-white">
        <ChevronRight className="text-2xl" />
      </button>
      <div className="text-2xl font-monda font-bold">
        { rangeStr }
      </div>
    </div>
  )
}