/**
 * l'esigenza di rifattorizzazione nasce dal fatto che, per avere un db crud che gestisca delle risorse correttamente tipizzate, bisogna passare come parametro a useDbCrud il model della risorsa
 * - ogni risorsa ha il suo hook api
 * - qui sono messe a disposizione tutte le api possibili relative ad una determinata risorsa
 *   - oppure semplicemente è una facade di useDbCrud
 * - ma le risorse devono poter comunicare, quindi bisogna in qualche modo fare in modo i relativi hooks comunichino
 * - ogni crud api fa riferimento a useDbCrud per le varie operazioni
 */

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