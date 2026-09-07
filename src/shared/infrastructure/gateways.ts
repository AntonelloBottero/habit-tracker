import { Table } from "dexie";
import { BaseGateway } from "../contracts/gateways";
import { DexieDbClass, type DexieTableName } from "./DbClass";

class DexieBaseGateway implements BaseGateway<T> {
    private _table: Table
    constructor(tableName: DexieTableName) {
        const db = new DexieDbClass('HabiterDatabase')
        db.open()
        this._table = db.table(tableName)
    }

    public async show(id: number): Promise<T | null> {
        const item = await (this._table).where('id').equals(id).and(item => item.deleted_at === '').first()
        return item
    }
}