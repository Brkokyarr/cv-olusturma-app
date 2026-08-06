import { clsx } from 'clsx'
import { FileText, LayoutDashboard, Plus, Settings, Sparkles, UploadCloud, X } from 'lucide-react'
import { useState } from 'react'
import { AdSlot } from '../ads/AdSlot'

interface NavItem {
  id: string
  label: string
  icon: typeof LayoutDashboard
}

const NAV_ITEMS: NavItem[] = [
  { id: 'panel', label: 'Panel', icon: LayoutDashboard },
  { id: 'cvlerim', label: "CV'lerim", icon: FileText },
  { id: 'ayarlar', label: 'Ayarlar', icon: Settings },
]

interface SidebarProps {
  onCreateNew: () => void
  onUploadCv: () => void
  onNavigateSettings: () => void
  isMobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ onCreateNew, onUploadCv, onNavigateSettings, isMobileOpen, onMobileClose }: SidebarProps) {
  const [activeId, setActiveId] = useState('panel')

  function handleNavClick(id: string) {
    setActiveId(id)
    onMobileClose()
    if (id === 'ayarlar') {
      onNavigateSettings()
      return
    }
    if (id === 'cvlerim') {
      document.getElementById('cvlerim')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    if (id === 'panel') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-hidden="true"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={clsx(
          'z-50 flex w-64 shrink-0 flex-col border-r border-border bg-surface-raised px-4 py-6 transition-transform duration-200',
          'fixed inset-y-0 left-0 lg:static lg:flex lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-8 flex items-center justify-between gap-2 px-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold text-text-primary">CV Panel</span>
          </div>
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Menüyü kapat"
            className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              onMobileClose()
              onCreateNew()
            }}
            aria-label="Yeni CV oluştur"
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Yeni CV
          </button>
          <button
            type="button"
            onClick={() => {
              onMobileClose()
              onUploadCv()
            }}
            aria-label="Eski CV'ni yükle"
            className="flex items-center justify-center gap-2 rounded-lg border border-accent/40 px-3 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
          >
            <UploadCloud className="h-4 w-4" />
            CV Yükle
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1" aria-label="Ana menü">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = item.id === activeId
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-muted text-primary'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-4">
          <AdSlot placement="sidebar" />
        </div>

        <a
          href="/gizlilik-politikasi.html"
          target="_blank"
          rel="noreferrer"
          className="mt-4 text-center text-[11px] text-text-muted hover:text-text-secondary"
        >
          Gizlilik Politikası
        </a>
      </aside>
    </>
  )
}
