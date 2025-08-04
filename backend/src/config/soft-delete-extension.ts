/* eslint-disable */
import { Prisma } from "@prisma/client"

export const softDeleteExtension = {
    name: "soft-delete",
    model: {
        $allModels: {
            async delete<M>(
                this: M,
                params: {
                    where: Prisma.Args<M, "deleteMany">["where"]
                    include?: Prisma.Args<M, "updateMany">["include"]
                }
            ): Promise<any> {
                const context = Prisma.getExtensionContext(this)
                const { where, include } = params

                return (context as any).update({
                    where,
                    data: { deletedAt: new Date() },
                    include,
                })
            },

            async deleteMany<M>(
                this: M,
                params?: {
                    where: Prisma.Args<M, "deleteMany">["where"]
                    include?: Prisma.Args<M, "updateMany">["include"]
                }
            ): Promise<any> {
                const context = Prisma.getExtensionContext(this)
                const { where, include } = params || {}

                return (context as any).updateMany({
                    where,
                    data: { deletedAt: new Date() },
                    include,
                })
            },
        },
    },
    query: {
        $allModels: {
            async findMany({ args, query }: { args: any; query: Function }) {
                args.where ??= {}
                args.where.deletedAt = null
                return query(args)
            },
            async findFirst({ args, query }: { args: any; query: Function }) {
                args.where ??= {}
                args.where.deletedAt = null
                return query(args)
            },
            async findFirstOrThrow({ args, query }: { args: any; query: Function }) {
                args.where ??= {}
                args.where.deletedAt = null
                return query(args)
            },
            async findUnique({ args, query }: { args: any; query: Function }) {
                args.where.deletedAt = null
                return query(args)
            },
            async findUniqueOrThrow({ args, query }: { args: any; query: Function }) {
                args.where.deletedAt = null
                return query(args)
            },
        },
    },
}