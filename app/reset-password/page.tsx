'use client'

import { useState } from 'react'
import { supabaseClient } from '../../lib/supabase-client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')

  async function submit(e) {
    e.preventDefault()

    const { error } = await supabaseClient.auth.updateUser({ password })
    setStatus(error ? error.message : 'Password updated')
  }

  return (
    <form onSubmit={submit}>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Update password</button>
      <p>{status}</p>
    </form>
  )
}
