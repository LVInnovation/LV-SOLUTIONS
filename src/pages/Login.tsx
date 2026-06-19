import { LockKeyhole, LogIn } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandMark from '../components/BrandMark'
import { isAdminSessionActive, startAdminSession } from '../services/authSession'

const ADMIN_USER = 'LUVI'
const ADMIN_PASSWORD = '011025'

export default function Login() {
  const navigate = useNavigate()
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const alreadyAuthenticated = isAdminSessionActive()

  useEffect(() => {
    if (alreadyAuthenticated) {
      navigate('/admin')
    }
  }, [alreadyAuthenticated, navigate])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (user.trim() === ADMIN_USER && password === ADMIN_PASSWORD) {
      startAdminSession()
      navigate('/admin')
      return
    }

    setError('Usuário ou senha inválidos.')
  }

  if (alreadyAuthenticated) {
    return null
  }

  return (
    <div className="page-shell grid min-h-screen place-items-center px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(47,197,255,0.18),transparent_28rem),radial-gradient(circle_at_80%_30%,rgba(218,69,255,0.18),transparent_25rem)]" />
      <div className="glass-panel w-full max-w-md rounded-lg p-6 sm:p-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <BrandMark />
          <Link to="/" className="text-sm font-medium text-cyan-200 hover:text-white">
            Voltar ao site
          </Link>
        </div>
        <div className="mb-6">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-cyan-100">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-white">Login privado</h1>
          <p className="mt-2 text-sm text-slate-400">
            Acesse o controle local de projetos da L&V Solutions.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label>
            <span className="field-label">Usuário</span>
            <input
              value={user}
              className="admin-input"
              autoComplete="username"
              onChange={(event) => setUser(event.target.value)}
            />
          </label>
          <label>
            <span className="field-label">Senha</span>
            <input
              type="password"
              value={password}
              className="admin-input"
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && (
            <p className="rounded-md border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {error}
            </p>
          )}
          <button type="submit" className="primary-button w-full">
            <LogIn className="h-4 w-4" />
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
