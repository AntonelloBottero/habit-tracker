const types = ['good', 'bad'] as const
const granularities = ['daily', 'weekly', 'monthly', 'yearly'] as const

export type Type = typeof types[number]
export type Granularity = typeof granularities[number]

export interface HabitProps {
    id: string | number
    userId: string | number
    type: Type
    name: string
    color: string
    granularity: Granularity
    includeWeekends: boolean
    granularityTimes: number
    enoughAmount: string
    // application fields
    // every field represents the Entity state, even though is not critical business logic
    manageFrom: Date | null
    lastSetupAt: Date | null
}

export class Habit {
    private _props: HabitProps

    constructor(props: HabitProps) {
        if(!props.id) {
            throw new Error('Habit ID is required')
        }
        if(!props.userId) {
            throw new Error('User ID is required')
        }
        if(!types.includes(props.type)) {
            throw new Error('Type is neither good nor bad')
        }
        if(!props.name || props.name.trim() === '') {
            throw new Error('Name not set')
        }
        if(!granularities.includes(props.granularity)) {
            throw new Error('Granularity not supported')
        }
        if(Number.isNaN(props.granularityTimes) || props.granularityTimes < 1) {
            throw new Error('Adopt the Habit at least one time')
        }
        if(props.manageFrom && isNaN(props.manageFrom.getTime())) {
            throw new Error('manage from must be a real date')
        }
        if(props.lastSetupAt && isNaN(props.lastSetupAt.getTime())) {
            throw new Error('last setup at must be a real date')
        }
        this._props = props
    }

    // Getters
    public toPrimitives(): Readonly<HabitProps> {
        return Object.freeze({...this._props})
    }

    // how many times we allow an habit to be registered depends on the timespan
    public static getAllowedGranularityTimes(granularity: Granularity): number[] { // this is designed to be used easily by both Use cases and Adapters, so it's designed as a static method
        let count = 1
        switch(granularity) {
        case 'weekly':
            count = 3
            break
        case 'monthly':
            count = 5
            break
        case 'yearly':
            count = 8
            break
        }
        return Array.from({ length: count }, (_, i) => i + 1)
    }
}