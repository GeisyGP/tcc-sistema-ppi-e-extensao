export function removeTimezoneOffset({ value }: { value: string | Date }) {
    const date = new Date(value)
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    return date
}
