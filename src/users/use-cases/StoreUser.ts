import { UserGateway } from "../contracts/gateways"
import { User, type UserProps } from "../domain/User"

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
            options: {} // options always empty at user store - no need for initial options
        })

        const data = {...user.toPrimitives() }
        await this._gateway.store(data)

        return data
    }
}