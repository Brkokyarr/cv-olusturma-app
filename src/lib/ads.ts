export type AdPlacementId =
  | 'sidebar'
  | 'dashboard-top'
  | 'dashboard-mid'
  | 'dashboard-bottom'
  | 'builder-top'
  | 'builder-sidebar'
  | 'upload-top'
  | 'upload-bottom'
  | 'settings-top'
  | 'settings-bottom'

// Google AdSense hesabı onaylandığında bu değerleri doldurun:
// - ADSENSE_CLIENT_ID: yayıncı kodunuz, "ca-pub-XXXXXXXXXXXXXXXX" formatında
// - AD_SLOT_IDS: her yerleşim için AdSense panelinden oluşturduğunuz reklam
//   birimi ID'si (her yerleşim için AdSense'te ayrı bir "reklam birimi"
//   oluşturup ID'sini buraya yapıştırın — aynı ID'yi birden fazla yerleşimde
//   kullanmak da sorun değil, sadece istatistikler ayrışmaz)
// Bunlar boş bırakıldığı sürece gerçek reklam scripti hiç yüklenmez; ilgili
// yerlerde sadece tasarım için yer tutucu bir kutu gösterilir.
export const ADSENSE_CLIENT_ID = ''

export const AD_SLOT_IDS: Record<AdPlacementId, string> = {
  sidebar: '',
  'dashboard-top': '',
  'dashboard-mid': '',
  'dashboard-bottom': '',
  'builder-top': '',
  'builder-sidebar': '',
  'upload-top': '',
  'upload-bottom': '',
  'settings-top': '',
  'settings-bottom': '',
}

export function isAdsenseConfigured(): boolean {
  return ADSENSE_CLIENT_ID.trim().length > 0
}
