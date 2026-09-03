export type ID = string | null

export interface SearchGateway<T> {
    show: (id: string) => Promise<T | null>
    index: () => Promise<T[]>
}

export interface SaveGateway<T> {
    store: (data: T) => Promise<T & { createdAt: Date }>
    update: (data: T) => Promise<T & { updatedAt: Date }>
    generateId: () => Promise<ID>
}

export interface DeleteGateway {
    delete: (id: ID) => Promise<void>
}