import { DbResourceSchema } from "@/db/DbClass"

type Query = Record<string, never>

export interface ApiGroup<T> {
    get?: Record<string, (uri: string, query?: Query) => T | T[] | null>
    post?: Record<string, (uri: string, data?: Partial<T>, query?: Query) => T | void>
    put?: Record<string, (uri: string, data?: Partial<DbResourceSchema<T>>, query?: Query) => T | void>
    delete?: Record<string, (uri: string) => void>
}

export default function useApi() {

}