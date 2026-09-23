import { type HabitProps } from '../domain/Habit'
import { HabitGateway } from '../contracts/gateways'

export type IndexManageableHabitsOutputDTO = HabitProps[]

export class IndexManageableHabits {
    private _gateway: HabitGateway

    constructor(gateway: HabitGateway) {
        this._gateway = gateway
    }

    public async execute(): Promise<IndexManageableHabitsOutputDTO> {
        return await this._gateway.indexManageables()
    }
}