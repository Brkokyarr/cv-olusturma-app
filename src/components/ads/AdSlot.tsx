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
    // Reklam birimi henüz tanımlanmamışsa hiçbir şey göstermiyoruz — boş
    // "Reklam alanı" kutuları sitenin "yapım aşamasında" görünmesine yol
    // açıyordu, bu da AdSense inceleme politikalarını ihlal ediyordu.
    return null
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
