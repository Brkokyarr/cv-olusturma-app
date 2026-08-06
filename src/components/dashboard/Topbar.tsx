import { Menu } from 'lucide-react'

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="flex items-center gap-4 border-b border-border bg-background px-4 py-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Menüyü aç"
        className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
    </header>
  )
}
