import { z } from "zod"

export const createUserSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    registration: z.string().min(1, "Matrícula/SIAPE é obrigatória"),
    courseId: z.string().min(1, "Selecione um curso"),
    password: z.string().min(1, "Senha é obrigatória"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória")
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"], 
})
