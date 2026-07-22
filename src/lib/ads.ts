export type AdPlacementId = 'dashboard' | 'builder' | 'upload' | 'settings'

// Google AdSense hesabı onaylandığında bu değerleri doldurun:
// - ADSENSE_CLIENT_ID: yayıncı kodunuz, "ca-pub-XXXXXXXXXXXXXXXX" formatında
// - AD_SLOT_IDS: her yerleşim için AdSense panelinden oluşturduğunuz reklam
//   birimi ID'si
// Bunlar boş bırakıldığı sürece gerçek reklam scripti hiç yüklenmez; ilgili
// yerlerde sadece tasarım için yer tutucu bir kutu gösterilir.
export const ADSENSE_CLIENT_ID = ''

export const AD_SLOT_IDS: Record<AdPlacementId, string> = {
  dashboard: '',
  builder: '',
  upload: '',
  settings: '',
}

export function isAdsenseConfigured(): boolean {
  return ADSENSE_CLIENT_ID.trim().length > 0
}
