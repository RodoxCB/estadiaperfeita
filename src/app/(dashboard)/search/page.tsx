'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/matches', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setHotels(data.matches)
      } else {
        setError('Erro ao buscar matches')
      }
    } catch (err) {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleContact = (hotel: Hotel) => {
    alert(`Entrar em contato com ${hotel.name}`)
    // Aqui você pode implementar um modal ou redirecionamento para WhatsApp/telefone
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neo-bg to-neo-surface dark:to-gray-900">
        <div className="glass rounded-2xl p-8 shadow-neo text-center dark:shadow-glass-dark">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neo-primary mx-auto"></div>
          <p className="mt-4 text-neo-secondary dark:text-neo-secondary/70">Buscando seus matches perfeitos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neo-bg to-neo-surface dark:to-gray-900">
        <div className="glass rounded-2xl p-8 shadow-neo text-center max-w-md mx-auto dark:shadow-glass-dark">
          <p className="text-red-400 mb-6">{error}</p>
          <Button onClick={fetchMatches}>
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neo-bg to-neo-surface dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto shadow-neo dark:shadow-glass-dark">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neo-primary to-neo-secondary bg-clip-text text-transparent mb-4">
              Seus Matches Perfeitos
            </h1>
            <p className="text-neo-secondary/80 dark:text-neo-secondary/70">
              Baseado nas suas preferências, encontramos estes hotéis ideais para você
            </p>
          </div>
        </div>

        {hotels.length === 0 ? (
          <div className="glass rounded-2xl p-8 max-w-md mx-auto shadow-neo text-center dark:shadow-glass-dark">
            <p className="text-neo-secondary/80 mb-6 dark:text-neo-secondary/70">
              Nenhum match encontrado ainda. Configure suas preferências para melhores resultados!
            </p>
            <Button onClick={() => router.push('/profile')}>
              Configurar Preferências
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="glass rounded-2xl overflow-hidden shadow-neo hover:shadow-neo-lg transition-neo hover:scale-[1.02] dark:shadow-glass-dark">
                <div className="bg-gradient-to-br from-neo-surface to-white h-48 flex items-center justify-center border-b border-white/20 dark:from-neo-surface dark:to-gray-700 dark:border-gray-600">
                  <span className="text-neo-secondary/60 text-sm dark:text-neo-secondary/50">🏨 Imagem do Hotel</span>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-neo-primary">{hotel.name}</h3>
                    <span className="glass px-3 py-1 rounded-full text-xs font-medium text-green-600 dark:shadow-glass-dark">
                      {hotel.matchScore}% match
                    </span>
                  </div>

                  <p className="text-neo-secondary/70 text-sm mb-3 dark:text-neo-secondary/60">
                    📍 {hotel.location.city}, {hotel.location.state}
                  </p>

                  <p className="text-sm text-neo-secondary/80 mb-4 leading-relaxed dark:text-neo-secondary/70">
                    {hotel.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="glass px-3 py-1 rounded-full text-xs text-neo-primary dark:shadow-glass-dark">
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xl font-bold text-green-600">
                        R$ {hotel.pricePerNight}
                      </span>
                      <span className="text-sm text-neo-secondary/60 dark:text-neo-secondary/50"> / noite</span>
                    </div>
                    <Button onClick={() => handleContact(hotel)} size="sm">
                      Contatar
                    </Button>
                  </div>

                  <div className="text-xs text-neo-secondary/60 dark:text-neo-secondary/50">
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
