import NextAuth from "next-auth"
import "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { jwtDecode, JwtPayload } from "jwt-decode"
import { login } from "@/services/auth.service"

interface AppJwtPayload extends JwtPayload {
    sub: string
    name: string
    role: string
    courseId: string[]
    iat: number
    exp: number
}

declare module "next-auth" {
    interface User {
        accessToken?: string;
        id?: string
        role?: string
        name?: string
        courseId?: string[]
    }
    interface Session {
        user: {
            id?: string
            role?: string
            name?: string
            courseId?: string[]
        }
        accessToken?: string
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
                const parsed = z
                    .object({
                        registration: z.string(),
                        password: z.string()
                    })
                    .safeParse(credentials)

                if (!parsed.success) return null

                try {
                    const data = await login({
                        registration: parsed.data.registration,
                        password: parsed.data.password,
                    })
                    if (!data?.accessToken) return null

                    const decoded = jwtDecode(data.accessToken) as AppJwtPayload;

                    return {
                        id: decoded.sub,
                        name: decoded.name,
                        role: decoded.role,
                        courseId: decoded.courseId,
                        accessToken: data.accessToken,
                    }
                } catch {
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken
                token.id = user.id
                token.role = user.role
                token.name = user.name
                token.courseId = user.courseId
            }
            return token
        },
        async session({ session, token }) {
            if (token.accessToken) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.name = token.name as string;
                session.user.courseId = token.courseId as string[];
                session.accessToken = token.accessToken as string;
            }
            return session
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isRequiredAuth = !nextUrl.pathname.startsWith('/login') && !nextUrl.pathname.startsWith('/error')
            if (isRequiredAuth) {
                return isLoggedIn;
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/home', nextUrl));
            }
            return true;
        },
    },
    experimental: { enableWebAuthn: true },
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login"
    },
})
