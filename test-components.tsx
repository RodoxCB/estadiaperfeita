'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function TestComponents() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neo-bg to-neo-surface p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-neo-primary mb-8">Teste de Componentes Neomorphism</h1>

        {/* Teste Buttons */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-neo-secondary">Buttons</h2>
          <div className="space-y-2">
            <div className="flex gap-4 flex-wrap">
              <Button variant="neo" size="sm">Neo Small</Button>
              <Button variant="neo" size="default">Neo Default</Button>
              <Button variant="neo" size="lg">Neo Large</Button>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Button variant="glass" size="sm">Glass Small</Button>
              <Button variant="glass" size="default">Glass Default</Button>
              <Button variant="glass" size="lg">Glass Large</Button>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Button variant="default" size="default">Old Default</Button>
              <Button variant="outline" size="default">Old Outline</Button>
              <Button variant="ghost" size="default">Old Ghost</Button>
            </div>
          </div>
        </div>

        {/* Teste Inputs */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-neo-secondary">Inputs</h2>
          <div className="space-y-4 max-w-md">
            <Input placeholder="Teste de input neomorphism" />
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Senha" />
            <Input disabled placeholder="Input desabilitado" />
          </div>
        </div>

        {/* Teste Glassmorphism */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-neo-secondary">Glassmorphism</h2>
          <div className="glass rounded-2xl p-6 shadow-neo">
            <p className="text-neo-secondary">Este é um container com efeito glassmorphism</p>
          </div>
          <div className="glass-strong rounded-2xl p-6 shadow-neo">
            <p className="text-neo-secondary">Este é um container com glassmorphism forte</p>
          </div>
        </div>

        {/* Teste Sombras */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-neo-secondary">Sombras Neomorphism</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-neo-surface to-white p-6 rounded-xl shadow-neo">
              <p className="text-neo-secondary">Shadow Neo</p>
            </div>
            <div className="bg-gradient-to-br from-neo-surface to-white p-6 rounded-xl shadow-neo-sm">
              <p className="text-neo-secondary">Shadow Neo Small</p>
            </div>
            <div className="bg-gradient-to-br from-neo-surface to-white p-6 rounded-xl shadow-neo-lg">
              <p className="text-neo-secondary">Shadow Neo Large</p>
            </div>
            <div className="bg-gradient-to-br from-neo-surface to-white p-6 rounded-xl shadow-neo-inset">
              <p className="text-neo-secondary">Shadow Neo Inset</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
