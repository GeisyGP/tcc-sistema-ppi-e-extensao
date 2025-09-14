/* eslint-disable */
import { readFileSync } from "fs"
import { prisma } from "../src/config/prisma-standalone"
import * as path from "path"

export async function databaseSetup() {
    console.log("Starting database setup")

    const createRlsFunction = readFileSync(path.join(__dirname, "function-rls-policy.sql"), "utf-8")
    await prisma.$executeRawUnsafe(createRlsFunction)
    console.log("Enabling RLS")
    const enableRls = readFileSync(path.join(__dirname, "enable-rls.sql"), "utf-8")
    await prisma.$executeRawUnsafe(enableRls)
    const enableUserRls = readFileSync(path.join(__dirname, "enable-user-rls.sql"), "utf-8")
    await prisma.$executeRawUnsafe(enableUserRls)
    

    const user: Array<object> = await prisma.$queryRaw`
        SELECT u.*
        FROM "User" u
        JOIN "UserCourse" uc ON uc."userId" = u.id
        WHERE uc.role = 'SYSADMIN';
    `

    if (!user || user.length === 0) {
        console.log("Creating user root")
        const createCourseSQL = readFileSync(path.join(__dirname, "create-course.sql"), "utf-8")
        const createUserSQL = readFileSync(path.join(__dirname, "create-user.sql"), "utf-8")
        const createUserCourseSQL = readFileSync(path.join(__dirname, "create-user-course.sql"), "utf-8")

        try {
            await prisma.$executeRawUnsafe(createCourseSQL)
            await prisma.$executeRawUnsafe(createUserSQL)
            await prisma.$executeRawUnsafe(createUserCourseSQL)

            console.log("Root user created")
        } catch (error: any) {
            console.log("Create root user script failed", error.message)
        }
    }
}

databaseSetup()