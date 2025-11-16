"use client"
import { serverLogout } from "./server-logout"

export async function logout() {
    await serverLogout()
    window.location.href = "/login"
}
