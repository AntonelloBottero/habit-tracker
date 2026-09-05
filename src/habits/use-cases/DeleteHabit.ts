import { type HabitProps } from '../domain/Habit'
import { type DeleteGateway, type SearchGateway } from '../../shared/gateways/contracts'

export type DeleteHabitOutputDTO = void

export type DeleteHabitGateway = DeleteGateway & SearchGateway<HabitProps>

export class StoreHabit {
    private _gateway: DeleteHabitGateway

    constructor(gateway: DeleteHabitGateway) {
        this._gateway = gateway
    }

    public async execute(id: string | number): Promise<void> {
        // input validations
        const storedHabit = await this._gateway.findById(id)
        if(!storedHabit) {
            throw new Error(`The habit to be deleted doesn't exists.`)
        }

        await this._gateway.delete(id)
    }
}