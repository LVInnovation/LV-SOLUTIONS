import { FolderKanban } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminTopbar from '../components/admin/AdminTopbar'
import ProjectCard from '../components/admin/ProjectCard'
import { clearAdminSession } from '../services/authSession'
import { getProjects } from '../services/projectRepository'
import type { Project } from '../types/project'
import { PROJECT_STATUS_LABELS } from '../types/project'

export default function AdminProjects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadProjects() {
      const loadedProjects = await getProjects()

      if (isMounted) {
        setProjects(loadedProjects)
        setIsLoading(false)
      }
    }

    loadProjects().catch(() => {
      if (isMounted) {
        setProjects([])
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return projects
    }

    return projects.filter((project) => {
      const status = PROJECT_STATUS_LABELS[project.projectStatus].toLowerCase()
      const searchable = [
        project.projectName,
        project.publicName,
        project.clientName,
        status,
      ]
        .join(' ')
        .toLowerCase()

      return searchable.includes(normalizedQuery)
    })
  }, [projects, query])

  async function logout() {
    try {
      await clearAdminSession()
    } finally {
      navigate('/login')
    }
  }

  return (
    <div className="page-shell">
      <AdminTopbar
        query={query}
        onQueryChange={setQuery}
        onNewProject={() => navigate('/admin/projetos/novo')}
        onLogout={logout}
        onImported={setProjects}
      />
      <main className="section-shell py-8">
        {isLoading ? (
          <div className="glass-panel rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold text-white">
              Carregando projetos...
            </h2>
          </div>
        ) : projects.length === 0 ? (
          <div className="glass-panel rounded-lg p-8 text-center">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
              <FolderKanban className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Nenhum projeto cadastrado ainda
            </h2>
            <p className="mt-3 text-slate-400">
              Clique em Novo Projeto para criar o primeiro registro local.
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="glass-panel rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold text-white">
              Nenhum projeto encontrado
            </h2>
            <p className="mt-2 text-slate-400">
              Ajuste a busca por nome, cliente ou status.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={(projectId) => navigate(`/admin/projetos/${projectId}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
