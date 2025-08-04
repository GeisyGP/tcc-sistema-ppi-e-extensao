import { Injectable } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"
import { softDeleteExtension } from "./soft-delete-extension"

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        const extendedClient = new PrismaClient().$extends(softDeleteExtension)

        super()
        Object.assign(this, extendedClient)
    }
}
