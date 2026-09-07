import { Habit, type HabitProps } from '../domain/Habit'
import { HabitGateway } from '../contracts/gateways'

export type StoreHabitInputDTO = Omit<HabitProps, 'id' | 'manageFrom'> & {
    id: string | number | undefined
    manageFrom: null
}
export type StoreHabitOutputDTO = Omit<HabitProps, 'manageFrom'> & {
    manageFrom: null
}

export class StoreHabit {
    private _gateway: HabitGateway

    constructor(saveGateway: HabitGateway) {
        this._gateway = saveGateway
    }

    public async execute(input: StoreHabitOutputDTO): Promise<StoreHabitOutputDTO> {
        const existingHabit = await this._gateway.findByName(input.name.trim());
        if (existingHabit) {
        throw new Error(`A habit with name '${input.name}' already exists.`);
        }

        input.id = await this._gateway.generateId()
        const habit = new Habit(input)

        const data = {...habit.toPrimitives(), manageFrom: null }
        await this._gateway.store(data)

        return data
    }
}