import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { ValidationError } from "class-validator"
import { InvalidInputException } from "./common/exceptions/invalid-input.exception"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            exceptionFactory: (errors: ValidationError[]) => {
                const messages = errors
                    .map((error) =>
                        Object.values(
                            error.constraints || "Unknown validation error",
                        ),
                    )
                    .flat()
                return new InvalidInputException(messages)
            },
        }),
    )
    await app.listen(process.env.PORT ?? 3000)
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
