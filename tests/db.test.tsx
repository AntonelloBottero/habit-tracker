import { render } from '@testing-library/react'
import DbClass from '@/db/DbClass'
import { DbProvider } from '@/db/useDb'

const testDb = new DbClass('TestDatabase')