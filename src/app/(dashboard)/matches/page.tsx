'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface Match {
  id: number
  hotel: {
    name: string
    description: string
    location: {
      city: string
      state: string
    }
    contact_info: {
      phone: string
      email: string
      whatsapp?: string
    }
    images: string[]
    price_per_night: number
  }
  score: number
  created_at: string
}

function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token')

        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            const currentTime = Date.now() / 1000

            if (payload.exp > currentTime) {
              setIsAuthenticated(true)
            } else {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              setIsAuthenticated(false)
            }
          } catch (tokenError) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setIsAuthenticated(false)
          }
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  return { isAuthenticated }
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
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
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')
      if (!token) {
        setError('Usuário não autenticado')
        return
      }

      const response = await fetch('/api/matches/active', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMatches(data.matches || [])
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
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

  const handleContact = (match: Match) => {
    const contact = match.hotel.contact_info
    const message = `Olá! Encontrei seu hotel "${match.hotel.name}" através do Estadia Perfeita e gostaria de saber mais sobre disponibilidade e preços.`

    if (contact.whatsapp) {
      const whatsappUrl = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    } else if (contact.phone) {
      window.location.href = `tel:${contact.phone}`
    }
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(145deg, var(--neo-bg-gradient-start), var(--neo-bg-gradient-end))' }}>
        <div className="glass-neon rounded-2xl p-8 shadow-neo text-center
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neo-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 autenticação...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated === false) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(145deg, var(--neo-bg-gradient-start), var(--neo-bg-gradient-end))' }}>
        <div className="glass-neon rounded-2xl p-8 shadow-neo text-center
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neo-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 seus matches...</p>
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="glass-neon rounded-2xl p-8 max-w-2xl mx-auto shadow-neo
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              Seus Matches! 🎉
            </h1>
            <p className="text-gray-600
              Estes são os hotéis que deram match com você. Entre em contato e faça sua reserva!
            </p>
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="glass-neon rounded-2xl p-8 max-w-md mx-auto shadow-neo text-center
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl font-bold mb-4">Você ainda não tem matches</h3>
            <p className="text-gray-600 mb-6
              Continue dando likes na página de descoberta para encontrar seus matches perfeitos!
            </p>
            <Button onClick={() => router.push('/discover')}>
              Ir para Descoberta
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matches.map((match) => (
              <div key={match.id} className="glass-neon rounded-2xl overflow-hidden shadow-neo hover:shadow-neo-lg transition-neo hover:scale-[1.02]
                <div className="bg-gradient-to-br from-neo-surface to-white h-48 flex items-center justify-center border-b border-white/20
                  {match.hotel.images && match.hotel.images.length > 0 ? (
                    <img
                      src={match.hotel.images[0]}
                      alt={match.hotel.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback para Lorem Picsum se a imagem do Unsplash falhar
                        const target = e.currentTarget as HTMLImageElement;
                        if (!target.src.includes('picsum.photos')) {
                          target.src = `https://picsum.photos/800/600?random=${match.hotel.id || Math.random()}`;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-4xl">🏨</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-blue-600
                    <span className="glass-neon px-3 py-1 rounded-full text-xs font-medium text-green-600
                      {match.score}% match
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3
                    📍 {match.hotel.location.city}, {match.hotel.location.state}
                  </p>

                  <p className="text-sm text-gray-700 mb-4 leading-relaxed
                    {match.hotel.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xl font-bold text-green-600">
                        R$ {match.hotel.price_per_night}
                      </span>
                      <span className="text-sm text-gray-500 / noite</span>
                    </div>
                  </div>

                  <Button onClick={() => handleContact(match)} className="w-full">
                    {match.hotel.contact_info.whatsapp ? '💬 WhatsApp' : '📞 Entrar em Contato'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
