import * as fs from "fs"
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common"
import { Request, Response } from "express"

@Catch()
export class FileCleanupFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const req = ctx.getRequest<Request>()
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path)
        }
        const res = ctx.getResponse<Response>()
        if (exception instanceof HttpException) {
            const response = exception.getResponse()
            const status = exception.getStatus()
            return res.status(status).json(response)
        }

        res.status(500).json({ message: "Internal server error" })
    }
}
