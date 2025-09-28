import { User } from "@/types/user.type";

export function UserDetails({ user }: { user: User }) {
  return (
    <>
      <p><strong>Matrícula/SIAPE:</strong> {user.registration}</p>
      <div>
        <strong>Vínculos:</strong>
        {user.courses && user.courses.length > 0 ? (
          <ul className="ml-4 list-disc">
            {user.courses.map((c) => (
              <li key={c.name}>
                {c.name} — {c.role}
              </li>
            ))}
          </ul>
        ) : (
          <p className="ml-4 text-gray-500">Sem vínculos</p>
        )}
      </div>
      <p><strong>Criado em:</strong> {user.createdAt}</p>
      <p><strong>Atualizado em:</strong> {user.updatedAt}</p>
    </>
  )
}
