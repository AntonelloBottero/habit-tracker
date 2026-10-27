import { UserGateway } from "../contracts/gateways"
import { defaultUserOptions, User, type UserProps } from "../domain/User"

export type StoreUserInputDTO = Omit<UserProps, 'id' | 'options'>
export type StoreUserOutputDTO = UserProps

export class StoreUser {
    private _gateway: UserGateway

    constructor(gateway: UserGateway) {
        this._gateway = gateway
    }

    public async execute(input: StoreUserInputDTO): Promise<StoreUserOutputDTO> {
        const id = this._gateway.generateId()
        const user = new User({
            ...input,
            id,
            options: {...defaultUserOptions},
            createdAt: null,
            updatedAt: null,
            deletedAt: null
        } as UserProps)

        const data = {...user.toPrimitives() }
        await this._gateway.store(data)

        return data
    }
}