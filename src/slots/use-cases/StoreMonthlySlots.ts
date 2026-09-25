import { Granularity } from '@/src/shared/contracts/consts'
import { SlotGateway } from '../contracts/gateways'
import { HabitProps } from '@/src/habits/domain/Habit'
import { SlotProps } from '../domain/Slot'

export interface StoreMonthlySlotsInputTDO {
    habits: HabitProps[]
    date?: Date
}

export class StoreMonthlySlots {
    private _gateway: SlotGateway

    constructor(gateway: SlotGateway) {
        this._gateway = gateway
    }
    
    async execute({ habits, date = new Date() }: StoreMonthlySlotsInputTDO) {

    }

    // Utils
    private calculateGranularityDays(granularity: Granularity, date: Date) {
        // given a certain granularity, returns the exact number of days
        switch(granularity) {
            case 'weekly':
                return 7
            case 'monthly': // exact number of days of the month
                const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
                const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 0)
                return Math.floor((endOfMonth.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24))
            case 'yearly': // exact number of days of the year
                const startOfYear = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0)
                const endOfYear = new Date(date.getFullYear(), 12, 0, 23, 59, 59, 0)
                return Math.floor((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
            case 'daily':
            default:
                return 1 // next day
        }
    }

    private calculateHabitMonthlySlots(habit: HabitProps, date: Date): SlotProps[] {
        let activeTo = date
        const slots = []
        do {
            slots.push({
                id: 1, // TODO: generateId
                habitId: habit.id,
                eventIds: [],
                count: habit.granularityTimes,
                completion: 0,
                activeTo
            })
            activeTo = new Date(activeTo.getFullYear(), activeTo.getMonth(), activeTo.getDate() - this.calculateGranularityDays(habit.granularity, activeTo), activeTo.getHours(), activeTo.getMinutes(), activeTo.getSeconds(), activeTo.getMilliseconds())
        } while(activeTo.getTime() >= date.getTime()) // temporarily removing a day/week/month/year simulates an active_from field (we won't add a new slot if the active period spans across two months)

        return slots
    }
}