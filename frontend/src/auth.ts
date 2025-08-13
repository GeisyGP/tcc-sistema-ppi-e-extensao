import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { jwtDecode, JwtPayload } from "jwt-decode"
import { login } from "@/services/auth.service"

interface AppJwtPayload extends JwtPayload {
    sub: string
    name: string
    role: string
    iat: number
    exp: number
}

declare module "next-auth" {
    interface User {
        accessToken?: string;
        id?: string
        role?: string
        name?: string
    }
    interface Session {
        user: {
            id?: string
            role?: string
            name?: string
        }
        accessToken?: string
    }
}

export const { auth, signIn, signOut } = NextAuth({
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
            }
            return token
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            session.user.role = token.role as string;
            session.user.name = token.name as string;
            session.accessToken = token.accessToken as string;
            return session
        }
    },
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login"
    }
})
