
import FullCalendar from '@fullcalendar/react'
import { DateTime } from 'luxon'
import { useState, useEffect, useMemo, type ReactElement, RefObject } from 'react'

interface Props {
	ref: RefObject<FullCalendar>
	actions?: ReactElement
}

export default function CalendarHeader({ ref, actions }: Props) {
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
}