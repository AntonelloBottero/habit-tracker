import { Table } from "dexie";
import { DexieDbClass, type DexieTableName } from "./DbClass";
import { type BaseGateway } from "../contracts/gateways"
import { type RawProps, type DomainProps, type Mapper } from "../contracts/mappers";

type DP = DomainProps
type RP = RawProps

export class DexieBaseGateway implements BaseGateway<RP, DP> {
    protected _table: Table
    protected _mapper: Mapper

    constructor(tableName: DexieTableName, mapper: Mapper) {
        const db = new DexieDbClass('HabiterDatabase')
        db.open()
        this._table = db.table(tableName)
        this._mapper = mapper
    }

    // GET
    public async show(id: string | number): Promise<DP | null> {
        const item = await this._table.where('id').equals(id).and(item => item.deleted_at === '').first()
        return this._mapper.toDomain(item)
    }

    public async index(): Promise<DP[]> {
        const items = await this._table.where('deleted_at').equals('').toArray()
        return items.map(this._mapper.toDomain)
    }

    public async generateId() {
        return Math.floor(Math.random() * 1000)
    }

    // Save
    public async store(domainValues: Partial<DP>): Promise<DP> {
        const values = this._mapper.toRaw(domainValues)
        await this._table.add({
            deleted_at: '', // deleted_at is first, so it can be easily overwritten by values
            ...values,
            created_at: new Date().toISOString(), // created at -> now
        })
        return await this.show(values.id) as DP
    }

    public async update(id: string | number, domainValues: Partial<DP>): Promise<DP> {
        const values = this._mapper.toRaw(domainValues)
        const storedValues = await this.show(id) // we fetch the existing resource so we can update the entire resource even if domainValues is Partial

        await this._table.put({
            ...storedValues,
            ...values,
            updated_at: new Date().toISOString() // last update -> now
        })
        return await this.show(values.id) as DP
    }

    // Delete
    public async delete(id: string | number): Promise<void> {
        await this._table.delete(id)
    }
}