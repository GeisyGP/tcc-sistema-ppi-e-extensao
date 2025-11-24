export function removeTimezoneOffset({ value }: { value: string | Date }) {
    const date = new Date(value)
    return date
}
