import { useRef } from 'react';
import Modal from '@/components/Modal'
import { ModalRef } from '@/app/types'

// Card made of 2 sections -> Good and Bad habits
// every section accepts any number of items
// adding or editing an element opens a dedicated form modal
// Form modal has default and advanced settings:
// - Name
// - When (every day, selected days, except weekends, n days per week/month, etc)
// - Icon
export default function HabitsSetup() {
    const formModalRef = useRef<ModalRef>(null)
    const addHabit = () => {
        formModalRef.current?.show()
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
                            onClick={() => addHabit()}
                        >Add</button>
                        some <b>Good habits</b>.
                    </p>
                </div>
                <div className="inline-block self-stretch bg-neutral-100 dark:bg-white/10"></div>
                <div className="grow">
                    <p>
                        We are not made of just sugar.<br />
                        <button type="button" className="px-3 py-1 mr-1 text-xs font-medium text-center bg-primary outline-glass rounded-lg">Unveil</button>
                        your <b>Bad habits</b>.
                    </p>
                </div>
            </div>

            <Modal ref={formModalRef} />
        </>
    )
}