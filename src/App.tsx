import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminProjects from './pages/AdminProjects'
import Login from './pages/Login'
import ProjectDetails from './pages/ProjectDetails'
import PublicHome from './pages/PublicHome'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminProjects />} />
        <Route path="/admin/projetos/:id" element={<ProjectDetails />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
