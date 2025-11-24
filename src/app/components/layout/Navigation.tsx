'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const navItems = [
    { href: '/search', label: 'Buscar', icon: '🔍' },
    { href: '/discover', label: 'Descobrir', icon: '💕' },
    { href: '/matches', label: 'Matches', icon: '🎉' },
    { href: '/profile', label: 'Perfil', icon: '👤' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-neon border-t border-neo-primary/20 md:relative md:bottom-auto md:border-t-0 md:border-b md:bg-transparent md:backdrop-blur-none">
      <div className="container mx-auto px-4">
        <div className="flex justify-around md:justify-start md:space-x-8 py-3 md:py-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                pathname === item.href
                  ? 'bg-neo-primary/20 text-neo-primary border border-neo-primary/30'
                  : 'text-neo-text-secondary hover:text-neo-primary hover:bg-neo-surface/50'
              }`}>
                <span className="text-lg md:text-xl">{item.icon}</span>
                <span className="text-xs md:text-sm font-medium mt-1">{item.label}</span>
              </div>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="flex flex-col items-center p-2 rounded-xl text-neo-text-secondary hover:text-red-400 transition-all"
          >
            <span className="text-lg md:text-xl">🚪</span>
            <span className="text-xs md:text-sm font-medium mt-1">Sair</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
