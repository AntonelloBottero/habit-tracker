export function isSimpleObj(value: any): boolean {
    return !!value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)
}

export function selectiveMerge<T extends any>(origin: T, toMerge: any): T {
    if(!isSimpleObj(origin) || !isSimpleObj(toMerge)) { return typeof toMerge !== 'undefined' ? toMerge : origin }
    return {
          ...Object.entries(origin as Record<string, any>).reduce((r, [k, v]) => ({
            ...r,
            [k]: typeof toMerge[k] !== 'undefined'
                ? !isSimpleObj(v) ? toMerge[k] : selectiveMerge(v, toMerge[k])
                : v
          }), {} as Record<string, any>)
        } as T
}