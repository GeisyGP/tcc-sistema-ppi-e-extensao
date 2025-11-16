"use server"

import { signOut } from "@/auth"
import { cookies } from "next/headers"

export async function serverLogout() {
    const store = cookies()

    ;(await store).getAll().forEach(async (cookie) => {
        if (cookie.name.startsWith("authjs")) {
            ;(await store).delete(cookie.name)
        }
    })

    await signOut({ redirect: false })
}
