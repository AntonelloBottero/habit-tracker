import { DexieBaseGateway } from "@/src/shared/infrastructure/gateways"
import { UserMapper, UserRawProps } from "../mappers/UserMapper"
import { UserProps } from "../domain/User"
import { UserGateway } from "../contracts/gateways"
import Dexie from "dexie"

export class DexieUserGateway extends DexieBaseGateway<UserRawProps,UserProps> implements UserGateway {
    constructor(db: Dexie) {
        super(db, 'users', new UserMapper())
    }
}