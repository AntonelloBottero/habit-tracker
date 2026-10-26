export type DomainProps = Record<string, any> & {
    id: string | number
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
}

export abstract class Domain {
    protected abstract _props: DomainProps

    protected _validateResourceProps(props: DomainProps): void {
        if(!props.id) {
            throw new Error('Resource ID is required')
        }
        if(props.createdAt && isNaN(props.createdAt.getTime())) {
            throw new Error('Created at must be a real date')
        }
        if(props.updatedAt && isNaN(props.updatedAt.getTime())) {
            throw new Error('Updated at must be a real date')
        }
        if(props.deletedAt && isNaN(props.deletedAt.getTime())) {
            throw new Error('Deleted at must be a real date')
        }
    }
}