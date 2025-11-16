import { useState, useRef, useEffect, useMemo } from 'react';
import Modal from '@/components/Modal'
import FormHabits, { defaultValues as habitsModel } from '@/components/FormHabits'
import { ModalRef } from '@/app/types'
import useDbCrud from '@/hooks/useDbCrud'

type Habit = Partial<typeof habitsModel> & {
    id?: string
}

// Card made of 2 sections -> Good and Bad habits
// every section accepts any number of items
// adding or editing an element opens a dedicated form modal
// Form modal has default and advanced settings:
// - Name
// - When (every day, selected days, except weekends, n days per week/month, etc)
// - Icon
export default function HabitsSetup() {
    const { index } = useDbCrud({ table: 'habits', model: habitsModel })

    // --- Existing Habits ---
    const [habits, setHabits] = useState<Habit[]>([])
    const goodHabits = useMemo(() => {
        return habits.filter(habit => habit.type === 'good')
    }, [habits])
    const badHabits = useMemo(() => {
        return habits.filter(habit => habit.type === 'bad')
    }, [habits])

    const fetchHabits = async () => {
        try {
        const habits = await index()
        setHabits(habits)
        } catch(error) {
            setHabits([])
        }
    }
    useEffect(() => {
        fetchHabits()
    }, [])

    // --- Manage form ad habits store/update
    const formModalRef = useRef<ModalRef>(null)
    const [formHabitsValues, setFormHabitsValues] = useState<Habit | undefined>(undefined)
    const addHabit = (type: 'good' | 'bad') => {
        formModalRef.current?.show()
        setFormHabitsValues({
            type
        })
    }

    const handleFormSave = () => {
        formModalRef.current?.hide()
        fetchHabits()
    }

    return (
        <>
            <div className="flex gap-3 w-lg p-6 bg-white border border-gray-200 rounded-lg shadow-ht dark:bg-gray-800 dark:border-gray-700">
                <div className="grow">
                    <p>
                        Flex you good intentions.<br/>
                        <button
                            type="button"
                            className="px-3 py-1 mr-1 text-xs font-medium text-center bg-primary outline-glass rounded-lg"
                            onClick={() => addHabit('good')}
                        >Add</button>
                        some <b>Good habits</b>.
                    </p>
                    {goodHabits.map(habit => (
                        <p>
                            {habit.name}
                        </p>
                    ))}
                </div>
                <div className="inline-block self-stretch bg-neutral-100 dark:bg-white/10"></div>
                <div className="grow">
                    <p>
                        We are not made of just sugar.<br />
                        <button
                            type="button"
                            className="px-3 py-1 mr-1 text-xs font-medium text-center bg-primary outline-glass rounded-lg"
                            onClick={() => addHabit('bad')}
                        >
                            Unveil
                        </button>
                        your <b>Bad habits</b>.
                    </p>
                </div>
            </div>

            <Modal ref={formModalRef}  title="Your New Good Habit">
                <FormHabits values={formHabitsValues} onSave={handleFormSave} />
            </Modal>
        </>
    )
}