import NextAuth from "next-auth"
import "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { jwtDecode, JwtPayload } from "jwt-decode"
import { login } from "@/services/auth.service"
import { CoursesJwt } from "./types/course.type"

export interface AppJwtPayload extends JwtPayload {
    sub: string
    name: string
    courses: CoursesJwt[]
    mainRole: string
    mainCourseId: string
    changePasswordIsRequired: boolean
    iat: number
    exp: number
}

declare module "next-auth" {
    interface User {
        exp: number
        accessToken?: string
        id?: string
        name?: string
        courses?: CoursesJwt[]
        mainRole?: string
        mainCourseId?: string
        changePasswordIsRequired?: boolean
    }
    interface Session {
        user: {
            id?: string
            name?: string
            courses?: CoursesJwt[]
            mainRole?: string
            mainCourseId?: string
            changePasswordIsRequired?: boolean
        }
        accessToken?: string
        exp: number
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            async authorize(credentials) {
                if (credentials?.accessToken && typeof credentials.accessToken === "string") {
                    const decoded = jwtDecode(credentials.accessToken) as AppJwtPayload
                    return {
                        id: decoded.sub,
                        name: decoded.name,
                        mainRole: decoded.mainRole,
                        mainCourseId: decoded.mainCourseId,
                        courses: decoded.courses,
                        changePasswordIsRequired: decoded.changePasswordIsRequired,
                        accessToken: credentials.accessToken,
                        exp: decoded.exp,
                    }
                }
                const parsed = z
                    .object({
                        registration: z.string(),
                        password: z.string(),
                    })
                    .safeParse(credentials)

                if (!parsed.success) return null

                try {
                    const data = await login({
                        registration: parsed.data.registration,
                        password: parsed.data.password,
                    })
                    if (!data?.accessToken) return null

                    const decoded = jwtDecode(data.accessToken) as AppJwtPayload

                    return {
                        id: decoded.sub,
                        name: decoded.name,
                        mainRole: decoded.mainRole,
                        mainCourseId: decoded.mainCourseId,
                        courses: decoded.courses,
                        accessToken: data.accessToken,
                        changePasswordIsRequired: data.changePasswordIsRequired,
                        exp: decoded.exp,
                    }
                } catch {
                    return null
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    accessToken: user.accessToken,
                    id: user.id,
                    name: user.name,
                    mainRole: user.mainRole,
                    mainCourseId: user.mainCourseId,
                    courses: user.courses,
                    changePasswordIsRequired: user.changePasswordIsRequired,
                    exp: user.exp,
                }
            }
            return token
        },
        async session({ session, token }) {
            if (token.accessToken) {
                session.user.id = token.id as string
                session.user.mainRole = token.mainRole as string
                session.user.name = token.name as string
                session.user.mainCourseId = token.mainCourseId as string
                session.user.courses = token.courses as CoursesJwt[]
                session.user.changePasswordIsRequired = token.changePasswordIsRequired as boolean
                session.accessToken = token.accessToken as string
                session.exp = token.exp as number
            }
            return session
        },
        authorized({ auth, request: { nextUrl } }) {
            const now = Date.now()
            const expires = auth?.exp ? new Date(auth.exp * 1000).getTime() : 0
            const isLoggedIn = !!auth && expires > now
            const isRequiredAuth = !nextUrl.pathname.startsWith("/login") && !nextUrl.pathname.startsWith("/error")

            if (isLoggedIn && auth?.user.changePasswordIsRequired && !nextUrl.pathname.startsWith("/change-password")) {
                return Response.redirect(new URL("/change-password", nextUrl))
            }

            if (isRequiredAuth) {
                return isLoggedIn
            } else if (isLoggedIn) {
                return Response.redirect(new URL("/home", nextUrl))
            }
            return true
        },
    },
    experimental: { enableWebAuthn: true },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
})
