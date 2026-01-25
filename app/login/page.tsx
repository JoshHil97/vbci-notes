'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '../../lib/supabase-client'

export default function LoginPage() {
  const router = useRouter()
  const sp = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const next = sp.get('next') || '/notes'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const supabase = supabaseBrowser()
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setStatus(error.message)
        return
      }

      setStatus('Signed in')
      router.push(next)
      router.refresh()
    } catch (err: any) {
      setStatus(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 520, margin: '40px auto', padding: 16 }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Sign in</h1>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            style={{ padding: 10 }}
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            style={{ padding: 10 }}
          />
        </label>

        <button type="submit" disabled={loading} style={{ padding: 12 }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        {status ? <p style={{ marginTop: 8 }}>{status}</p> : null}
      </form>
    </main>
  )
}
