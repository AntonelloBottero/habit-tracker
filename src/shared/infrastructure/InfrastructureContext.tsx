/**
 * README: Infrastructure Context Provider acts as an orchestrator to provide every concrete infrastructure entity
 * Every Adapter, which must feed their Use Cases with infrastructure entities, consumes those entities through a dedicated hook (useInfrastructure)
 */

import React, { createContext, useContext } from 'react'
import { DexieHabitGateway } from '../../habits/infrastructure/DexieHabitGateway'
import { DexieFactory } from './DbClass'
import { DexieSlotGateway } from '@/src/slots/infrastructure/DexieSlotGateway'
import { DexieEventGateway } from '@/src/events/infrastructure/DexieEventGateway'

interface Infrastructure {
    habitGateway: DexieHabitGateway
    slotGateway: DexieSlotGateway
    eventGateway: DexieEventGateway
}

const InfrastructureContext = createContext<Infrastructure | null>(null)

const dexieFactory = new DexieFactory()

export const DependenciesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const infrastructure: Infrastructure = {
    habitGateway: new DexieHabitGateway(dexieFactory.execute()),
    slotGateway: new DexieSlotGateway(dexieFactory.execute()),
    eventGateway: new DexieEventGateway(dexieFactory.execute())
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