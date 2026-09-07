export type ID = string | number // includes string and numbers to leave as many ID options open

// gateway for base CRUD operations -> base for any entity gateway
export interface BaseGateway<T extends Record<string, any>> {
    show: (id: ID) => Promise<T | null>
    index: () => Promise<T[]>
    findById: (id: ID) => Promise<T | null>
    store: (data: T) => Promise<T & { createdAt: Date }>
    update: (id: ID, data: T) => Promise<T & { updatedAt: Date }>
    generateId: () => Promise<ID>
    delete: (id: ID) => Promise<void>
}