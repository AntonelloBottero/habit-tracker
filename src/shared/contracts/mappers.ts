export type DomainProps = Record<string, any>
export type RawProps = Record<string, any>

/**
 * README: a Mapper is a class that holds knowledge of both Domain Entities and Presenters/Gateways data
 * - it uses that knowledge to convert data in both ways
 * - we may consider it as a middleware that enables communication between Adapters and Use Cases
 * - it is intended to be used exclusively by Adapters, since business logic can't be bothered by this kind of data conversion
 * - the downside to this is that communication between Use Cases and Adapters happens using Domain Entities, which it appears not to be a proper Clean Architecture communication
 */
export interface Mapper<TRaw extends RawProps, TDomain extends DomainProps> {
    toDomain(raw: Partial<TRaw>): Partial<TDomain> // Partial -> which properties to show to Adapters depends on the use case's scope
    toRaw(domain: Partial<TDomain>): TRaw
}