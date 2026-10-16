import { EventMapper, EventRawProps } from "@/src/events/mappers/EventMapper"
import { HabitMapper, HabitRawProps } from "@/src/habits/mappers/HabitMapper"
import { IndexHabits } from "@/src/habits/use-cases/IndexHabits"
import { SlotMapper, SlotRawProps } from "@/src/slots/mappers/SlotMapper"
import { useState } from "react"
import { useInfrastructure } from "../infrastructure/InfrastructureContext"
import { IndexInRangeSlots } from "@/src/slots/use-cases/IndexInRangeSlots"
import { CalendarEvent } from "../contracts/formatters"
import { HabitWithSlots } from "@/app/types"
import { IndexInRangeEvents } from "@/src/events/use-cases/IndexInRangeEvents"

const eventMapper = new EventMapper()
const habitMapper = new HabitMapper()
const slotMapper = new SlotMapper()

export default function useCalendar() {
    // Init Infrastructure
    const { eventGateway, slotGateway, habitGateway } = useInfrastructure()

    // internal state
    const [habits, setHabits] = useState<HabitRawProps[]>([])
    const [slots, setSlots] = useState<SlotRawProps[]>([])
    const [events, setEvents] = useState<EventRawProps[]>([])

    async function indexEventables(from: string, to: string): Promise<void> {
        const fromDate = new Date(from)
        const toDate = new Date(to)
        // slots
        const _slots = await new IndexInRangeSlots(slotGateway).execute({ from: fromDate, to: toDate })
        setSlots(_slots.map(slot => slotMapper.toRaw(slot)))
        // habits
        const _habits = await new IndexHabits(habitGateway).execute()
        setHabits(_habits.map(habit => habitMapper.toRaw(habit)))
        // events
        const _events = await new IndexInRangeEvents(eventGateway).execute({ from: fromDate, to: toDate })
        setEvents(_events.map(event => eventMapper.toRaw(event)))
    }

    const habitsWithSlots = habits.map((habit) => ({
        ...habit,
        slots: slots.filter(slot => slot.habit_id === habit.id)
    })).filter(habit => habit.slots.length) as unknown as HabitWithSlots[] // TODO fix types

    const calendarEvents = events
        .map(event => {
        const habit = habits?.find(habit => habit.id === event.habit_id)
        if(!habit) { return null }
        return {
            ...event,
            habit,
            // fullcalendar compliant params
            title: habit.name,
            start: event.date,
            end: event.date, // TODO: change if end must be greater than start
            color: habit.color
        }
        })
        .filter(Boolean) as CalendarEvent[]

    return {
        indexEventables,
        events: calendarEvents,
        habits: habitsWithSlots
    }
}