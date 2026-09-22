import { type HabitProps } from '../domain/Habit'
import { HabitGateway } from '../contracts/gateways'

export type IndexSetuppableHabitsOutputDTO = HabitProps[]

export class IndexSetuppablesHabits {
    private _gateway: HabitGateway

    constructor(gateway: HabitGateway) {
        this._gateway = gateway
    }

    public async execute(): Promise<IndexSetuppableHabitsOutputDTO> {
        return await this._gateway.indexSetuppables()
    }
}