import { type HabitProps } from '../domain/Habit'
import { HabitGateway } from '../contracts/gateways'

export interface IndexByIdsInputDTO {
    ids: (string | number)[]
}
export type IndexByIdsOutputDTO = HabitProps[]

export class IndexByIds {
    private _gateway: HabitGateway

    constructor(gateway: HabitGateway) {
        this._gateway = gateway
    }

    public async execute({ ids }: IndexByIdsInputDTO): Promise<IndexByIdsOutputDTO> {
        return await this._gateway.indexByIds(ids)
    }
}