import { Habit, type HabitProps } from '../domain/Habit'
import { SearchGateway, type SaveGateway } from '@shared/gateways/contracts'
import { selectiveMerge } from '@shared/utils/obj'

export type UpdateHabitInputDTO = HabitProps & {
    manageFrom: Date | null
}
export type UpdateHabitOutputDTO = UpdateHabitInputDTO

export type UpdateHabitGateway = SaveGateway<UpdateHabitOutputDTO> & SearchGateway<UpdateHabitOutputDTO> & { // TODO should return the Habit entity?
    findByName: (name: string, exclude?: string | number) => Promise<UpdateHabitOutputDTO | null>
}

export class UpdateHabit {
    private _gateway: UpdateHabitGateway

    constructor(saveGateway: UpdateHabitGateway) {
        this._gateway = saveGateway
    }

    public async execute(id: string | number, input: Partial<UpdateHabitOutputDTO>) {
        // input validations
        const storedHabit = await this._gateway.findById(id)
        if(!storedHabit) {
            throw new Error(`The habit to be edited doesn't exists.`)
        }
        if(input.name?.trim()) {
            const existingHabit = await this._gateway.findByName(input.name.trim(), input.id);
            if (existingHabit) {
                throw new Error(`A habit with name '${input.name}' already exists.`);
            }
        }
        if(input.manageFrom && isNaN(input.manageFrom.getTime())) {
            throw new Error('manage from must be a real date')
        }

        const merged = selectiveMerge(storedHabit, input)
        const habit = new Habit(merged)

        return await this._gateway.update(habit.toPrimitives())
    }
}