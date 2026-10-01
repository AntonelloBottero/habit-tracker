import { type HabitProps } from '../domain/Habit'
import { HabitGateway } from '../contracts/gateways'

export interface IndexHabitsByIdsInputDTO {
    ids: (string | number)[]
}
export type IndexHabitsByIdsOutputDTO = HabitProps[]

export class IndexHabitsByIds {
    private _gateway: HabitGateway

    constructor(gateway: HabitGateway) {
        this._gateway = gateway
    }

    public async execute({ ids }: IndexHabitsByIdsInputDTO): Promise<IndexHabitsByIdsOutputDTO> {
        return await this._gateway.indexByIds(ids)
    }
}