'use client'

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react'
import { type Table } from 'dexie'
import DbClass, { type OptionsSchema } from '@/db/DbClass'

interface AvailableOptionValues {
  [key: string]: unknown
}

// --- Context Provider ---
interface DbContextProvider {
  db: DbClass
  dbIsOpen: boolean | 'pending'
  createOption: (key: string, value?: string | number) => Promise<boolean>
  getOption: (key: string) => Promise<unknown>
}

type ProviderProps = Readonly<{
  children: ReactNode
  externalDb?: DbClass
}>

const DbContext = createContext<DbContextProvider | null>(null)


export function DbProvider({ children, externalDb }: ProviderProps) {
  // --- Db setup ---
  const db = externalDb || new DbClass(process.env.dbName as string, Number(process.env.dbVersion) as number) // we treat externalDb as non stateful -> if not provided after Provider setup won't be further considered

  // --- Open db ---
  const [dbIsOpen, setDbIsOpen] = useState<boolean | 'pending'>(false)
  async function open() {
    if(db.isOpen()) { return undefined }
    setDbIsOpen('pending')
    try {
    await db.open()
    setDbIsOpen(true)
    } catch(error) {
      setDbIsOpen(false)
    }
  }
  useEffect(() => {
    open()
  }, [])

  // --- Manage options ---
  const [availableOptionValues, setAvailableOptionValues] = useState<AvailableOptionValues>({}) // Options requested already in the current session

  // get option
  const showOption = async (key: string): Promise<OptionsSchema | undefined> => {
    if(!key) { return undefined }
    try {
      const option: OptionsSchema | undefined = await db.options.where('key').equalsIgnoreCase(key).first()
      return option
    } catch(error) {
      return undefined
    }
  }

  // insert new option, or update it if the key exists already
  const createOption = async (key: string, value?: string | number): Promise<boolean> => {
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
  const getOption = async (key: string): Promise<unknown> => {
    const availableOption: unknown = availableOptionValues[key]
    if(availableOption) { return availableOption }

    // if option doesn't exist, we try to fetch it
    const fetchedOption = await showOption(key)
    if(!fetchedOption) { return undefined }
    // if option exists, we add its value to the available option values, and return its value
    setAvailableOptionValues({
      ...availableOptionValues,
      [key]: fetchedOption.value
    })
    return fetchedOption.value
  }

  return (
    <DbContext.Provider value={ { db, dbIsOpen, createOption, getOption } }>
      {dbIsOpen && children}
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