import { IndexHabitsOutputDTO } from "@/src/habits/use-cases/IndexHabits"
import { UserGateway } from "../contracts/gateways"
import { User, UserOptionsProps, UserProps } from "../domain/User"

export type UpdateUserOptionInputDTO = {
    key: keyof UserOptionsProps,
    value: UserOptionsProps[keyof UserOptionsProps]
}
export type UpdateUserOptionOutputTDO = UserProps

export class UpdateUserOption {
    private _gateway: UserGateway

    constructor(gateway: UserGateway) {
        this._gateway = gateway
    }

    public async execute(id: string | number, { key, value }: UpdateUserOptionInputDTO): Promise<UpdateUserOptionOutputTDO> {
        // input validations
        const storedUser = await this._gateway.show(id)
        if(!storedUser) {
            throw new Error(`The user to be edited doesn't exists.`)
        }

        const data = {
            ...storedUser,
            options: {
                ...storedUser.options,
                [key]: value
            }
        }
        const user = new User(data)
        return await this._gateway.update(id, user.toPrimitives())
    }
}