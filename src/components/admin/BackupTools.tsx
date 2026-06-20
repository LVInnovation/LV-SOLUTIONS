import { Download, Upload } from 'lucide-react'
import { useRef } from 'react'
import {
  exportProjectsJson,
  normalizeProject,
  replaceProjects,
} from '../../services/projectRepository'
import type { Project } from '../../types/project'

type BackupToolsProps = {
  onImported: (projects: Project[]) => void
}

export default function BackupTools({ onImported }: BackupToolsProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  async function exportBackup() {
    const blob = new Blob([await exportProjectsJson()], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const today = new Date().toISOString().slice(0, 10)

    link.href = url
    link.download = `lv-solutions-backup-${today}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  async function importBackup(file: File) {
    const text = await file.text()
    const parsed = JSON.parse(text)

    if (!Array.isArray(parsed)) {
      window.alert('O arquivo de backup precisa conter uma lista de projetos.')
      return
    }

    const shouldOverwrite = window.confirm(
      'Importar este backup vai sobrescrever os projetos atuais. Deseja continuar?',
    )

    if (!shouldOverwrite) {
      return
    }

    const normalizedProjects = parsed.map((project) =>
      normalizeProject(project as Partial<Project>),
    )
    await replaceProjects(normalizedProjects)
    onImported(normalizedProjects)
    window.alert('Backup importado com sucesso.')
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="ghost-button"
        onClick={() => {
          exportBackup().catch(() => {
            window.alert('NÃ£o foi possÃ­vel exportar o backup JSON.')
          })
        }}
      >
        <Download className="h-4 w-4" />
        Exportar backup JSON
      </button>
      <button
        type="button"
        className="ghost-button"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        Importar backup JSON
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''

          if (file) {
            importBackup(file).catch(() => {
              window.alert('Não foi possível importar este arquivo JSON.')
            })
          }
        }}
      />
    </div>
  )
}
