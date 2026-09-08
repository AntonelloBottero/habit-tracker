import { Table } from "dexie";
import { type BaseGateway } from "../contracts/gateways";
import { DexieDbClass, type DexieTableName, type DbResourceSchema } from "./DbClass";

type T = Record<string, any>

export class DexieBaseGateway implements BaseGateway<T> {
    private _table: Table
    constructor(tableName: DexieTableName) {
        const db = new DexieDbClass('HabiterDatabase')
        db.open()
        this._table = db.table(tableName)
    }

    // GET
    public async show(id: string | number): Promise<T | null> {
        const item = await this._table.where('id').equals(id).and(item => item.deleted_at === '').first()
        return item
    }

    public async index(): Promise<T[]> {
        return await this._table.where('deleted_at').equals('').toArray()
    }

    public async store(values: Partial<T>): Promise<T | null> {
        
    }
}