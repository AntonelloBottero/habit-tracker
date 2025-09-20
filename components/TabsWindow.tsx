import { Children } from 'react'

export default function TabsWindow({children, value = 0 }) {
    return (
        <div className="w-full">
            <div className="relative overflow-hidden">
                {Children.map(children, (child, index) => (
                    <div
                        key={index}
                        className={`w-full px-4 py-8 transition-transform duration-500 ease-in-out
                        ${value === index
                            ? 'translate-x-0 opacity-100' // Tab attiva
                            : 'translate-x-full opacity-0' // Tab non attiva, nascosta a destra
                        }
                        ${value !== index && 'absolute'}
                        `}
                    >
                        {child}
                    </div>
                ))}
            </div>
        </div>
    )
}