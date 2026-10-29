import { DexieBaseGateway } from "@/src/shared/infrastructure/gateways"
import { UserMapper, UserRawProps } from "../mappers/UserMapper"
import { UserProps } from "../domain/User"
import { UserGateway } from "../contracts/gateways"
import Dexie from "dexie"

export class DexieUserGateway extends DexieBaseGateway<UserRawProps,UserProps> implements UserGateway {
    constructor(db: Dexie) {
        super(db, 'users', new UserMapper())
    }

    public generateId() {
        return 1
    }

    public async store(domainValues: UserProps): Promise<UserProps> {
        const values = this._buildStoreProps(domainValues)
        const newId = await this._table.add({...values, id: domainValues.id }) // overwritten userId to keep user always known
        return this._mapper.toDomain({...values, id: newId }) as UserProps
    }
}