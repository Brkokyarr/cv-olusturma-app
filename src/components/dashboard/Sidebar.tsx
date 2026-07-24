import { clsx } from 'clsx'
import { FileText, LayoutDashboard, Plus, Settings, Sparkles, UploadCloud } from 'lucide-react'
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
}

export function Sidebar({ onCreateNew, onUploadCv, onNavigateSettings }: SidebarProps) {
  const [activeId, setActiveId] = useState('panel')

  function handleNavClick(id: string) {
    setActiveId(id)
    if (id === 'ayarlar') onNavigateSettings()
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface-raised px-4 py-6 lg:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-text-primary">
          <Sparkles className="h-5 w-5" />
        </span>
        <span className="text-lg font-semibold text-text-primary">CV Panel</span>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onCreateNew}
          aria-label="Yeni CV oluştur"
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" />
          Yeni CV
        </button>
        <button
          type="button"
          onClick={onUploadCv}
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
  )
}
