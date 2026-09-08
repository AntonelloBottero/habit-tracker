import { Table } from "dexie";
import { type BaseGateway } from "../contracts/gateways";
import { DexieDbClass, type DexieTableName, type DbResourceSchema } from "./DbClass";

type RawProps = Record<string, any>
type Props = Record<string, any>

export abstract class DexieBaseGateway implements BaseGateway<RawProps, Props> {
    private _table: Table
    protected abstract _toDomain: (raw: RawProps) => Props

    constructor(tableName: DexieTableName) {
        const db = new DexieDbClass('HabiterDatabase')
        db.open()
        this._table = db.table(tableName)
    }

    // GET
    public async show(id: string | number): Promise<Props | null> {
        const item = await this._table.where('id').equals(id).and(item => item.deleted_at === '').first()
        return this._toDomain(item)
    }

    public async index(): Promise<Props[]> {
        const items = await this._table.where('deleted_at').equals('').toArray()
        return items.map(this._toDomain)
    }

    public async store(values: Partial<RawProps>): Promise<Props | null> {
        await this._table.add({
            deleted_at: '', // deleted_at is first, so it can be easily overwritten by values
            ...values,
            created_at: new Date().toISOString(),
        })
        return await this.show(values.id)
    }
}