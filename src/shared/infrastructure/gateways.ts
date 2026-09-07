import { SearchGateway } from "../contracts/gateways";
import { DbClass } from "./DbClass";

class BaseGateway {
    private _db: DbClass
    constructor(storeName: string) {
        this._db = new DbClass()
    }
}