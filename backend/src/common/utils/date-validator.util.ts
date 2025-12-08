import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator"

export function IsAfterStartDate(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: "isAfterStartDate",
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const validatedObject = args.object as { startDate?: Date }
                    if (!(value instanceof Date) || !(validatedObject.startDate instanceof Date)) {
                        return false
                    }
                    return value > validatedObject.startDate
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be after startDate`
                },
            },
        })
    }
}

export function IsFutureDate(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: "isFutureDate",
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const validatedObject = args.object as { startDate?: Date }
                    if (!(value instanceof Date) || !(validatedObject.startDate instanceof Date)) {
                        return false
                    }

                    const checkDate = new Date(validatedObject.startDate.getTime())

                    return new Date().setHours(0, 0, 0, 0) <= checkDate.setHours(0, 0, 0, 0)
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be today or a future date`
                },
            },
        })
    }
}
