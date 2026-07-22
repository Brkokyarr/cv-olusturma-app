import { Menu } from 'lucide-react'

export function Topbar() {
  return (
    <header className="flex items-center gap-4 border-b border-border bg-background px-4 py-4 sm:px-6 lg:px-8">
      <button
        type="button"
        aria-label="Menüyü aç"
        className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-muted text-sm font-semibold text-primary">
            BO
          </div>
          <span className="hidden text-sm font-medium text-text-primary sm:inline">
            Burak Okyar
          </span>
        </div>
      </div>
    </header>
  )
}
