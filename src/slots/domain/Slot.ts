import { Granularity } from "@/src/shared/contracts/consts"

export interface SlotProps {
    id: string | number
    habitId: string | number
    eventIds: (string | number)[]
    count: number
    completion: number
    // application fields
    activeTo: Date // Date in which the slot expires and the habit is considered failed
}

export class Slot {
    private _props: SlotProps

    constructor(props: SlotProps) {
        if(!props.id) {
            throw new Error('Slot ID is required')
        }
        if(!props.habitId) {
            throw new Error('Habit ID is required')
        }
        if(props.count < 1) {
            throw new Error('Slot has to be planned to happen at least one time')
        }
        if(props.completion < 1) {
            throw new Error('Slot completion must be a positive number')
        }
        if(props.activeTo && isNaN(props.activeTo.getTime())) {
            throw new Error('Active to from must be a real date')
        }

        this._props = props
    }

    // Getters
    public toPrimitives(): Readonly<SlotProps> {
        return Object.freeze({...this._props})
    }

    // Utils
    public static calculateCount(granularity: Granularity, date: Date) { // TODO: make it an util or a method in CreateSlots use case
        // given a certain granularity, returns the most proper number of days
        switch(granularity) {
            case 'weekly':
                return 7
            case 'monthly': // return the exact number of days of the month
                const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
                const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 0)
                return Math.floor((endOfMonth.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24))
            case 'yearly': // return the exact number of days of the year
                const startOfYear = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0)
                const endOfYear = new Date(date.getFullYear(), 12, 0, 23, 59, 59, 0)
                return Math.floor((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
            case 'daily':
            default:
                return 1
        }
    }
}