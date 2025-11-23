'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (token && userData) {
          try {
            // Verificar se o token não expirou
            const payload = JSON.parse(atob(token.split('.')[1]))
            const currentTime = Date.now() / 1000

            if (payload.exp > currentTime) {
              setIsAuthenticated(true)
              setUser(JSON.parse(userData))
            } else {
              // Token expirado
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              setIsAuthenticated(false)
              setUser(null)
            }
          } catch (tokenError) {
            // Token mal formado
            console.error('Token mal formado:', tokenError)
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setIsAuthenticated(false)
            setUser(null)
          }
        } else {
          setIsAuthenticated(false)
          setUser(null)
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        setIsAuthenticated(false)
        setUser(null)
      }
    }

    checkAuth()
  }, [])

  return { isAuthenticated, user }
}

interface Hotel {
  id: string
  name: string
  description: string
  location: {
    city: string
    state: string
  }
  pricePerNight: number
  capacity: number
  acceptsPets: boolean
  amenities: string[]
  matchScore: number
}

export default function SearchPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { isAuthenticated } = useAuthCheck()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/login')
    } else if (isAuthenticated === true) {
      fetchMatches()
    }
  }, [isAuthenticated, router])

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem('token')

      // Verificar se temos um token válido antes de fazer a chamada
      if (!token) {
        setError('Usuário não autenticado')
        setLoading(false)
        return
      }

      // Verificar se o token não expirou
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Date.now() / 1000

        if (payload.exp <= currentTime) {
          // Token expirado
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setError('Sessão expirada. Faça login novamente.')
          setLoading(false)
          return
        }
      } catch (parseError) {
        // Token mal formado
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setError('Token inválido. Faça login novamente.')
        setLoading(false)
        return
      }

      const response = await fetch('/api/matches', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setHotels(data.matches || [])
        setError('') // Limpar erro se a chamada foi bem-sucedida
      } else if (response.status === 401) {
        // Token inválido ou expirado
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setError('Sessão expirada. Faça login novamente.')
      } else {
        setError('Erro ao buscar matches')
      }
    } catch (err) {
      console.error('Erro na requisição:', err)
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleContact = (hotel: Hotel) => {
    alert(`Entrar em contato com ${hotel.name}`)
    // Aqui você pode implementar um modal ou redirecionamento para WhatsApp/telefone
  }

  // Verificar autenticação antes de renderizar qualquer coisa
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(145deg, var(--neo-bg-gradient-start), var(--neo-bg-gradient-end))' }}>
        <div className="glass-neon rounded-2xl p-8 shadow-neo text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neo-primary mx-auto"></div>
          <p className="mt-4 text-neo-secondary">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated === false) {
    return null // O redirecionamento será feito pelo useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(145deg, var(--neo-bg-gradient-start), var(--neo-bg-gradient-end))' }}>
        <div className="glass-neon rounded-2xl p-8 shadow-neo text-center
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neo-primary mx-auto"></div>
          <p className="mt-4 text-neo-secondary seus matches perfeitos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(145deg, var(--neo-bg-gradient-start), var(--neo-bg-gradient-end))' }}>
        <div className="glass-neon rounded-2xl p-8 shadow-neo text-center max-w-md mx-auto
          <p className="text-red-400 mb-6">{error}</p>
          <Button onClick={fetchMatches}>
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neo-bg to-neo-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="glass-neon rounded-2xl p-8 max-w-2xl mx-auto shadow-neo
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neo-primary to-neo-secondary bg-clip-text text-transparent mb-4">
              Seus Matches Perfeitos
            </h1>
            <p className="text-neo-secondary/80 mb-6">
              Baseado nas suas preferências, encontramos estes hotéis ideais para você
            </p>

            {/* Adicionar navegação */}
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/discover">
                <Button variant="outline">
                  🔍 Descobrir Novos Hotéis
                </Button>
              </Link>
              <Link href="/matches">
                <Button>
                  💕 Ver Meus Matches
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {hotels.length === 0 ? (
          <div className="glass-neon rounded-2xl p-8 max-w-md mx-auto shadow-neo text-center
            <p className="text-neo-secondary/80 mb-6
              Nenhum match encontrado ainda. Configure suas preferências para melhores resultados!
            </p>
            <Button onClick={() => router.push('/profile')}>
              Configurar Preferências
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="glass-neon rounded-2xl overflow-hidden shadow-neo hover:shadow-neo-lg transition-neo hover:scale-[1.02]
                <div className="bg-gradient-to-br from-neo-surface to-white h-48 flex items-center justify-center border-b border-white/20
                  <span className="text-neo-secondary/60 text-sm Imagem do Hotel</span>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-neo-primary">{hotel.name}</h3>
                    <span className="glass-neon px-3 py-1 rounded-full text-xs font-medium text-green-600
                      {hotel.matchScore}% match
                    </span>
                  </div>

                  <p className="text-neo-secondary/70 text-sm mb-3
                    📍 {hotel.location.city}, {hotel.location.state}
                  </p>

                  <p className="text-sm text-neo-secondary/80 mb-4 leading-relaxed
                    {hotel.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="glass-neon px-3 py-1 rounded-full text-xs text-neo-primary
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xl font-bold text-green-600">
                        R$ {hotel.pricePerNight}
                      </span>
                      <span className="text-sm text-neo-secondary/60 / noite</span>
                    </div>
                    <Button onClick={() => handleContact(hotel)} size="sm">
                      Contatar
                    </Button>
                  </div>

                  <div className="text-xs text-neo-secondary/60
                    {hotel.acceptsPets && '🐕 Aceita pets • '}
                    Até {hotel.capacity} pessoas
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
