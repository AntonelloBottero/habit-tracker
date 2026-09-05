export function isSimpleObj(value: any): boolean {
    return !!value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)
}

export function selectiveMerge<T extends Record<string, any>>(origin: T, toMerge: Record<string, any>): T {
    if(!isSimpleObj(origin) || !isSimpleObj(toMerge)) { return origin}
    return {
          ...Object.entries(origin).reduce((r, [k, v]) => ({
            ...r,
            [k]: typeof toMerge[k] !== undefined
                ? !isSimpleObj(v) ? toMerge[k] : selectiveMerge(v, toMerge[k])
                : v
          }), {} as T)
        }
}