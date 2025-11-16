import { z } from "zod"

export const createUserSchema = z
    .object({
        name: z
            .string()
            .min(1, "Nome é obrigatório")
            .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços")
            .refine((value) => value.split(" ").length >= 2, "Deve conter nome e sobrenome")
            .max(100, "Máximo 100 caracteres")
            .trim(),
        registration: z.string().min(1, "Matrícula/SIAPE é obrigatória").max(36, "Máximo 36 caracteres").trim(),
        courseId: z.string().min(1, "Selecione um curso").optional(),
        password: z.string().min(8, "Senha é obrigatória e deve ter no mínimo 8 dígitos"),
        confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas precisam ser iguais",
        path: ["confirmPassword"],
    })

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Senha atual é obrigatória"),
        newPassword: z.string().min(8, "Nova senha é obrigatória e deve ter no mínimo 8 dígitos"),
        confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "As senhas precisam ser iguais",
        path: ["confirmPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: "A nova senha deve ser diferente da senha atual",
        path: ["newPassword"],
    })
