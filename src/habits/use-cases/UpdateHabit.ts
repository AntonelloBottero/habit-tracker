import { Habit, type HabitProps } from '../domain/Habit'
import { HabitGateway } from '../contracts/HabitGateway'
import { selectiveMerge } from '../../shared/utils/obj'

export type UpdateHabitInputDTO = Partial<Omit<HabitProps, 'id'>>
export type UpdateHabitOutputDTO = HabitProps

export class UpdateHabit {
    private _gateway: HabitGateway

    constructor(saveGateway: HabitGateway) {
        this._gateway = saveGateway
    }

    public async execute(id: string | number, input: UpdateHabitInputDTO): Promise<UpdateHabitOutputDTO> {
        // input validations
        const storedHabit = await this._gateway.findById(id)
        if(!storedHabit) {
            throw new Error(`The habit to be edited doesn't exists.`)
        }
        if(input.name?.trim()) {
            const existingHabit = await this._gateway.findByName(input.name.trim(), id);
            if (existingHabit) {
                throw new Error(`A habit with name '${input.name}' already exists.`);
            }
        }

        const merged = selectiveMerge(storedHabit, input)
        const habit = new Habit(merged)

        return await this._gateway.update(id, habit.toPrimitives())
    }
}