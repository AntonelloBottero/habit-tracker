/**
 * Options:
 * - Should be global
 *  - global fetch and store/update
 *  - needs use cases for fetch (executed by the Options Provider the first time is inited or ever time we change the route), store and update
 * - Kept in a single object field
 *  - an option should never be required
 *  - when a new option comes up, it's easier to update the object adding the option
 *  - no need to search between options -> parts of the systems are designed to consume a certain kind of options
 *  - makes it easier to expose a global object
 *  - shall we update the domain every time a minute detail like a new option gets added? No
 *  - we shall build an interface that define the options object though
 *
 */

import { Domain, DomainProps } from "@/src/shared/domain/Domain"

export interface UserOptionsProps {
    colors: string[]
}

export const defaultUserOptions: UserOptionsProps = {
    colors: []
}

export type UserProps = DomainProps & {
    name: string
    options: UserOptionsProps
}

export class User extends Domain {
    protected _props: UserProps

    constructor(props: UserProps) {
        super()

        this._validateResourceProps(props)
        
        if(!props.id) {
            throw new Error('User ID is required')
        }
        if(!props.name) {
            throw new Error('User name is required')
        }
        if(!this._checkOptions(props.options)) {
            throw new Error('User options are not compliant')
        }

        this._props = props
    }

    private _checkOptions(options: UserOptionsProps): boolean {
        const allowedKeys = Object.keys(defaultUserOptions)
        return Object.keys(options).every(key => allowedKeys.includes(key))
    }

    // Getters
    public toPrimitives(): Readonly<UserProps> {
        return Object.freeze({...this._props})
    }

    get id(): string | number {
        return this._props.id
    }
    get options(): UserOptionsProps {
        return this._props.options
    }
}