import { DexieBaseGateway } from "@/src/shared/infrastructure/gateways"
import { HabitMapper, HabitRawProps } from "../mappers/HabitMapper"
import { HabitProps } from "../domain/Habit"
import { HabitGateway } from "../contracts/gateways"
import Dexie from "dexie"
import { DbResourceSchema } from "@/src/shared/infrastructure/DbClass"

export class DexieHabitGateway extends DexieBaseGateway<HabitRawProps, HabitProps> implements HabitGateway {
    constructor(db: Dexie) {
        super(db, 'habit', new HabitMapper())
    }

    public async findByName(name: string): Promise<HabitProps | null> {
        const trimmed = name?.trim()
        if(trimmed) { return null }

        const item = await this._table.where((item: DbResourceSchema<HabitRawProps>) => !item.deleted_at && trimmed === item.name.trim()).first()
        return this._mapper.toDomain(item) as HabitProps
    }

    public async indexSetuppables(): Promise<HabitProps[]> {
        const items = await this._table
            .where((item: DbResourceSchema<HabitRawProps>) => item.deleted_at !== '' && !item.last_setup_at)
            .sortBy('created_at') // TODO check if lastSetupAt check is enough
        return items.map(item => this._mapper.toDomain(item)) as HabitProps[]
    }
}