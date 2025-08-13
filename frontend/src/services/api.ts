import axios from "axios"

export const backendApi = axios.create({
    baseURL: process.env.BACKEND_URL,
    headers: {
        "Content-Type": "application/json"
    }
})
