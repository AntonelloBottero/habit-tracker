import { Mapper } from "@/src/shared/contracts/mappers"
import { UserProps } from "../domain/User"

export interface UserOptionsRawProps {
    colors?: string[]
}

export interface UserRawProps {
    id: string | number,
    name: string,
    options: UserOptionsRawProps
}

export class UserMapper implements Mapper<UserRawProps, UserProps> {
    public toDomain(raw: Partial<UserRawProps>): Partial<UserProps> {
        return {
            id: raw.id,
            name: raw.name,
            options: {
                colors: raw.options?.colors ?? []
            }
        }
    }

    public toRaw(domain: UserProps): UserRawProps {
        return {
            id: domain.id,
            name: domain.name,
            options: {
                colors: domain.options?.colors ?? []
            }
        }
    }
}