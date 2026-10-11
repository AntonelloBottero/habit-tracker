/**
 * README: Infrastructure Context Provider acts as an orchestrator to provide every concrete infrastructure entity
 * Every Adapter, which must feed their Use Cases with infrastructure entities, consumes those entities through a dedicated hook (useInfrastructure)
 */

/**
 * User
 * - must be available globally (managed by provider) to be consumed
 *  - the provider makes the first UserFetch
 * - it can be created -> user added to provider
 * - it can be updated (name and options)
 * - manage options separatedly
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { DexieHabitGateway } from '../../habits/infrastructure/DexieHabitGateway'
import { DexieFactory } from './DbClass'
import { DexieSlotGateway } from '@/src/slots/infrastructure/DexieSlotGateway'
import { DexieEventGateway } from '@/src/events/infrastructure/DexieEventGateway'
import { defaultUserOptions, UserOptionsProps, type UserProps } from '@/src/users/domain/User'
import { ShowUser } from '@/src/users/use-cases/ShowUser'
import { DexieUserGateway } from '@/src/users/infrastructure/DexieUserGateway'
import { UpdateUserOption } from '@/src/users/use-cases/UpdateUserOption'

interface Infrastructure { // TODO add user - methods to fetch and update global user
    habitGateway: DexieHabitGateway
    slotGateway: DexieSlotGateway
    eventGateway: DexieEventGateway,
    user: UserProps | null,
    options: UserOptionsProps
    updateOption: (key: keyof UserOptionsProps, value: UserOptionsProps[keyof UserOptionsProps]) => Promise<void>
}

const InfrastructureContext = createContext<Infrastructure | null>(null)

const dexieFactory = new DexieFactory()
const userGateway = new DexieUserGateway(dexieFactory.execute())

export const DependenciesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [_user, setUser] = useState<UserProps | null>(null)

  async function showUser() {
    try {
      const user = await new ShowUser(userGateway).execute(1) // current user's id is always 1 if exists, since user info are stored locally
      setUser(user)
    } catch(error) {
      console.error(error)
      setUser(null)
    }
  }
  useEffect(() => { // TODO: maybe refactor
    showUser()
  }, [])


  async function updateOption(key: keyof UserOptionsProps, value: UserOptionsProps[keyof UserOptionsProps]): Promise<void> {
    if(!_user) { return undefined }
    try {
      const user = await new UpdateUserOption(userGateway).execute(_user.id, { key, value })
      setUser({ ...user })
    } catch(error) {
      console.error(error)
    }
  }

  const infrastructure: Infrastructure = {
    habitGateway: new DexieHabitGateway(dexieFactory.execute()),
    slotGateway: new DexieSlotGateway(dexieFactory.execute()),
    eventGateway: new DexieEventGateway(dexieFactory.execute()),
    // user
    user: _user || null,
    options: _user?.options ?? defaultUserOptions,
    updateOption
  }

  return (
    <InfrastructureContext.Provider value={infrastructure}>
      {children}
    </InfrastructureContext.Provider>
  )
}

export const useInfrastructure = () => {
  const context = useContext(InfrastructureContext)
  if (!context) {
    throw new Error("useInfrastructure cannot be used outside a Infrastructure Provider")
  }
  return context
};