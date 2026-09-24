export const granularities = ['daily', 'weekly', 'monthly', 'yearly'] as const
export type Granularity = typeof granularities[number]