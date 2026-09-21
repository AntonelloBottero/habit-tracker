import { type HabitProps } from '../domain/Habit'
import { HabitGateway } from '../contracts/gateways'

export type IndexHabitsOutputDTO = HabitProps[]

export class IndexHabits {
    private _gateway: HabitGateway

    constructor(gateway: HabitGateway) {
        this._gateway = gateway
    }

    public async execute(): Promise<IndexHabitsOutputDTO> {
        return await this._gateway.index()
    }
}