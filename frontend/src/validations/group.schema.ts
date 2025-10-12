import { z } from "zod"

export const createGroupSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").max(100, "Máximo 100 caracteres").trim(),
    userIds: z.array(z.string()).min(1, "Selecione pelo menos um discente"),
})
