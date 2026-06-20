import { LogOut, Plus, Search } from 'lucide-react'
import type { Project } from '../../types/project'
import BrandMark from '../BrandMark'
import BackupTools from './BackupTools'

type AdminTopbarProps = {
  query: string
  onQueryChange: (query: string) => void
  onNewProject: () => void
  onLogout: () => void
  onImported: (projects: Project[]) => void
}

export default function AdminTopbar({
  query,
  onQueryChange,
  onNewProject,
  onLogout,
  onImported,
}: AdminTopbarProps) {
  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="section-shell py-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4">
              <BrandMark compact />
              <div>
                <p className="text-sm text-cyan-200/75">Área privada</p>
                <h1 className="text-2xl font-bold text-white">
                  Controle de Projetos
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="primary-button"
                onClick={onNewProject}
              >
                <Plus className="h-4 w-4" />
                Novo Projeto
              </button>
              <BackupTools onImported={onImported} />
              <button type="button" className="danger-button" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
          <label className="relative block max-w-2xl">
            <span className="sr-only">Buscar projetos</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              className="admin-input pl-10"
              placeholder="Buscar por nome, cliente ou status"
              onChange={(event) => onQueryChange(event.target.value)}
            />
          </label>
        </div>
      </div>
    </header>
  )
}
