/**
 * README: Infrastructure Context Provider acts as an orchestrator to provide every concrete infrastructure entity
 * Every Adapter, which must feed their Use Cases with infrastructure entities, consumes those entities through a dedicated hook (useInfrastructure)
 */

import React, { createContext, useContext } from 'react'
import { DexieHabitGateway } from '../../habits/infrastructure/DexieHabitGateway'

interface Infrastructure {
    habitGateway: DexieHabitGateway
}

const InfrastructureContext = createContext<Infrastructure | null>(null)

export const DependenciesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Le istanze concrete vivono QUI, ai confini dell'applicazione (Composition Root)
  const infrastructure: Infrastructure = {
    habitGateway: new DexieHabitGateway()
  };

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