import { Mapper, RawProps } from "../contracts/mappers"
import { DomainProps } from "../domain/Domain"

export abstract class BaseMapper implements Mapper<RawProps, DomainProps> {
    public abstract toDomain(raw: Partial<RawProps>): Partial<DomainProps>
    public abstract toRaw(domain: DomainProps): RawProps

    protected _resourceProps(raw: Partial<RawProps>): Partial<DomainProps> {
        return {
            id: raw.id,
            createdAt: raw.created_at ? new Date(raw.created_at) : raw.created_at as null | undefined,
            updatedAt: raw.updated_at ? new Date(raw.updated_at) : raw.updated_at as null | undefined,
            deletedAt: raw.deleted_at ? new Date(raw.deleted_at) : raw.deleted_at as null | undefined,
        }
    }

    protected _resourceRawProps(domain: DomainProps): RawProps {
        return {
            id: domain.id,
            created_at: domain.createdAt instanceof Date ? domain.createdAt.toISOString() : null,
            updated_at: domain.updatedAt instanceof Date ? domain.updatedAt.toISOString() : null,
            deleted_at: domain.deletedAt instanceof Date ? domain.deletedAt.toISOString() : null,
        }
    }
}