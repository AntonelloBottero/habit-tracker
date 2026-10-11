import { UserGateway } from "../contracts/gateways"
import { UserProps } from "../domain/User"

export type ShowUserOutputDTO = UserProps

export class ShowUser {
    private _gateway: UserGateway

    constructor(gateway: UserGateway) {
        this._gateway = gateway
    }

    public async execute(id: string | number): Promise<ShowUserOutputDTO> {
        // input validations
        const storedUser = await this._gateway.show(id)
        if(!storedUser) {
            throw new Error(`The user to be shown doesn't exists.`)
        }

        return storedUser
    }
}