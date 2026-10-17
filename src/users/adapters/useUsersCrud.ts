import { useInfrastructure } from "@/src/shared/infrastructure/InfrastructureContext"
import { UserMapper, UserModelProps, UserRawProps } from "../mappers/UserMapper"
import useForm, { validators } from "@/hooks/useForm"
import { useEffect, useState } from "react"
import { UserProps } from "../domain/User"

interface Params {
    onSave?: (values: UserRawProps) => never | void
}

const defaultValues: UserModelProps = { // we leave out options since they are managed in different use cases
    name: ''
}
const rules = {
    name: [validators.required]
}

// init mapper - outside to prevent reinit at every rerender
const userMapper = new UserMapper()

export default function useUsersCrud({ onSave }: Params) {
    const { user, storeUser, updateUser } = useInfrastructure()

    // Internal state - useState to allow ui to be rerendered accordingly
    const [loadingSave, setLoadingSave] = useState<boolean>(false)

    // Form
    const form = useForm({ defaultValues, rules, onSubmit })

    // Utils
    const isNew = !user?.id

    useEffect(() => {
        form.init(user ? userMapper.toRaw(user) : { ...defaultValues })
    }, [user])

    async function onSubmit() {
        setLoadingSave(true)
        try {
            let values
            if(isNew) {
                values = await storeUser(form.model)
            } else {
                values = await updateUser(form.model)
            }
            if(onSave && values) {
                onSave(values)
            }
        } catch(error) {
            console.error(error)
        }
        setLoadingSave(false)
    }

    return {
        user,
        isNew,
        form,
        loadingSave
    }
}