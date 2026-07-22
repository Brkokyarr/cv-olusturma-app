# CV Oluşturma Uygulaması — Proje Kuralları

## Teknoloji Yığını
- React 18 + TypeScript, Vite ile build
- Stil: **sadece Tailwind CSS utility class'ları** — inline `style` attribute'u YASAK
- İkonlar: `lucide-react`
- Koşullu class birleştirme için `clsx` kullan, template string ile class birleştirme yapma
- Global state/backend yok — veri `localStorage` üzerinden yönetilir, hiçbir API çağrısı/anahtar gerekmez
- Kullanıcı hesabı/üyelik sistemi (giriş, kayıt, cihazlar arası senkron) **bilinçli olarak yok** — sorulduğunda kullanıcı "şimdilik gerek yok" dedi. Her ziyaretçi kendi tarayıcısında kendi CV'lerini oluşturup indirir. Bu tercih değişmeden önce kullanıcıyla tekrar konuşulmalı, sessizce bir auth/backend sistemi (örn. Supabase) eklenmemeli
- "Eski CV yükle" özelliği tamamen client-side çalışır: dosya tarayıcıda okunur (PDF → `pdfjs-dist`, DOCX → `mammoth`), bilgiler `src/lib/cvTextParser.ts` içindeki kural tabanlı (regex/anahtar kelime) çıkarımla dolduruluyor. Daha önce bunun için Anthropic API'ye bağlı bir backend denendi ama kullanım başına maliyet ve kredi gerektirdiği için (bkz. proje geçmişi) kaldırıldı — bilinçli bir tercih, geri getirilmeden önce kullanıcıyla konuşulmalı
- PDF metin çıkarımı `pdfjs-dist`'in `standardFontDataUrl` ayarına ihtiyaç duyar — bu dosyalar `public/pdfjs/standard_fonts/` altında (kaynak: `node_modules/pdfjs-dist/standard_fonts`, pdfjs-dist güncellenirse yeniden kopyalanmalı)
- Bazı PDF'ler (özellikle Canva vb. tasarım araçlarından çıkan, metni vektöre/anahat'a çeviren şablonlar) hiç gerçek metin katmanı içermez. Bu durumda `src/lib/ocr.ts` devreye girer: PDF sayfası canvas'a render edilip `tesseract.js` ile tarayıcı içi OCR yapılır (dil: `tur`). Bu tamamen ücretsizdir ama tesseract.js varsayılan olarak dil/motor dosyalarını kendi CDN'inden indirir (kullanıcının CV içeriği hiçbir yere gitmez, sadece jenerik OCR motoru dosyaları çekilir) — self-host edilmedi, bilinçli bir sadelik tercihi
- Uygulama tamamen ücretsiz; gelir modeli Google AdSense reklamlarıdır. Reklam yapılandırması `src/lib/ads.ts` içinde (`ADSENSE_CLIENT_ID`, `AD_SLOT_IDS`) — hesap onaylanana kadar bilinçli olarak boş bırakıldı, bu yüzden `AdSlot` (`src/components/ads/AdSlot.tsx`) gerçek reklam yerine kesikli çizgili bir yer tutucu gösteriyor. Gerçek yayıncı/reklam birimi kodları elde edilince sadece bu dosya doldurulmalı, başka bir yer değişmeye gerek yok. Dört ana ekranın (panel, sihirbaz, yükleme, ayarlar) her birinde bir `<AdSlot placement="..." />` var

## Kod Kuralları
- Bileşenler fonksiyon component + named export olarak yazılır (`export function X()`), default export kullanma
- Her bileşen kendi dosyasında, `PascalCase.tsx`
- Prop tipleri `interface XProps` olarak component dosyasının üstünde tanımlanır
- Tekrar eden layout parçaları (Sidebar, Topbar, Card vb.) `src/components/dashboard/` altında, genel amaçlı UI parçaları `src/components/ui/` altında, CV oluşturma sihirbazı `src/components/cv-builder/` altında (şablonlar `templates/`, form adımları `steps/`), eski CV yükleme akışı `src/components/upload/` altında tutulur
- Tailwind class'ları rastgele hex/px değer içermez (`bg-[#123456]` gibi arbitrary value'lardan kaçın) — aşağıdaki semantic renk token'ları kullanılır
- Erişilebilirlik: interaktif elemanlarda `aria-label`, görsellerde `alt` zorunlu

## Renk Paleti (Dark Mode — `tailwind.config.ts`)

| Token | Hex | Kullanım |
|---|---|---|
| `background` | `#0B0F19` | Sayfa arka planı |
| `surface` | `#131826` | Kart/panel arka planı |
| `surface-hover` | `#1B2233` | Hover durumundaki yüzeyler |
| `surface-raised` | `#1A2035` | Sidebar, modal gibi öne çıkan yüzeyler |
| `border` | `#232B3D` | Standart kenarlık |
| `border-subtle` | `#1B2233` | Zayıf kontrastlı ayraçlar |
| `primary` | `#6366F1` | Ana marka rengi, birincil buton/aktif durum |
| `primary-hover` | `#4F46E5` | Primary hover/active |
| `primary-muted` | `#312E81` | Primary'nin soluk/arka plan versiyonu (badge vb.) |
| `accent` | `#A855F7` | Öne çıkan özellik vurguları (örn. "Eski CV Yükle") |
| `success` | `#22C55E` | Başarı durumu |
| `warning` | `#F59E0B` | Uyarı durumu |
| `danger` | `#EF4444` | Hata/silme durumu |
| `text-primary` | `#F3F4F6` | Ana metin |
| `text-secondary` | `#9CA3AF` | İkincil metin |
| `text-muted` | `#6B7280` | Pasif/placeholder metin |
| `paper` | `#FFFFFF` | CV önizlemesinin yazdırılabilir "kağıt" arka planı (dark UI'nin istisnası — çıktı A4 beyaz kağıda basılacağı için) |
| `ink` | `#111827` | `paper` üzerindeki ana metin |
| `ink-secondary` | `#4B5563` | `paper` üzerindeki ikincil metin |
| `ink-muted` | `#9CA3AF` | `paper` üzerindeki pasif metin |

Kullanım örneği: `bg-surface border border-border text-text-primary hover:bg-surface-hover`

`paper`/`ink` token'ları SADECE CV önizleme bileşeni (`CvPreview`) içinde kullanılır — uygulamanın geri kalanı dark tema token'larına sadık kalır.

## Proje Bağlamı
Bu proje, `cv-olusturma-uygulamasi-proje-dokumani.md` dosyasındaki plana göre geliştirilen ücretsiz CV oluşturma uygulamasıdır. Dashboard, kullanıcının siteye girdiğinde CV'lerini yönettiği, yeni CV oluşturma/eski CV yükleme akışlarına yönlendiği ana ekrandır.
