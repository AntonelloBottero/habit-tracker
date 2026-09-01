export interface SearchGateway<T, ID> {
    show: (id: ID) => Promise<T | null>
    index: () => Promise<T[]>
}

export interface SaveGateway<T> {
    store: (data: T) => Promise<T>
    update: (data: T) => Promise<T>
}

export interface DeleteGateway<ID> {
    delete: (id: ID) => Promise<void>
}