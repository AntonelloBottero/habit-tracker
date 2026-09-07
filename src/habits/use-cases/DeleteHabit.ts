import { HabitGateway } from '../contracts/gateways'

export type DeleteHabitOutputDTO = void

export class DeleteHabit {
    private _gateway: HabitGateway

    constructor(gateway: HabitGateway) {
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