'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/login')
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neo-bg to-neo-surface relative overflow-hidden">
      {/* Elementos decorativos neon */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neo-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-neo-secondary/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-neo-accent/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="glass-neon-strong rounded-3xl p-8 shadow-glass-neon-strong">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold bg-gradient-to-r from-neo-primary via-neo-secondary to-neo-accent bg-clip-text text-transparent drop-shadow-lg">
              Criar sua conta
            </h2>
            <p className="mt-2 text-center text-sm text-neo-text-secondary">
              Já tem uma conta?{' '}
              <Link
                href="/login"
                className="font-medium text-neo-primary hover:text-neo-secondary transition-neo"
              >
                Faça login
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Senha (mínimo 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="glass-neon rounded-lg p-3 text-center shadow-glass-neon">
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
