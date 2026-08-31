const types = ['good', 'bad'] as const
const granularities = ['daily', 'weekly', 'monthly', 'yearly'] as const

export type Type = typeof types[number]
export type Granularity = typeof granularities[number]

export interface HabitProps {
    type: Type,
    name: string,
    color: string,
    granularity: Granularity,
    includeWeekends: boolean,
    granularityTimes: number,
    enoughAmount: string,
    manageFrom: Date
}

export class Habit {
    private _props: HabitProps

    constructor(props: HabitProps) {
        if(!types.includes(props.type)) {
            throw new Error('Type is neither good nor bad')
        }
        if(!props.name) {
            throw new Error('Name not set')
        }
        if(!granularities.includes(props.granularity)) {
            throw new Error('Granularity not supported')
        }
        this._props = props
    }

    public toPrimitives(): Readonly<HabitProps> {
        return Object.freeze({...this._props})
    }
}