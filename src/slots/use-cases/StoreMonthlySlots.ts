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
        const slots = habits.map(habit => this._calculateHabitMonthlySlots(habit, date)).flat()
        await this._gateway.bulkStore(slots)
    }

    // Utils
    private _calculateGranularityDays(granularity: Granularity, date: Date) {
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

    private _calculateHabitMonthlySlots(habit: HabitProps, date: Date): SlotProps[] {
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 0) // used to check when to stop calculation
        let activeTo = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0) // we begin loading calculating slots since the start of month
        const slots = []
        while(activeTo.getTime() <= endOfMonth.getTime()) {
            slots.push({
                id: this._gateway.generateId(),
                habitId: habit.id,
                eventIds: [],
                count: habit.granularityTimes,
                completion: 0,
                activeTo
            })
            activeTo = new Date(
                activeTo.getFullYear(),
                activeTo.getMonth(),
                activeTo.getDate() - this._calculateGranularityDays(habit.granularity, activeTo), 
                activeTo.getHours(),
                activeTo.getMinutes(),
                activeTo.getSeconds(),
                activeTo.getMilliseconds()
            )
        }

        return slots
    }
}