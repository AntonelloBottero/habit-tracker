import { type RawProps, type DomainProps } from "./mappers";

export type ID = string | number // includes string and numbers to leave as many ID options open

// gateway for base CRUD operations -> base for any entity gateway
export interface BaseGateway<RP extends RawProps, DP extends DomainProps> {
    show: (id: ID) => Promise<DP | null>
    index: () => Promise<DP[]>
    generateId: () => ID
    getUserId: () => Promise<ID>
    store: (values: DP) => Promise<DP>
    bulkStore: (values: DP[]) => Promise<void>
    update: (id: ID, data: DP) => Promise<DP>
    delete: (id: ID) => Promise<void>
}