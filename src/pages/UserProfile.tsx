import { useAuth0 } from "@auth0/auth0-react"
import { Button } from "../components/ui/button"

export default function UserProfile() {
  const { user, logout } = useAuth0()
  if (!user) return <p>No autenticado</p>
  return (
    <div className="p-4 rounded-lg shadow bg-white">
      <p className="font-bold text-lg">{user.nickname || user.name}</p>
      <p className="text-sm text-slate-500">{user.email}</p>
      <Button onClick={() => logout()}>
        Salir
      </Button>
    </div>
  )
}
