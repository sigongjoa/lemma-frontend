const TOKEN_KEY = 'lemma_token'
const USER_KEY = 'lemma_user'

export interface AuthUser {
  id: string
  name: string
  role: 'admin' | 'student'
}

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getAuth(): { token: string; user: AuthUser } | null {
  const token = localStorage.getItem(TOKEN_KEY)
  const raw = localStorage.getItem(USER_KEY)
  if (!token || !raw) return null
  try {
    return { token, user: JSON.parse(raw) as AuthUser }
  } catch {
    return null
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split('.')
    const decoded = JSON.parse(atob(payload)) as { exp: number }
    return decoded.exp * 1000 < Date.now()
  } catch {
    return true
  }
}
