import type { Project, ProjectStatus } from '../types/project'
import { createId, todayIsoDate } from '../utils/dates'
import { isSupabaseConfigured, supabase } from './supabase'

export const PROJECTS_STORAGE_KEY = 'lvsolutions_projects_v1'

const PROJECTS_TABLE = 'lv_projects'
const VALID_STATUSES: ProjectStatus[] = [
  'active',
  'development',
  'paused',
  'inactive',
  'cancelled',
]

type ProjectRow = {
  id?: string | number | null
  data: Partial<Project> | null
}

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

function getLocalProjects() {
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

function persistLocalProjects(projects: Project[]) {
  if (!hasStorage()) {
    return
  }

  window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects))
}

function warnSupabaseFallback(action: string, error: unknown) {
  console.warn(
    `Supabase ${action} falhou. Usando localStorage como fallback.`,
    error,
  )
}

function shouldUseSupabase() {
  return isSupabaseConfigured && supabase !== null
}

function sortProjects(projects: Project[]) {
  return [...projects].sort((projectA, projectB) => {
    const updatedComparison = projectB.updatedAt.localeCompare(projectA.updatedAt)

    if (updatedComparison !== 0) {
      return updatedComparison
    }

    return projectB.createdAt.localeCompare(projectA.createdAt)
  })
}

function rowToProject(row: ProjectRow) {
  const rowId = row.id == null ? undefined : String(row.id)
  const data =
    row.data && typeof row.data === 'object' && !Array.isArray(row.data)
      ? row.data
      : {}

  return normalizeProject({
    ...data,
    id: data.id || rowId,
  })
}

function upsertProjectInList(projects: Project[], project: Project) {
  const nextProjects = [...projects]
  const existingIndex = nextProjects.findIndex((item) => item.id === project.id)

  if (existingIndex >= 0) {
    nextProjects[existingIndex] = project
  } else {
    nextProjects.unshift(project)
  }

  return nextProjects
}

function saveLocalProject(project: Project) {
  const normalizedProject = normalizeProject(project)
  const projects = getLocalProjects()
  const existingIndex = projects.findIndex(
    (item) => item.id === normalizedProject.id,
  )

  if (existingIndex >= 0) {
    projects[existingIndex] = normalizedProject
  } else {
    projects.unshift(normalizedProject)
  }

  persistLocalProjects(projects)
  return normalizedProject
}

function deleteLocalProject(projectId: string) {
  persistLocalProjects(
    getLocalProjects().filter((project) => project.id !== projectId),
  )
}

function isRowId(id: ProjectRow['id']): id is string | number {
  return id != null
}

async function getRemoteRows() {
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .select('id, data')

  if (error) {
    throw error
  }

  return (data ?? []) as ProjectRow[]
}

async function findRemoteProjectRow(projectId: string) {
  const rows = await getRemoteRows()

  return rows.find((row) => rowToProject(row).id === projectId) ?? null
}

async function insertRemoteProjects(projects: Project[]) {
  if (!supabase || projects.length === 0) {
    return
  }

  const rowsWithProjectIds = projects.map((project) => ({
    id: project.id,
    data: project,
  }))
  const { error } = await supabase.from(PROJECTS_TABLE).insert(rowsWithProjectIds)

  if (!error) {
    return
  }

  const rowsWithGeneratedIds = projects.map((project) => ({ data: project }))
  const { error: fallbackError } = await supabase
    .from(PROJECTS_TABLE)
    .insert(rowsWithGeneratedIds)

  if (fallbackError) {
    throw fallbackError
  }
}

async function saveRemoteProject(project: Project) {
  if (!supabase) {
    return
  }

  const existingRow = await findRemoteProjectRow(project.id)

  if (existingRow?.id != null) {
    const { error } = await supabase
      .from(PROJECTS_TABLE)
      .update({ data: project })
      .eq('id', existingRow.id)

    if (error) {
      throw error
    }

    return
  }

  await insertRemoteProjects([project])
}

async function deleteRemoteProject(projectId: string) {
  if (!supabase) {
    return
  }

  const existingRow = await findRemoteProjectRow(projectId)

  if (existingRow?.id == null) {
    return
  }

  const { error } = await supabase
    .from(PROJECTS_TABLE)
    .delete()
    .eq('id', existingRow.id)

  if (error) {
    throw error
  }
}

async function replaceRemoteProjects(projects: Project[]) {
  if (!supabase) {
    return
  }

  const existingRows = await getRemoteRows()
  const existingIds = existingRows.map((row) => row.id).filter(isRowId)

  if (existingIds.length > 0) {
    const { error } = await supabase
      .from(PROJECTS_TABLE)
      .delete()
      .in('id', existingIds)

    if (error) {
      throw error
    }
  }

  await insertRemoteProjects(projects)
}

export async function getProjects() {
  if (!shouldUseSupabase()) {
    return getLocalProjects()
  }

  try {
    const remoteProjects = sortProjects((await getRemoteRows()).map(rowToProject))
    persistLocalProjects(remoteProjects)

    return remoteProjects
  } catch (error) {
    warnSupabaseFallback('getProjects', error)

    return getLocalProjects()
  }
}

export async function persistProjects(projects: Project[]) {
  return replaceProjects(projects)
}

export async function getProjectById(id: string) {
  return (await getProjects()).find((project) => project.id === id) ?? null
}

export async function saveProject(project: Project) {
  const normalizedProject = normalizeProject({
    ...project,
    updatedAt: new Date().toISOString(),
  })

  if (!shouldUseSupabase()) {
    return saveLocalProject(normalizedProject)
  }

  try {
    await saveRemoteProject(normalizedProject)
    persistLocalProjects(
      upsertProjectInList(getLocalProjects(), normalizedProject),
    )

    return normalizedProject
  } catch (error) {
    warnSupabaseFallback('saveProject', error)

    return saveLocalProject(normalizedProject)
  }
}

export async function deleteProject(projectId: string) {
  if (!shouldUseSupabase()) {
    deleteLocalProject(projectId)
    return
  }

  try {
    await deleteRemoteProject(projectId)
    deleteLocalProject(projectId)
  } catch (error) {
    warnSupabaseFallback('deleteProject', error)
    deleteLocalProject(projectId)
  }
}

export async function replaceProjects(projects: Project[]) {
  const normalizedProjects = projects.map((project) => normalizeProject(project))

  if (!shouldUseSupabase()) {
    persistLocalProjects(normalizedProjects)

    return normalizedProjects
  }

  try {
    await replaceRemoteProjects(normalizedProjects)
    persistLocalProjects(normalizedProjects)

    return normalizedProjects
  } catch (error) {
    warnSupabaseFallback('replaceProjects', error)
    persistLocalProjects(normalizedProjects)

    return normalizedProjects
  }
}

export async function getPortfolioProjects() {
  return (await getProjects()).filter((project) => project.showInPortfolio)
}

export async function exportProjectsJson() {
  return JSON.stringify(await getProjects(), null, 2)
}
