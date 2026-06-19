import { ArrowLeft, Edit3, Save, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BrandMark from '../components/BrandMark'
import ConfirmDialog from '../components/admin/ConfirmDialog'
import ProjectForm from '../components/admin/ProjectForm'
import {
  createBlankProject,
  deleteProject,
  getProjectById,
  saveProject,
} from '../services/projectRepository'
import type { Project } from '../types/project'

function getInitialDetailsState(id?: string) {
  if (id === 'novo') {
    return {
      project: createBlankProject(),
      isEditing: true,
      isMissing: false,
    }
  }

  const existingProject = id ? getProjectById(id) : null

  return {
    project: existingProject ?? createBlankProject(),
    isEditing: false,
    isMissing: !existingProject,
  }
}

export default function ProjectDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const initialState = getInitialDetailsState(id)
  const [project, setProject] = useState<Project>(() => initialState.project)
  const [isEditing, setIsEditing] = useState(initialState.isEditing)
  const [feedback, setFeedback] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const isNew = id === 'novo'

  function flashFeedback(message: string) {
    setFeedback(message)
    window.setTimeout(() => setFeedback(''), 2200)
  }

  function handleSave() {
    if (!project.projectName.trim()) {
      window.alert('Informe o nome do projeto antes de salvar.')
      return
    }

    const savedProject = saveProject(project)
    setProject(savedProject)
    setIsEditing(false)
    flashFeedback('Projeto salvo com sucesso.')

    if (isNew) {
      navigate(`/admin/projetos/${savedProject.id}`, { replace: true })
    }
  }

  function handleDelete() {
    deleteProject(project.id)
    setDeleteDialogOpen(false)
    navigate('/admin')
  }

  if (initialState.isMissing) {
    return (
      <div className="page-shell">
        <main className="section-shell grid min-h-screen place-items-center py-10">
          <div className="glass-panel max-w-md rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-white">
              Projeto não encontrado
            </h1>
            <p className="mt-3 text-slate-400">
              Esse registro não existe mais no localStorage deste navegador.
            </p>
            <Link to="/admin" className="primary-button mt-6">
              Voltar
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="section-shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <BrandMark compact />
            <div>
              <p className="text-sm text-cyan-200/75">
                {isNew ? 'Novo registro' : 'Detalhes do projeto'}
              </p>
              <h1 className="text-xl font-bold text-white sm:text-2xl">
                {project.projectName || 'Projeto sem nome'}
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin" className="ghost-button">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
            <button
              type="button"
              className="ghost-button"
              onClick={() => setIsEditing(true)}
              disabled={isEditing}
            >
              <Edit3 className="h-4 w-4" />
              Editar
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={handleSave}
              disabled={!isEditing}
            >
              <Save className="h-4 w-4" />
              Salvar
            </button>
            {!isNew && (
              <button
                type="button"
                className="danger-button"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Excluir projeto
              </button>
            )}
          </div>
        </div>
        {feedback && (
          <div className="border-t border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-center text-sm text-emerald-100">
            {feedback}
          </div>
        )}
      </header>
      <main className="section-shell py-8">
        <ProjectForm
          project={project}
          onChange={setProject}
          readOnly={!isEditing}
        />
      </main>
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Excluir projeto?"
        message="Essa ação remove o projeto do localStorage deste navegador. Exporte um backup antes se quiser guardar uma cópia."
        confirmLabel="Excluir projeto"
        destructive
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
