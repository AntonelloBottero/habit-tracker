'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import Dexie, { Table } from 'dexie'

/**
 * DB management
 */
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
    })
  }
}
export const db = new DB()

// get option
export const showOption = async (key: string): Promise<Option | undefined> => {
  if(!key) { return undefined }
  try {
    const option: Option | undefined = await db.options.where('key').equalsIgnoreCase(key).first()
    return option
  } catch(error) {
    return undefined
  }
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

/**
 * Options context
 */
interface OptionsContextProviver {
  getOption: (key: string) => Promise<unknown>
}

interface AvailableOptionValues {
    [key: string]: unknown
}

const OptionsContext = createContext<OptionsContextProviver | null>(null)

export function OptionsProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [availableOptionValues, setAvailableOptionValues] = useState<AvailableOptionValues>({}) // Options requested already in the current session

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
    <OptionsContext.Provider value={ { getOption } }>
      {children}
    </OptionsContext.Provider>
  )
}

// Custom hook for consumers
export function useOptions() {
  const context = useContext(OptionsContext)
  if (!context) {
    throw new Error('useOptions must be used within a OptionsProvider')
  }
  return context
}