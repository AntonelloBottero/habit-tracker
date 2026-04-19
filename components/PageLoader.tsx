import Loader from '@/components/Loader'

export default function PageLoader() {
  return (
    <div className="w-full h-full min-h-full flex flex-col justify-center items-center text-center gap-4">
      <Loader color="var(--color-green-300)" size="w-12 h-12" />
      <div className="text-base">
				Loading your experience...
      </div>
    </div>
  )
}