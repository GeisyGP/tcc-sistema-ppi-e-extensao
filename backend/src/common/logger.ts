import { LoggerService, Injectable } from "@nestjs/common"

@Injectable()
export class CustomLoggerService implements LoggerService {
    error(context: string, method: string, message: string, stack?: string) {
        console.error(this.formatLog(context, method, message), stack)
    }

    warn(context: string, method: string, message: string) {
        console.warn(this.formatLog(context, method, message))
    }

    info(context: string, method: string, message: string) {
        console.info(this.formatLog(context, method, message))
    }

    log(context: string, method: string, message: string) {
        console.log(this.formatLog(context, method, message))
    }

    fatal(context: string, method: string, message: string) {
        console.error(this.formatLog(context, method, message))
    }

    private formatLog(context: string, method: string, message: any): string {
        const timestamp = new Date().toISOString()
        return `[${timestamp}] - ${context}.${method} - ${message}`
    }
}
