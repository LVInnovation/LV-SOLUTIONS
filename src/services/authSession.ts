export const ADMIN_SESSION_KEY = 'lvsolutions_admin_session'

export function isAdminSessionActive() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'active'
}

export function startAdminSession() {
  // Login fixo e localStorage são apenas para protótipo. Para produção, migrar para Supabase Auth e banco com criptografia.
  // TODO: substituir login fixo por Supabase Auth antes de usar em produção.
  sessionStorage.setItem(ADMIN_SESSION_KEY, 'active')
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY)
}
