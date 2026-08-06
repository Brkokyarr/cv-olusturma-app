import type { ReactNode } from 'react'
import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface DashboardLayoutProps {
  children: ReactNode
  onCreateNew: () => void
  onUploadCv: () => void
  onNavigateSettings: () => void
}

export function DashboardLayout({
  children,
  onCreateNew,
  onUploadCv,
  onNavigateSettings,
}: DashboardLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        onCreateNew={onCreateNew}
        onUploadCv={onUploadCv}
        onNavigateSettings={onNavigateSettings}
        isMobileOpen={isMobileNavOpen}
        onMobileClose={() => setIsMobileNavOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
