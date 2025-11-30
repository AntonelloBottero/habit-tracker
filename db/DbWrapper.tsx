/**
 * DBWrapper
 * @component
 * @props {HTMLInputElement}
 * @returns {TSX.Element}
 */
import { useState, useEffect, type ReactNode } from 'react'
import type { Dexie } from 'dexie'
import DBClass from '@/db/DBClass'

type Props = Readonly<{
  children: ReactNode
  externalDBClass?: Dexie // for testing purposes (fake-indexeddb)
}>

export default function DBWrapper({ children, externalDBClass }: Props) {
  // --- db init ---
  const db = externalDBClass || new DBClass // externalDBClass won't be treated as stateful - if not available from beginning, won't be further considered

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
}