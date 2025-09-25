import { Injectable } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"
import { softDeleteExtension } from "./soft-delete-extension"

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super({
            datasourceUrl: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public&connection_limit=1`,
        })
        this.$extends(softDeleteExtension)
    }
}
