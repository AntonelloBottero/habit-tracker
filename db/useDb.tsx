'use client'

import { createContext, useContext, useState, useEffect, type ReactNode, useReducer, useRef } from 'react'
import { type Table } from 'dexie'
import DbClass, { type OptionsSchema } from '@/db/DbClass'

type Options = Record<string, unknown>

// --- Context Provider ---
interface DbContextProvider {
  db: DbClass
  dbIsOpen: boolean
  options: { current: Options }
  createOption: (key: string, value?: string | number | boolean) => Promise<boolean>
  getOption: (key: string, force?: boolean) => Promise<unknown>
}

type ProviderProps = Readonly<{
  children: ReactNode
  externalDb?: DbClass
}>

const DbContext = createContext<DbContextProvider | null>(null)


export function DbProvider({ children, externalDb }: ProviderProps) {
  // --- Db setup ---
  const db = externalDb || new DbClass(process.env.dbName as string) // we treat externalDb as non stateful -> if not provided after Provider setup won't be further considered

  // --- Open db ---
  const [dbIsOpen, setDbIsOpen] = useState<boolean>(false)
  async function open() {
    if(dbIsOpen !== false) { return undefined }
    setDbIsOpen(false)
    try {
    await db.open()
    await fetchOptions()
    setDbIsOpen(true)
    } catch(error) {
      console.log('error', error)
      setDbIsOpen(false)
    }
  }
  useEffect(() => {
    open()
  }, [])

  // --- Manage options ---
  const options = useRef<Options>({}) // Options requested already in the current session

  async function fetchOptions() {
    try {
      const optionResources = await db.options.toArray()
      options.current = optionResources.reduce((r, or) => ({ ...r, [or.key]: or.value }), {})
    } catch(error) {
      console.error(error)
      options.current = {}
    }
  }

  // ref to keep track of pending options - should save some api calls
  const pendingOptions = useRef<string[]>([])

  // get option
  async function showOption(key: string): Promise<OptionsSchema | undefined> {
    if(!key) { return undefined }
    try {
      const option: OptionsSchema | undefined = await db.options.where('key').equalsIgnoreCase(key).first()
      return option
    } catch(error) {
      return undefined
    }
  }

  // insert new option, or update it if the key exists already
  async function createOption(key: string, value?: unknown): Promise<boolean> {
    if(!key) { return false }
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

  // retrieves an option
  async function getOption(key: string, force: boolean = false): Promise<unknown> {
    if(pendingOptions.current.includes(key)) {
      console.log('pendingOptions are actually useful', key) // TODO remove
      return null
    }
    const availableOption: unknown = options.current[key]
    if(availableOption !== undefined && !force) { return availableOption }

    try {
      pendingOptions.current.push(key)
      // if option doesn't exist, we try to fetch it
      const fetchedOption = await showOption(key)
      if(!fetchedOption) { return null }
      // if option exists, we add its value to the available option values, and return its value
      options.current = {
        ...options.current,
        [key]: fetchedOption.value
      }
      pendingOptions.current = [...pendingOptions.current.filter(po => po !== key)]
      return fetchedOption.value
    } catch(error) {
      console.error(error)
      pendingOptions.current = [...pendingOptions.current.filter(po => po !== key)]
    }
  }

  return (
    <DbContext.Provider value={ { db, dbIsOpen, options, createOption, getOption } }>
      {dbIsOpen === true && children}
    </DbContext.Provider>
  )
}

// Hook for consumers
export default function useDb() {
  const context = useContext(DbContext)
  if (!context) {
    throw new Error('useDb must be used within a OptionsProvider')
  }
  return context
}