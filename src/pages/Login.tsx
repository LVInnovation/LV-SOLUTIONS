import { LockKeyhole, LogIn } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import BrandMark from '../components/BrandMark'
import { isAdminSessionActive } from '../services/authSession'
import { supabase } from '../services/supabase'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? '/admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true

    isAdminSessionActive()
      .then((isActive) => {
        if (!isMounted) {
          return
        }

        if (isActive) {
          navigate(redirectTo, { replace: true })
          return
        }

        setIsCheckingSession(false)
      })
      .catch(() => {
        if (isMounted) {
          setIsCheckingSession(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [navigate, redirectTo])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const normalizedEmail = email.trim()

    if (!normalizedEmail || !password) {
      setError('Informe email e senha.')
      return
    }

    if (!supabase) {
      setError('Supabase nao esta configurado.')
      return
    }

    setIsSubmitting(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })

    setIsSubmitting(false)

    if (signInError) {
      setError('Email ou senha invalidos.')
      return
    }

    navigate(redirectTo, { replace: true })
  }

  if (isCheckingSession) {
    return (
      <div className="page-shell grid min-h-screen place-items-center px-4 py-10">
        <div className="glass-panel rounded-lg p-8 text-center">
          <h1 className="text-xl font-bold text-white">Verificando acesso...</h1>
        </div>
      </div>
    )
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
            Área restrita dos projetos da L&V Solutions.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label>
            <span className="field-label">Email</span>
            <input
              type="email"
              value={email}
              className="admin-input"
              autoComplete="email"
              disabled={isSubmitting}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            <span className="field-label">Senha</span>
            <input
              type="password"
              value={password}
              className="admin-input"
              autoComplete="current-password"
              disabled={isSubmitting}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && (
            <p className="rounded-md border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {error}
            </p>
          )}
          <button type="submit" className="primary-button w-full" disabled={isSubmitting}>
            <LogIn className="h-4 w-4" />
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
