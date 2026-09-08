export type ID = string | number // includes string and numbers to leave as many ID options open

// gateway for base CRUD operations -> base for any entity gateway
export interface BaseGateway<RawProps extends Record<string, any>, Props extends Record<string, any>> {
    show: (id: ID) => Promise<Props | null>
    index: () => Promise<Props[]>
    store: (values: RawProps) => Promise<Props & { createdAt: Date }>
    update: (id: ID, data: RawProps) => Promise<Props & { updatedAt: Date }>
    generateId: () => Promise<ID>
    delete: (id: ID) => Promise<void>
}