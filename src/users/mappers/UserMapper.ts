import { Mapper, RawProps } from "@/src/shared/contracts/mappers"
import { UserProps } from "../domain/User"
import { BaseMapper } from "@/src/shared/mappers/BaseMapper"

export interface UserOptionsRawProps {
    colors?: string[]
}

export type UserRawProps = RawProps & {
    name: string,
    options: UserOptionsRawProps
}

export type UserModelProps = Omit<UserRawProps, 'id' | 'options'>

export class UserMapper extends BaseMapper implements Mapper<UserRawProps, UserProps> {
    public toDomain(raw: Partial<UserRawProps>): Partial<UserProps> {
        return {
            name: raw.name,
            options: {
                colors: raw.options?.colors ?? []
            },
            ...this._resourceProps(raw)
        }
    }

    public toRaw(domain: UserProps): UserRawProps {
        return {
            name: domain.name,
            options: {
                colors: domain.options?.colors ?? []
            },
            ...this._resourceRawProps(domain)
        }
    }
}