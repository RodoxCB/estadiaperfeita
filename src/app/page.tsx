import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neo-bg via-neo-surface to-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-neo-primary/20 rounded-full blur-xl dark:bg-neo-primary/10"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-neo-secondary/15 rounded-full blur-2xl dark:bg-neo-secondary/5"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center">
          <div className="glass-strong rounded-3xl p-8 mb-8 max-w-4xl mx-auto dark:shadow-glass-dark">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-neo-primary to-neo-secondary bg-clip-text text-transparent mb-6">
              Estadia Perfeita
            </h1>
            <p className="text-xl text-neo-secondary/80 mb-8 max-w-2xl mx-auto leading-relaxed dark:text-neo-secondary/70">
              Descubra o hotel ideal para sua viagem. Conte-nos suas preferências
              e encontraremos o match perfeito entre você e seu próximo destino.
            </p>
            <div className="space-x-6">
              <Link href="/register">
                <Button variant="neo" size="lg">Começar Agora</Button>
              </Link>
              <Link href="/login">
                <Button variant="glass" size="lg">Entrar</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="glass rounded-2xl p-8 shadow-neo hover:shadow-neo-lg transition-neo dark:shadow-glass-dark">
            <div className="text-4xl mb-6">🏖️</div>
            <h3 className="text-xl font-semibold mb-4 text-neo-primary">Preferências Personalizadas</h3>
            <p className="text-neo-secondary/80 leading-relaxed dark:text-neo-secondary/70">
              Conte-nos sobre você: quantas pessoas, tipo de lazer preferido,
              se tem pets, orçamento e muito mais.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 shadow-neo hover:shadow-neo-lg transition-neo dark:shadow-glass-dark">
            <div className="text-4xl mb-6">❤️</div>
            <h3 className="text-xl font-semibold mb-4 text-neo-primary">Sistema de Match</h3>
            <p className="text-neo-secondary/80 leading-relaxed dark:text-neo-secondary/70">
              Nosso algoritmo encontra as melhores opções baseado nas suas
              preferências e perfil de viagem.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 shadow-neo hover:shadow-neo-lg transition-neo dark:shadow-glass-dark">
            <div className="text-4xl mb-6">💬</div>
            <h3 className="text-xl font-semibold mb-4 text-neo-primary">Contato Direto</h3>
            <p className="text-neo-secondary/80 leading-relaxed dark:text-neo-secondary/70">
              Entre em contato direto com os proprietários e negocie
              o melhor preço para sua estadia.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
