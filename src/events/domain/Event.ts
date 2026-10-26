import { Domain, DomainProps } from "@/src/shared/domain/Domain"

export type EventProps = DomainProps & {
    habitId: string | number
    date: Date
    completed: number
}

export class Event extends Domain {
    protected _props: EventProps

    constructor(props: EventProps) {
        super()

        this._validateResourceProps(props)

        if(!props.habitId) {
            throw new Error('Habit ID is required')
        }
        if(!props.date || isNaN(props.date.getTime())) {
            throw new Error('Event Date must be a real date')
        }
        if(props.completed < 1) {
            throw new Error('Event completion must be a positive number')
        }

        this._props = props
    }

    // Getters
    public toPrimitives(): Readonly<EventProps> {
        return Object.freeze({...this._props})
    }
}