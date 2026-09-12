import { Table } from "dexie";
import { DexieDbClass, type DexieTableName } from "./DbClass";
import { type BaseGateway } from "../contracts/gateways"
import { type RawProps, type DomainProps, type Mapper } from "../contracts/mappers";

export class DexieBaseGateway<TRaw extends RawProps, TDomain extends DomainProps> implements BaseGateway<TRaw, TDomain> {
    protected _table: Table
    protected _mapper: Mapper<TRaw, TDomain>

    constructor(tableName: DexieTableName, mapper: Mapper<TRaw, TDomain>) {
        const db = new DexieDbClass('HabiterDatabase')
        db.open()
        this._table = db.table(tableName)
        this._mapper = mapper
    }

    // GET
    public async show(id: string | number): Promise<TDomain | null> {
        const item = await this._table.where('id').equals(id).and(item => item.deleted_at === '').first()
        if(!item) { return null }
        return this._mapper.toDomain(item) as TDomain
    }

    public async index(): Promise<TDomain[]> {
        const items = await this._table.where('deleted_at').equals('').toArray()
        return items.map((item) => this._mapper.toDomain(item)) as TDomain[]
    }

    public async generateId() {
        return Math.floor(Math.random() * 1000)
    }

    // Save
    public async store(domainValues: Partial<TDomain>): Promise<TDomain> {
        const values = this._mapper.toRaw(domainValues)
        await this._table.add({
            deleted_at: '', // deleted_at is first, so it can be easily overwritten by values
            ...values,
            created_at: new Date().toISOString(), // created at -> now
        })
        return await this.show(values.id) as TDomain
    }

    public async update(id: string | number, domainValues: Partial<TDomain>): Promise<TDomain> {
        const values = this._mapper.toRaw(domainValues)
        const storedDomainValues = await this.show(id) // we fetch the existing resource so we can update the entire resource even if domainValues is Partial
        if(!storedDomainValues) {
            throw new Error("Cannot update a non-existing resource")
        }

        await this._table.put({
            ...this._mapper.toRaw(storedDomainValues),
            ...values,
            id,
            updated_at: new Date().toISOString() // last update -> now
        })
        return await this.show(values.id) as TDomain
    }

    // Delete
    public async delete(id: string | number): Promise<void> {
        const storedDomainValues = await this.show(id)
        if(!storedDomainValues) { return }

        await this._table.put({
            ...this._mapper.toRaw(storedDomainValues),
            id,
            deleted_at: new Date().toISOString() // last delete -> now
        })
    }
}