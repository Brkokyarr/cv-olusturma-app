import { useEffect, useRef } from 'react'
import { AD_SLOT_IDS, ADSENSE_CLIENT_ID, isAdsenseConfigured, type AdPlacementId } from '../../lib/ads'

// AdSense'in ana scripti index.html'in <head>'ine (site doğrulaması için)
// zaten ekli — burada sadece her reklam kutusu için `adsbygoogle.push({})`
// tetiklenip o kutunun doldurulması isteniyor.
declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

interface AdSlotProps {
  placement: AdPlacementId
}

export function AdSlot({ placement }: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null)
  const configured = isAdsenseConfigured()
  const slotId = AD_SLOT_IDS[placement]

  useEffect(() => {
    if (!configured || !slotId) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch {
      // AdSense scripti henüz yüklenmemişse sessizce yok say.
    }
  }, [configured, slotId])

  if (!configured || !slotId) {
    return (
      <div className="flex min-h-[90px] w-full items-center justify-center rounded-lg border border-dashed border-border-subtle bg-surface/50 text-xs text-text-muted">
        Reklam alanı
      </div>
    )
  }

  return (
    <ins
      ref={insRef}
      className="adsbygoogle block w-full"
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
