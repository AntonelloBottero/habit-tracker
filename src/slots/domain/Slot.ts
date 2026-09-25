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
        if(!props.activeTo || isNaN(props.activeTo.getTime())) {
            throw new Error('Active to from must be a real date')
        }

        this._props = props
    }

    // Getters
    public toPrimitives(): Readonly<SlotProps> {
        return Object.freeze({...this._props})
    }
}