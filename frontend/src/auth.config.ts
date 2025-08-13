import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
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
    providers: []
} satisfies NextAuthConfig;