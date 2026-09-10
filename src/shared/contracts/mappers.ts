export type DomainProps = Record<string, any>
export type RawProps = Record<string, any>

export interface Mapper {
    toDomain(raw: Partial<RawProps>): Partial<DomainProps>
    toRaw(domain: RawProps): DomainProps
}