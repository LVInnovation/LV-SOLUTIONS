export type ProjectStatus =
  | 'active'
  | 'development'
  | 'paused'
  | 'inactive'
  | 'cancelled'

export type CustomField = {
  id: string
  label: string
  value: string
  isSecret: boolean
}

export type Project = {
  id: string
  createdAt: string
  updatedAt: string

  clientName: string
  clientPhone: string
  clientEmail: string
  clientLogin: string
  clientPassword: string

  projectName: string
  publicName: string
  publicDescription: string
  internalDescription: string
  projectStatus: ProjectStatus
  implementationDate: string
  appUrl: string
  technologies: string[]

  implementationValue: number
  monthlyValue: number
  dueDay: number
  lastPaymentDate: string

  githubLogin: string
  githubRepository: string
  githubUrl: string
  githubBranch: string

  vercelLogin: string
  vercelProjectName: string
  vercelProjectUrl: string
  domainUrl: string

  supabaseLogin: string
  supabaseProjectUrl: string
  supabaseProjectRef: string
  supabaseApiUrl: string
  supabasePublishableKey: string
  supabaseSecretKey: string
  supabaseHost: string
  supabasePort: string
  supabaseDatabase: string
  supabaseUser: string
  supabaseDatabasePassword: string

  showInPortfolio: boolean

  notes: string

  customFields: CustomField[]
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active: 'Ativo',
  development: 'Em desenvolvimento',
  paused: 'Pausado',
  inactive: 'Inativo',
  cancelled: 'Cancelado',
}

export const PROJECT_STATUS_OPTIONS: Array<{
  value: ProjectStatus
  label: string
}> = [
  { value: 'active', label: 'Ativo' },
  { value: 'development', label: 'Em desenvolvimento' },
  { value: 'paused', label: 'Pausado' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'cancelled', label: 'Cancelado' },
]
