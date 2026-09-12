import { DexieBaseGateway } from "@/src/shared/infrastructure/gateways"
import { HabitMapper, HabitRawProps } from "../mappers/HabitMapper"
import { HabitProps } from "../domain/Habit"
import { HabitGateway } from "../contracts/gateways"

export class DexieHabitGateway extends DexieBaseGateway implements HabitGateway {
    constructor() {
        super('habit', new HabitMapper())
    }

    public async findByName(name: string): Promise<HabitProps | null> {
        const trimmed = name?.trim()
        if(trimmed) { return null }

        const item = await this._table.where((item: HabitRawProps) => item.deleted_at !== '' && trimmed === item.name.trim()).first()
        return (this._mapper as HabitMapper).toDomain(item) as HabitProps
    }
}