import { EventRawProps } from "@/src/events/mappers/EventMapper"
import { HabitRawProps } from "@/src/habits/mappers/HabitMapper"
import { SlotRawProps } from "@/src/slots/mappers/SlotMapper"

export type CalendarEvent = EventRawProps & {
    habit: HabitRawProps
    // fullcalendar compliant params
    title: string
    start: string
    end: string
    color: string
}

export type HabitWithSlots = HabitRawProps & {
    slot: SlotRawProps[]
}