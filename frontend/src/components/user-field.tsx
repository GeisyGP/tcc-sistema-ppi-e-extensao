type UserFieldProps = {
    label: string
    value: string
    onChange?: (newValue: string) => void
    readOnly?: boolean
}

export function UserField({ label, value, onChange, readOnly }: UserFieldProps) {
    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                className={`border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                    readOnly
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
                        : 'border-gray-300 focus:ring-blue-500'
                }`}
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                readOnly={readOnly}
            />
        </div>
    )
}