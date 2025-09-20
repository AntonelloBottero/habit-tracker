import Dexie, { Table } from 'dexie';

export interface Option {
    id?: number,
    key: string,
    value?: string | number
}

export class DB extends Dexie {
    options!: Table<Option> // comunico a Typescript che options non sarà mai null anche se non la valorizzo nel constructor, quindi non dovrà produrre errori di questo tipo
    constructor() {
        super('HabiterDatabase')
        this.version(1).stores({
            options: '++id, key'
        });
    }
}
export const db = new DB()

// get option
export const showOption = async (key: string): Promise<Option | undefined> => {
    if(!key) { return undefined }
    const option: Option | undefined = await db.options.where('key').equalsIgnoreCase(key).first()
    return option
}

// insert new option, or update it if the key exists already
export const createOption = async (key: string, value?: string | number): Promise<true | string> => {
    if(!key) { return 'No key specified for your option' }
    const formattedKey = key.toLocaleLowerCase()
    const option = await showOption(key)
    if(!option) {
        await db.options.add({ key: formattedKey, value })
    } else {
        db.options.put({
            ...option,
            value
        })
    }
    return true
}
