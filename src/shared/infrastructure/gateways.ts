import { type Dexie, type Table } from "dexie";
import { type DexieTableName } from "./DbClass";
import { type BaseGateway } from "../contracts/gateways"
import { type RawProps, type DomainProps, type Mapper } from "../contracts/mappers";

export class DexieBaseGateway<TRaw extends RawProps, TDomain extends DomainProps> implements BaseGateway<TRaw, TDomain> {
    protected _table: Table
    protected _mapper: Mapper<TRaw, TDomain>

    constructor(db: Dexie, tableName: DexieTableName, mapper: Mapper<TRaw, TDomain>) {
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

    public generateId() { // business logic requires a prior ID generation. Dexie doesn't support such feature, so we return a mocked id to discard before every store operation
        return Math.floor(Math.random() * 1000)
    }

    public async getUserId() {
        return 1 // there is no login and everything is managed through indexedDb, so we return a mock id
    }

    // Save
    private _buildStoreProps(domainValues: TDomain) {
        const now = new Date().toISOString()
        return {
            deleted_at: '', // deleted_at is first, so it can be easily overwritten by values
            ...this._mapper.toRaw(domainValues),
            id: undefined, // we discard mocked id
            created_at: now, // created at -> now
            updated_at: now, // last update -> now
        }
    }

    public async store(domainValues: TDomain): Promise<TDomain> {
        const values = this._buildStoreProps(domainValues)

        const newId = await this._table.add(values)
        return this._mapper.toDomain({...values, id: newId }) as TDomain // we overwrite type checker because we for sure have the complete TDomain
    }

    public async bulkStore(domains: TDomain[]): Promise<void> {
        const values = domains.map(domain => this._buildStoreProps(domain))
        await this._table.bulkAdd(values)
    }

    public async update(id: string | number, domainValues: TDomain): Promise<TDomain> {
        const values = this._mapper.toRaw(domainValues)
        const storedDomainValues = await this.show(id) // we fetch the existing resource so we can update the entire resource even if domainValues is Partial
        if(!storedDomainValues) {
            throw new Error("Cannot update a non-existing resource")
        }

        const updatedRaw = {
            ...this._mapper.toRaw(storedDomainValues),
            ...values,
            id,
            updated_at: new Date().toISOString() // last update -> now
        }
        await this._table.put(updatedRaw)
        return this._mapper.toDomain(updatedRaw) as TDomain // we overwrite type checker because we for sure have the complete TDomain
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