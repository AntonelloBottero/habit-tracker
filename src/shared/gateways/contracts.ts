export type ID = string | number

export interface SearchGateway<T> {
    show: (id: ID) => Promise<T | null>
    index: () => Promise<T[]>
    findById: (id: ID) => Promise<T | null>
}

export interface SaveGateway<T> {
    store: (data: T) => Promise<T & { createdAt: Date }>
    update: (id: ID, data: T) => Promise<T & { updatedAt: Date }>
    generateId: () => Promise<ID>
}

export interface DeleteGateway {
    delete: (id: ID) => Promise<void>
}