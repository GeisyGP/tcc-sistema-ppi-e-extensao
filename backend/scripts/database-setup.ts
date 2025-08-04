/* eslint-disable */
import { readFileSync } from "fs"
import { prisma } from "../src/config/prisma-standalone"
import * as path from "path"

export async function databaseSetup() {
    const user: Array<object> = await prisma.$queryRaw`SELECT * FROM "User" WHERE role = 'SYSADMIN';`

    if (!user || user.length === 0) {
        const createUserSQL = readFileSync(path.join(__dirname, "create-user.sql"), "utf-8")

        try {
            await prisma.$executeRawUnsafe(createUserSQL)
            console.log("Root user created")
        } catch (error: any) {
            console.log("Create root user script failed", error.message)
        }
    }
}

databaseSetup()