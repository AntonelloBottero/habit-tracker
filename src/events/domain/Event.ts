export class Event {
    private _habitId: string | number | null
    private _date: Date
    private _completed: number

    constructor(
        habitId: string | number | null = null,
        date: Date,
        completed: number
    ) {
        this._habitId = habitId
        this._date = date
        this._completed = completed
    }

    // Getters
    get habitId(): string | number | null {
        return this._habitId
    }
    get date(): Date {
        return this._date
    }
    get completed(): number {
        return this._completed
    }
}