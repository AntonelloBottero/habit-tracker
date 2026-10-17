import { UserGateway } from "../contracts/gateways"
import { User, type UserProps } from "../domain/User"
import { selectiveMerge } from '../../shared/utils/obj'

export type UpdateUserInputDTO = Omit<UserProps, 'id' | 'options'>
export type UpdateUserOutputDTO = UserProps

export class UpdateUser {
    private _gateway: UserGateway

    constructor(gateway: UserGateway) {
        this._gateway = gateway
    }

    public async execute(id: string | number, input: UpdateUserInputDTO): Promise<UpdateUserOutputDTO> {
        const storedUser = await this._gateway.show(id)
        if(!storedUser) {
            throw new Error(`The user to be edited doesn't exists.`)
        }

        const merged = selectiveMerge(storedUser, {
            ...input,
            options: { ...storedUser.options } // options are not meant to be updated by this use case
        })
        const user = new User(merged)
        return await this._gateway.update(id, user.toPrimitives())
    }
}