import 'fake-indexeddb/auto'
import structuredClone from '@ungap/structured-clone'

// structureClone is required for Dexie to work properly, and the test environment hasn't standardized it in the current version
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = structuredClone
}