import { supabase } from './supabase'

export async function isAdminSessionActive() {
  if (!supabase) {
    return false
  }

  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.warn('Nao foi possivel verificar a sessao do Supabase.', error)

    return false
  }

  return Boolean(data.session)
}

export async function clearAdminSession() {
  if (!supabase) {
    return
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}
