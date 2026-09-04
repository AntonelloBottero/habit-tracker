import { Habit, type HabitProps } from '../domain/Habit'
import { type SaveGateway } from '../../shared/gateways/contracts'

export type StoreHabitInputDTO = HabitProps & {
    id: string | number | undefined
    manageFrom: null
}
export type StoreHabitOutputDTO = HabitProps & {
    manageFrom: null
}

export type StoreHabitGateway = SaveGateway<StoreHabitOutputDTO> & {
    findByName: (name: string) => Promise<StoreHabitOutputDTO | null>
}

export class StoreHabit {
    private _gateway: StoreHabitGateway

    constructor(saveGateway: StoreHabitGateway) {
        this._gateway = saveGateway
    }

    public async execute(input: StoreHabitOutputDTO) {
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