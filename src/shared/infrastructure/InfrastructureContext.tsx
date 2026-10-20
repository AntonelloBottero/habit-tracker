'use client'

/**
 * README: Infrastructure Context Provider acts as an orchestrator to provide every concrete infrastructure entity
 * Every Adapter, which must feed their Use Cases with infrastructure entities, consumes those entities through a dedicated hook (useInfrastructure)
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
import { UserMapper, UserModelProps, UserRawProps } from '@/src/users/mappers/UserMapper'
import { StoreUser, StoreUserInputDTO } from '@/src/users/use-cases/StoreUser'
import { UpdateUser, UpdateUserInputDTO } from '@/src/users/use-cases/UpdateUser'

interface Infrastructure { // TODO add user - methods to fetch and update global user
    habitGateway: DexieHabitGateway
    slotGateway: DexieSlotGateway
    eventGateway: DexieEventGateway,
    user: UserProps | null,
    options: UserOptionsProps
    storeUser: (values: UserModelProps) => Promise<UserRawProps | void>
    updateUser: (values: UserModelProps) => Promise<UserRawProps | void>
    updateOption: (key: keyof UserOptionsProps, value: UserOptionsProps[keyof UserOptionsProps]) => Promise<void>
}

const InfrastructureContext = createContext<Infrastructure | null>(null)

const dexieFactory = new DexieFactory()
const userGateway = new DexieUserGateway(dexieFactory.execute())
const userMapper = new UserMapper()

export const InfrastructureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProps | null>(null)

  async function showUser() {
    try {
      const user = await new ShowUser(userGateway).execute(1) // current user's id is always 1 if exists, since user info are stored locally
      setUser(user)
    } catch(error) {
      console.info(error)
      setUser(null)
    }
  }
  useEffect(() => { // TODO: maybe refactor
    showUser()
  }, [])

  async function storeUser(values: Omit<UserRawProps, 'id' | 'options'>): Promise<UserRawProps | void> {
    try {
      const user = await new StoreUser(userGateway).execute(userMapper.toDomain(values) as StoreUserInputDTO)
      setUser(user)
      return userMapper.toRaw(user)
    } catch(error) {
      console.error(error)
    }
  }

  async function updateUser(values: Omit<UserRawProps, 'id' | 'options'>): Promise<UserRawProps | void> {
    if(!user) { return undefined }

    try {
      const _user = await new UpdateUser(userGateway).execute(user.id, userMapper.toDomain(values) as UpdateUserInputDTO)
      setUser(_user)
      return userMapper.toRaw(_user)
    } catch(error) {
      console.error(error)
    }
  }


  async function updateOption(key: keyof UserOptionsProps, value: UserOptionsProps[keyof UserOptionsProps]): Promise<void> {
    if(!user) { return undefined }
    try {
      const _user = await new UpdateUserOption(userGateway).execute(user.id, { key, value })
      setUser({ ..._user })
    } catch(error) {
      console.error(error)
    }
  }

  const infrastructure: Infrastructure = {
    habitGateway: new DexieHabitGateway(dexieFactory.execute()),
    slotGateway: new DexieSlotGateway(dexieFactory.execute()),
    eventGateway: new DexieEventGateway(dexieFactory.execute()),
    // user
    user,
    options: user?.options ?? defaultUserOptions,
    storeUser,
    updateUser,
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