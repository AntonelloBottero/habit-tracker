export class Slot {
    private _habitId: string | number | null
    private _eventIds: (string | number)[]
    private _count: number
    private _completion: number
    private _activeTo: Date

    constructor(
        habitId: string | number | null = null,
        eventIds: (string | number)[] = [],
        count: number = 0,
        completion: number = 0,
        activeTo: Date = new Date()
    ) {
        this._habitId = habitId
        this._eventIds = eventIds
        this._count = count
        this._completion = completion
        this._activeTo = activeTo
    }

    // Getters
    get habitId(): string | number | null {
        return this._habitId
    }
    get eventIds(): (string | number)[] {
        return this._eventIds
    }
    get count(): number {
        return this._count
    }
    get completion(): number {
        return this._completion
    }
    get activeTo(): Date {
        return this._activeTo
    }
}