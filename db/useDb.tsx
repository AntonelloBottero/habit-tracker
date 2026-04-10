'use client'

import { createContext, useContext, useState, useEffect, type ReactNode, useReducer } from 'react'
import { type Table } from 'dexie'
import DbClass, { type OptionsSchema } from '@/db/DbClass'

type Options = Record<string, unknown>

// --- Context Provider ---
interface DbContextProvider {
  db: DbClass
  dbIsOpen: boolean | 'pending'
  options: Options
  createOption: (key: string, value?: string | number | boolean) => Promise<boolean>
  getOption: (key: string) => Promise<unknown>
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
  const [dbIsOpen, setDbIsOpen] = useState<boolean | 'pending'>(false)
  async function open() {
    if(dbIsOpen !== false) { return undefined }
    setDbIsOpen('pending')
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
  const [options, setOptions] = useState<Options>({}) // Options requested already in the current session

  async function fetchOptions() {
    try {
      const optionResources = await db.options.toArray()
      setOptions(optionResources.reduce((r, or) => ({ ...r, [or.key]: or.value }), {}))
    } catch(error) {
      console.error(error)
      setOptions({})
    }
  }

  // reducer to keep track of pending options - should save some api calls
  function pendingOptionsReducer(currentPendingOptions: string[], { type, key }: { type: 'add' | 'remove', key: string}) {
    switch(type) {
      case 'add':
        return [...currentPendingOptions, key]
      case 'remove':
        return currentPendingOptions.filter(k => k !== key)
      default:
        throw new TypeError('Pending options reducer action not allowed')
    }
  }
  const [pendingOptions, dispatchPendingOptions] = useReducer(pendingOptionsReducer, [])

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
  async function createOption(key: string, value?: string | number): Promise<boolean> {
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
    if(pendingOptions.includes(key)) { 
      console.log('pendingOptions are actually useful', key) // TODO remove
      return null
    }
    const availableOption: unknown = options[key]
    if(availableOption !== undefined && !force) { return availableOption }

    try {
      dispatchPendingOptions({ type: 'add', key })
      // if option doesn't exist, we try to fetch it
      const fetchedOption = await showOption(key)
      if(!fetchedOption) { return null }
      // if option exists, we add its value to the available option values, and return its value
      setOptions(currentOptions => ({
        ...currentOptions,
        [key]: fetchedOption.value
      }))
      dispatchPendingOptions({ type: 'remove', key })
      return fetchedOption.value
    } catch(error) {
      console.error(error)
      dispatchPendingOptions({ type: 'remove', key })
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