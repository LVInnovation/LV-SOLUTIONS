import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAdminSessionActive } from '../services/authSession'

export default function ProtectedRoute() {
  const location = useLocation()

  if (!isAdminSessionActive()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
