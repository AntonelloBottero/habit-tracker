import { useState, useRef, useEffect, useMemo } from 'react';
import { habitsModel, type HabitsSchema, type DbResourceSchema } from '@/db/DbClass'
import { ModalRef } from '@/app/types'
import useDb from '@/db/useDb'
import useDbCrud from '@/db/useDbCrud'
import Modal from '@/components/Modal'
import FormHabits from '@/components/FormHabits'
import HabitsCard from '@/components/HabitsCard'
import { CalendarCheck } from '@project-lary/react-material-symbols-700-rounded';
import useHabits from '@/hooks/useHabits';
import { DateTime } from 'luxon';

interface Props {
	onSetup?: () => never | void
}

export default function HabitsSetup({ onSetup }: Props) {
	const { index, isCompliant } = useDbCrud({ table: 'habits', model: habitsModel })

	// --- Existing Habits ---
	const [habits, setHabits] = useState<DbResourceSchema<HabitsSchema>[]>([])
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
			console.error(error)
			setHabits([])
		}
	}
	useEffect(() => {
		fetchHabits()
	}, [isCompliant()])

	// --- Manage form ad habits store/update ---
	const formModalRef = useRef<ModalRef>(null)
	const [formHabitsValues, setFormHabitsValues] = useState<Partial<DbResourceSchema<HabitsSchema>> | undefined>(undefined)
	function addHabit(type: 'good' | 'bad') {
		formModalRef.current?.show()
		setFormHabitsValues({
				type
		})
	}
	function editHabit(habit: DbResourceSchema<HabitsSchema>) {
		if(!habit) { return undefined }
		formModalRef.current?.show()
		setFormHabitsValues(habit)
	}

	function handleFormSave() {
		formModalRef.current?.hide()
		fetchHabits()
	}

	const formModalTitle = useMemo(() => {
		const operation = !formHabitsValues?.id ? 'Your new' : 'Edit your'
		return `${operation} ${formHabitsValues?.type ?? ''} habit`
	}, [formHabitsValues])

	// --- Setup ---
	const { createMonthlySlots } = useHabits()
	const { createOption } = useDb()
	const [loadingSetup, setLoadingSetup] = useState<boolean>(false)
	async function setup() {
		if(!habits.length) { return undefined }
		setLoadingSetup(true)
		try {
			await createMonthlySlots(DateTime.now().toISO())
			await createOption('setup_completed', true)
			if(onSetup) {
				onSetup()
			}
		} catch(error) {
			console.error(error)
		}
		setLoadingSetup(false)
	}

	return (
		<>
			<div className="flex gap-3 w-full p-6 bg-white outline-1 outline-offset-1 outline-green-100 rounded-lg shadow-ht dark:bg-gray-800 dark:border-gray-700">
				<div className="grow basis-1/2">
					<p>
						Flex you good intentions.<br/>
						<button
							type="button"
							className="px-3 py-1 mt-1 text-sm font-medium text-center bg-primary shadow-ht rounded-lg ht-interaction w-full ht-btn"
							onClick={() => addHabit('good')}
						>
							<span>
							Add some <b>Good habits</b>
							</span>
						</button>
					</p>
					{goodHabits.map(habit => (
						<HabitsCard key={habit.id} habit={habit} className="mt-4" onClick={() => { editHabit(habit) }} />
					))}
				</div>
				<div className="inline-block w-0.5 self-stretch bg-neutral-100 dark:bg-white/10"></div>
				<div className="grow basis-1/2">
					<p>
						We are not made of just sugar.<br />
						<button
							type="button"
							className="px-3 py-1 mt-1 text-sm font-medium text-center bg-primary shadow-ht rounded-lg ht-interaction w-full ht-btn"
							onClick={() => addHabit('bad')}
						>
							<span>
								Unveil your <b>Bad habits</b>
							</span>
						</button>
					</p>
					{badHabits.map(habit => (
						<HabitsCard key={habit.id} habit={habit} className="mt-4" onClick={() => { editHabit(habit) }} />
					))}
				</div>
			</div>
			<div className="mt-4 flex justify-end items-center">
				{!habits.length && (
					<div className="text-sm text-gray-500 mr-4">
						Add at least an habit to continue
					</div>
				)}
				<button type="button" className="ht-btn ht-btn--size-large ht-interaction bg-primary shadow-ht" disabled={!habits.length} onClick={() => { setup() }}>
					<CalendarCheck />
					Start monitoring
				</button>
			</div>

			<Modal ref={formModalRef} title={formModalTitle}>
				<FormHabits values={formHabitsValues} onSave={handleFormSave} onDelete={handleFormSave} />
			</Modal>
		</>
	)
}