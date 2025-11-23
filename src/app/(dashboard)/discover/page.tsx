'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface HotelCard {
  id: string
  name: string
  description: string
  location: {
    city: string
    state: string
  }
  pricePerNight: number
  images: string[]
  matchScore: number
  amenities: string[]
  capacity: number
  acceptsPets: boolean
}

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
            const payload = JSON.parse(atob(token.split('.')[1]))
            const currentTime = Date.now() / 1000

            if (payload.exp > currentTime) {
              setIsAuthenticated(true)
              setUser(JSON.parse(userData))
            } else {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              setIsAuthenticated(false)
              setUser(null)
            }
          } catch (tokenError) {
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
        setIsAuthenticated(false)
        setUser(null)
      }
    }

    checkAuth()
  }, [])

  return { isAuthenticated, user }
}

export default function DiscoverPage() {
  const [currentHotel, setCurrentHotel] = useState<HotelCard | null>(null)
  const [hotelStack, setHotelStack] = useState<HotelCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [animating, setAnimating] = useState(false)
  const { isAuthenticated } = useAuthCheck()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/login')
    } else if (isAuthenticated === true) {
      fetchNextHotels()
    }
  }, [isAuthenticated, router])

  const fetchNextHotels = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')
      if (!token) {
        setError('Usuário não autenticado')
        return
      }

      const response = await fetch('/api/discover', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setHotelStack(data.hotels || [])
        setCurrentHotel((data.hotels || [])[0] || null)
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
      } else {
        setError('Erro ao buscar hotéis')
      }
    } catch (err) {
      console.error('Erro na requisição:', err)
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!currentHotel || animating) return

    setAnimating(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/matches/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ hotelId: currentHotel.id })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.match) {
          alert('🎉 Match encontrado! Você deu match com ' + currentHotel.name)
        }
      }

      // Próximo hotel com animação
      setTimeout(() => {
        const newStack = hotelStack.slice(1)
        setHotelStack(newStack)
        setCurrentHotel(newStack[0] || null)
        setAnimating(false)
      }, 300)

    } catch (error) {
      console.error('Erro ao dar like:', error)
      setAnimating(false)
    }
  }

  const handleDislike = async () => {
    if (!currentHotel || animating) return

    setAnimating(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      await fetch('/api/matches/dislike', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ hotelId: currentHotel.id })
      })

      // Próximo hotel com animação
      setTimeout(() => {
        const newStack = hotelStack.slice(1)
        setHotelStack(newStack)
        setCurrentHotel(newStack[0] || null)
        setAnimating(false)
      }, 300)

    } catch (error) {
      console.error('Erro ao dar dislike:', error)
      setAnimating(false)
    }
  }

  // Verificar autenticação
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(145deg, var(--neo-bg-gradient-start), var(--neo-bg-gradient-end))' }}>
        <div className="glass-neon rounded-2xl p-8 shadow-neo text-center
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neo-primary mx-auto"></div>
          <p className="mt-4 text-neo-text-secondary">Verificando sua conta...</p>
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
          <p className="mt-4 text-neo-text-secondary">Carregando hotéis personalizados para você...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(145deg, var(--neo-bg-gradient-start), var(--neo-bg-gradient-end))' }}>
        <div className="glass-neon rounded-2xl p-8 shadow-neo text-center max-w-md mx-auto
          <p className="text-red-400 mb-6">{error}</p>
          <Button onClick={fetchNextHotels}>
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="glass-neon rounded-2xl p-6 max-w-md mx-auto shadow-neo
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neo-primary to-neo-secondary bg-clip-text text-transparent mb-2">
              🎯 Encontre Seu Match Perfeito
            </h1>
            <p className="text-neo-text-secondary text-sm">
              Avalie os hotéis que aparecem - quanto mais likes você der,
              melhor entendemos suas preferências!
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          {currentHotel ? (
            <div className={`glass-neon rounded-3xl overflow-hidden max-w-sm w-full shadow-neo transition-all duration-300 hover:scale-[1.02] ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="relative">
                <div className="bg-gradient-to-br from-neo-surface to-white h-64 flex items-center justify-center border-b border-white/20
                  {currentHotel.images && currentHotel.images.length > 0 ? (
                    <img
                      src={currentHotel.images[0]}
                      alt={currentHotel.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback para Lorem Picsum se a imagem do Unsplash falhar
                        const target = e.currentTarget as HTMLImageElement;
                        if (!target.src.includes('picsum.photos')) {
                          target.src = `https://picsum.photos/800/600?random=${currentHotel.id || Math.random()}`;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-4xl">🏨</span>
                    </div>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <span className="glass-neon px-3 py-1 rounded-full text-xs font-medium text-green-600
                    {currentHotel.matchScore}% match
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-neo-primary mb-1">{currentHotel.name}</h3>
                  <p className="text-neo-text-secondary text-sm mb-2">
                    📍 {currentHotel.location.city}, {currentHotel.location.state}
                  </p>
                  <p className="text-sm text-neo-text-secondary leading-relaxed overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.4em',
                    maxHeight: '4.2em'
                  }}>
                    {currentHotel.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {currentHotel.amenities.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="glass-neon px-3 py-1 rounded-full text-xs text-neo-primary
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-2xl font-bold text-green-600">
                      R$ {currentHotel.pricePerNight}
                    </span>
                    <span className="text-sm text-neo-text-muted">/ noite</span>
                  </div>
                  <div className="text-xs text-neo-text-muted">
                    {currentHotel.acceptsPets && '🐕 Aceita pets • '}
                    Até {currentHotel.capacity} pessoas
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleDislike}
                    variant="outline"
                    className="flex-1 h-12 text-lg hover:bg-red-50 hover:border-red-200
                    disabled={animating}
                  >
                    ⏭️ Pular
                  </Button>
                  <Button
                    onClick={handleLike}
                    className="flex-1 h-12 text-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                    disabled={animating}
                  >
                    💚 Quero conhecer!
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-neon rounded-2xl p-8 shadow-neo text-center max-w-md
              <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-4">🎉 Você é um explorador incansável!</h3>
            <p className="text-neo-text-secondary mb-6">
              Avaliou todos os hotéis disponíveis no momento. Que tal configurar
              mais preferências para descobrirmos opções ainda mais personalizadas?
            </p>
              <Button onClick={fetchNextHotels} className="w-full">
                Buscar mais hotéis
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
