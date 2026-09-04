import { Habit, type HabitProps } from '../domain/Habit'
import { SearchGateway, type SaveGateway } from '../../shared/gateways/contracts'

export type UpdateHabitInputDTO = HabitProps & {
    id: undefined
    manageFrom: null
}
export type UpdateHabitOutputDTO = HabitProps & {
    manageFrom: null
}

export type UpdateHabitGateway = SaveGateway<UpdateHabitOutputDTO> & SearchGateway<UpdateHabitOutputDTO> & {
    findByName: (name: string, exclude?: string | number) => Promise<UpdateHabitOutputDTO | null>
}

export class UpdateHabit {
    private _gateway: UpdateHabitGateway

    constructor(saveGateway: UpdateHabitGateway) {
        this._gateway = saveGateway
    }

    public async execute(id: string | number, input: UpdateHabitOutputDTO) {
        const storedHabit = await this._gateway.findById(id)
        if(!storedHabit) {
            throw new Error(`The habit to be edited doesn't exists.`)
        }

        const existingHabit = await this._gateway.findByName(input.name.trim(), input.id);
        if (existingHabit) {
            throw new Error(`A habit with name '${input.name}' already exists.`);
        }

        const habit = new Habit(input) // TODO merge with storedHabit

        const data = {...habit.toPrimitives(), manageFrom: null }
        await this._gateway.update(data)

        return data
    }
}