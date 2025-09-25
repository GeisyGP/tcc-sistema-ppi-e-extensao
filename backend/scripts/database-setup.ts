/* eslint-disable */
import { readFileSync } from "fs"
import { prisma } from "../src/config/prisma-standalone"
import * as path from "path"

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

export async function databaseSetup() {
    console.log("Starting database setup")

    const databaseUser = await prisma.$executeRawUnsafe(`SELECT usename FROM pg_catalog.pg_user WHERE usename = '${dbUser}'`)
    if (databaseUser == 0) {
        console.log("Creating database user")
        await prisma.$executeRawUnsafe(`CREATE ROLE "${dbUser}" LOGIN PASSWORD '${dbPassword}'`)
        await prisma.$executeRawUnsafe(`GRANT SELECT,INSERT,UPDATE ON ALL TABLES IN SCHEMA public TO "${dbUser}"`)
    }

    const createRlsFunction = await readFile("function-rls-policy.sql")
    await prisma.$executeRawUnsafe(createRlsFunction)
    console.log("Enabling RLS")
    const enableRls = await readFile("enable-rls.sql")
    await prisma.$executeRawUnsafe(enableRls)
    const enableUserRls = await readFile("enable-user-rls.sql")
    await prisma.$executeRawUnsafe(enableUserRls)
    

    const user: Array<object> = await prisma.$queryRaw`
        SELECT u.*
        FROM "User" u
        JOIN "UserCourse" uc ON uc."userId" = u.id
        WHERE uc.role = 'SYSADMIN';
    `

    if (!user || user.length === 0) {
        const createCourseSQL = await readFile("create-course.sql")
        const createUserSQL = await readFile("create-user.sql")
        const createUserCourseSQL = await readFile("create-user-course.sql")
        
        try {
            await prisma.$executeRawUnsafe(createCourseSQL)
            console.log("Creating user root")
            await prisma.$executeRawUnsafe(createUserSQL)
            await prisma.$executeRawUnsafe(createUserCourseSQL)
            console.log("Root user created")

        } catch (error: any) {
            console.log("Create root user script failed", error.message)
        }
    }
}

async function readFile(fileName: string): Promise<string> {
    return readFileSync(path.join(__dirname, fileName), "utf-8")
}

databaseSetup()