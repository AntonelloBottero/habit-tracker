import { BaseGateway } from "../../shared/contracts/gateways"
import { UserProps } from "../domain/User"
import { UserRawProps } from "../mappers/UserMapper"

export type UserGateway = BaseGateway<UserRawProps, UserProps>