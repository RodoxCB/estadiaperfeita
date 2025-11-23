import { Navigation } from '@/app/components/layout/Navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, var(--neo-bg-gradient-start), var(--neo-bg-gradient-end))' }}>
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      <Navigation />
    </div>
  )
}
