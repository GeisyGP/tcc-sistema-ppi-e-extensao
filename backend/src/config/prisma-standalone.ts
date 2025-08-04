import { PrismaClient } from "@prisma/client"
import { softDeleteExtension } from "./soft-delete-extension"

export const prisma = new PrismaClient().$extends(softDeleteExtension)
