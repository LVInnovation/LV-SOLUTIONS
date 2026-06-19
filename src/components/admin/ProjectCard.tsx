import { ExternalLink } from 'lucide-react'
import type { Project } from '../../types/project'
import { PROJECT_STATUS_LABELS } from '../../types/project'
import { calculatePaymentStatus } from '../../utils/paymentStatus'
import {
  formatCurrency,
  formatDateBR,
  normalizeUrl,
} from '../../utils/formatters'

type ProjectCardProps = {
  project: Project
  onOpen: (projectId: string) => void
}

const toneClasses = {
  green:
    'border-emerald-400/45 bg-emerald-950/20 shadow-emerald-950/25 hover:border-emerald-300/70',
  yellow:
    'border-amber-300/45 bg-amber-950/20 shadow-amber-950/25 hover:border-amber-200/70',
  red: 'border-rose-400/50 bg-rose-950/20 shadow-rose-950/25 hover:border-rose-300/75',
  neutral:
    'border-slate-500/35 bg-slate-900/45 shadow-slate-950/25 hover:border-slate-300/45',
}

export default function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const payment = calculatePaymentStatus(
    project.dueDay,
    project.lastPaymentDate,
    project.projectStatus,
  )
  const appUrl = normalizeUrl(project.appUrl || project.domainUrl)

  return (
    <article
      className={`rounded-lg border p-5 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 ${toneClasses[payment.tone]}`}
    >
      <button
        type="button"
        className="block w-full text-left"
        onClick={() => onOpen(project.id)}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              {project.projectName || 'Projeto sem nome'}
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Cliente: {project.clientName || 'Não informado'}
            </p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs ${payment.classes}`}>
            {payment.label}
          </span>
        </div>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Status</dt>
            <dd className="font-medium text-slate-100">
              {PROJECT_STATUS_LABELS[project.projectStatus]}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Mensalidade</dt>
            <dd className="font-medium text-slate-100">
              {formatCurrency(project.monthlyValue)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Vencimento</dt>
            <dd className="font-medium text-slate-100">Dia {project.dueDay}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Último pagamento</dt>
            <dd className="font-medium text-slate-100">
              {formatDateBR(project.lastPaymentDate)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Pagamento</dt>
            <dd className="font-medium text-slate-100">{payment.label}</dd>
          </div>
        </dl>
      </button>
      <div className="mt-5 border-t border-white/10 pt-4">
        {appUrl ? (
          <a
            href={appUrl}
            target="_blank"
            rel="noreferrer"
            className="ghost-button w-full"
            onClick={(event) => event.stopPropagation()}
          >
            Acessar sistema
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <p className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-slate-400">
            Link para acessar o sistema não informado.
          </p>
        )}
      </div>
    </article>
  )
}
