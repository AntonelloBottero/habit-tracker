import { type HabitProps } from '../domain/Habit'
import { HabitGateway } from '../contracts/gateways'

export type ShowHabitOutputDTO = HabitProps

export class ShowHabit {
    private _gateway: HabitGateway

    constructor(gateway: HabitGateway) {
        this._gateway = gateway
    }

    public async execute(id: string | number): Promise<ShowHabitOutputDTO> {
        // input validations
        const storedHabit = await this._gateway.findById(id)
        if(!storedHabit) {
            throw new Error(`The habit to be deleted doesn't exists.`)
        }

        return storedHabit
    }
}