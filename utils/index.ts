export const objectMatches = (obj1: object, obj2: object): boolean => {
  if(typeof obj1 !== 'object' || typeof obj2 !== 'object') { return false }
  return Object.keys(obj1).every(key => {
    const v = (obj1 as never)[key]
    if (typeof v === 'object' && v !== null) {
      return objectMatches(v, (obj2 as never)[key])
    }
    return obj2.hasOwnProperty(key)
  })
}

// Checks if obj2 has not keys that are missing in obj1
export const objectIsCompliant = (obj1: object, obj2: object): boolean => {
  if(typeof obj1 !== 'object' || typeof obj2 !== 'object') { return false }
  return !Object.keys(obj2).some(key => {
    const v = (obj2 as never)[key]
    if (typeof v === 'object' && v !== null) {
      return objectIsCompliant(v, (obj1 as never)[key])
    }
    return !obj1.hasOwnProperty(key)
  })
}