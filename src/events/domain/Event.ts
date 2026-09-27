export interface EventProps {
    id: string | number
    habitId: string | number
    date: Date
    completed: number
}

export class Event {
    private _props: EventProps

    constructor(props: EventProps) {
        if(!props.id) {
            throw new Error('Event ID is required')
        }
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