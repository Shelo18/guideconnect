import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  guideProfile: null,
  loading: true,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) await get().loadProfile(session.user)
    set({ loading: false })

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await get().loadProfile(session.user)
      } else {
        set({ user: null, profile: null, guideProfile: null })
      }
    })
  },

  loadProfile: async (user) => {
    const { data: profile } = await supabase
      .from('profiles').select('*').eq('id', user.id).single()

    let guideProfile = null
    if (profile?.role === 'guide' || profile?.role === 'admin') {
      const { data } = await supabase
        .from('guides').select('*').eq('user_id', user.id).single()
      guideProfile = data
    }
    set({ user, profile, guideProfile })
  },

  signUp: async ({ email, password, fullName, role = 'tourist' }) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      full_name: fullName,
      role,
    })
    return data
  },

  signIn: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null, guideProfile: null })
  },
}))
