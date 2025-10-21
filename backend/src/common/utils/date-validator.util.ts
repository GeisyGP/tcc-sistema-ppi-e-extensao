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
