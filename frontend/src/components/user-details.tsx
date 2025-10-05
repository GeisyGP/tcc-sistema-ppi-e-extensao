import { User } from "@/types/user.type"

export function UserDetails({ user }: { user: User }) {
    return (
        <dl className="divide-y divide-gray-200">
            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Matrícula/SIAPE</dt>
                <dd className="text-gray-800">{user.registration}</dd>
            </div>

            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Vínculos</dt>
                <dd className="space-y-1">
                    {user.courses && user.courses.length > 0 ? (
                        user.courses.map((c) => (
                            <div key={c.name} className="flex items-center gap-2">
                                <span className="text-gray-800">{c.name}</span>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                    {c.role}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Sem vínculos</p>
                    )}
                </dd>
            </div>

            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Criado em</dt>
                <dd className="text-gray-800">{user.createdAt}</dd>
            </div>

            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Atualizado em</dt>
                <dd className="text-gray-800">{user.updatedAt}</dd>
            </div>
        </dl>
    )
}
