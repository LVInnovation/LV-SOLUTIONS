import type { Project, ProjectStatus } from '../types/project'
import { createId, todayIsoDate } from '../utils/dates'

export const PROJECTS_STORAGE_KEY = 'lvsolutions_projects_v1'

const VALID_STATUSES: ProjectStatus[] = [
  'active',
  'development',
  'paused',
  'inactive',
  'cancelled',
]

function hasStorage() {
  return typeof window !== 'undefined' && 'localStorage' in window
}

export function createBlankProject(): Project {
  const now = new Date().toISOString()

  return {
    id: createId(),
    createdAt: now,
    updatedAt: now,

    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientLogin: '',
    clientPassword: '',

    projectName: '',
    publicName: '',
    publicDescription: '',
    internalDescription: '',
    projectStatus: 'development',
    implementationDate: '',
    appUrl: '',
    technologies: [],

    implementationValue: 0,
    monthlyValue: 0,
    dueDay: 10,
    lastPaymentDate: todayIsoDate(),

    githubLogin: '',
    githubRepository: '',
    githubUrl: '',
    githubBranch: 'main',

    vercelLogin: '',
    vercelProjectName: '',
    vercelProjectUrl: '',
    domainUrl: '',

    supabaseLogin: '',
    supabaseProjectUrl: '',
    supabaseProjectRef: '',
    supabaseApiUrl: '',
    supabasePublishableKey: '',
    supabaseSecretKey: '',
    supabaseHost: '',
    supabasePort: '',
    supabaseDatabase: '',
    supabaseUser: '',
    supabaseDatabasePassword: '',

    showInPortfolio: false,

    notes: '',

    customFields: [],
  }
}

function normalizeStatus(value: unknown): ProjectStatus {
  return VALID_STATUSES.includes(value as ProjectStatus)
    ? (value as ProjectStatus)
    : 'development'
}

export function normalizeProject(value: Partial<Project>): Project {
  const base = createBlankProject()
  const technologies = Array.isArray(value.technologies)
    ? value.technologies.map(String).filter(Boolean)
    : []
  const customFields = Array.isArray(value.customFields)
    ? value.customFields.map((field) => ({
        id: field.id || createId(),
        label: field.label || '',
        value: field.value || '',
        isSecret: Boolean(field.isSecret),
      }))
    : []

  return {
    ...base,
    ...value,
    id: value.id || base.id,
    createdAt: value.createdAt || base.createdAt,
    updatedAt: value.updatedAt || base.updatedAt,
    projectStatus: normalizeStatus(value.projectStatus),
    technologies,
    customFields,
    showInPortfolio: Boolean(value.showInPortfolio),
    implementationValue: Number(value.implementationValue) || 0,
    monthlyValue: Number(value.monthlyValue) || 0,
    dueDay: Number(value.dueDay) || 10,
  }
}

export function getProjects() {
  if (!hasStorage()) {
    return []
  }

  const raw = window.localStorage.getItem(PROJECTS_STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.map((project) => normalizeProject(project as Partial<Project>))
  } catch {
    return []
  }
}

export function persistProjects(projects: Project[]) {
  if (!hasStorage()) {
    return
  }

  // TODO: migrar este repositório local para Supabase com banco protegido e criptografia.
  window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects))
}

export function getProjectById(id: string) {
  return getProjects().find((project) => project.id === id) ?? null
}

export function saveProject(project: Project) {
  const now = new Date().toISOString()
  const normalizedProject = normalizeProject({
    ...project,
    updatedAt: now,
  })
  const projects = getProjects()
  const existingIndex = projects.findIndex((item) => item.id === project.id)

  if (existingIndex >= 0) {
    projects[existingIndex] = normalizedProject
  } else {
    projects.unshift(normalizedProject)
  }

  persistProjects(projects)
  return normalizedProject
}

export function deleteProject(projectId: string) {
  persistProjects(getProjects().filter((project) => project.id !== projectId))
}

export function replaceProjects(projects: Project[]) {
  persistProjects(projects.map((project) => normalizeProject(project)))
}

export function getPortfolioProjects() {
  return getProjects().filter((project) => project.showInPortfolio)
}

export function exportProjectsJson() {
  return JSON.stringify(getProjects(), null, 2)
}
