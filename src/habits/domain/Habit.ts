export type Type = 'good' | 'bad'
export type Granularity = 'daily' | 'weekly' | 'monthly' | 'yearly'

export class Habit {
    private _type: Type
    private _name: string
    private _color: string
    private _granularity: Granularity
    private _includeWeekends: boolean
    private _granularityTimes: number
    private _enoughAmount: string
    private _manageFrom: Date

    constructor(
        type: Type,
        name: string,
        color: string,
        granularity: Granularity,
        includeWeekends: boolean,
        granularityTimes: number,
        enoughAmount: string,
        manageFrom: Date
    ) {
        this._type = type
        this._name = name
        this._color = color
        this._granularity = granularity
        this._includeWeekends = includeWeekends
        this._granularityTimes = granularityTimes
        this._enoughAmount = enoughAmount
        this._manageFrom = manageFrom
    }

    // Getters
    get type(): Type {
        return this._type
    }
    get name(): string {
        return this._name
    }
    get color(): string {
        return this._color
    }
    get granularity(): Granularity {
        return this._granularity
    }
    get includeWeekends(): boolean {
        return this._includeWeekends
    }
    get granularityTimes(): number {
        return this._granularityTimes
    }
    get enoughAmount(): string {
        return this._enoughAmount
    }
    get manageFrom(): Date {
        return this._manageFrom
    }
}