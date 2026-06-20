import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAdminSessionActive } from '../services/authSession'

export default function ProtectedRoute() {
  const location = useLocation()
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    let isMounted = true

    isAdminSessionActive()
      .then((isActive) => {
        if (isMounted) {
          setIsAuthenticated(isActive)
          setIsCheckingSession(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsAuthenticated(false)
          setIsCheckingSession(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (isCheckingSession) {
    return (
      <div className="page-shell grid min-h-screen place-items-center px-4 py-10">
        <div className="glass-panel rounded-lg p-8 text-center">
          <h1 className="text-xl font-bold text-white">Verificando acesso...</h1>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
