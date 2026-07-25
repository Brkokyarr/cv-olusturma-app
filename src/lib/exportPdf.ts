import html2pdf from 'html2pdf.js'

// A4 kağıdının 96dpi'daki gerçek piksel genişliği. Önizleme farklı
// genişliklerde (kenar çubuğu, ekran dışı sarmalayıcı vb.) render
// edilebiliyor; punto boyutları (Tailwind'in text-* sınıfları) sabit
// olduğu için dar bir genişlikte yakalanan içerik gerçek A4 oranına göre
// daha uzun görünüp gereksiz ikinci bir sayfaya taşabilir. Bu yüzden CV
// dışa aktarılırken her zaman bu sabit genişlikte render edilmiş bir
// kopyası kullanılır.
export const PDF_EXPORT_WIDTH_PX = 794

const HTML2CANVAS_SCALE = 2
const PX_PER_MM = 96 / 25.4

// iOS'ta (Safari dahil tüm tarayıcılar WebKit kullanır) blob URL'ler için
// <a download> özniteliği güvenilir çalışmıyor — dosya inmek yerine tuhaf
// bir "resim" önizlemesi açılabiliyor ve kullanıcı ne Fotoğraflar'a ne
// Dosyalar'a kaydedebiliyor. Bu yüzden iOS'ta farklı bir yol izliyoruz
// (bkz. exportElementToPdf).
export function isIosDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export async function exportElementToPdf(
  element: HTMLElement,
  filename: string,
  preOpenedWindow?: Window | null,
) {
  function stripPaperChrome(clonedDoc: Document) {
    const node = clonedDoc.getElementById(element.id)
    if (node) {
      node.style.overflow = 'visible'
      // Kağıt gölgesi ve köşe yuvarlaması ekranda güzel durur ama basılı
      // sayfada anlamsızdır.
      node.style.boxShadow = 'none'
      node.style.borderRadius = '0'
    }
  }

  // 1. Adım: içeriği standart A4 genişliğinde (210mm) yakala. Sayfa
  // yüksekliğini burada henüz sabitlemiyoruz (varsayılan 'a4' kullanılıyor,
  // sadece genişlik önemli) — html2pdf içeriği bu genişlikte bir kaba
  // klonlayıp öyle render ediyor.
  const worker = html2pdf()
    .set({
      margin: 0,
      filename: `${filename}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: HTML2CANVAS_SCALE,
        useCORS: true,
        onclone: stripPaperChrome,
      },
      jsPDF: { unit: 'mm', format: 'a4' },
    })
    .from(element)
    .toCanvas()

  const canvas: HTMLCanvasElement = await worker.get('canvas')

  // 2. Adım: sayfa boyutunu, az önce YAKALANAN canvas'ın gerçek piksel
  // ölçüsüne göre yeniden ayarla. Böylece "bir sayfa" tam olarak canvas'ın
  // tamamına eşit olur — html2pdf'in sayfalama hesabı (canvas yüksekliği /
  // sayfa yüksekliği) her zaman tam 1 çıkar, ne fazladan boşluk ne de
  // neredeyse boş bir 2. sayfa kalır.
  const widthMm = canvas.width / HTML2CANVAS_SCALE / PX_PER_MM
  // jsPDF'in dahili birim dönüşümünde oluşan kayan nokta yuvarlama farkı,
  // bazen hesaplanan yükseklik canvas'tan 1px kısa çıkmasına ve bu yüzden
  // neredeyse boş bir 2. sayfa açılmasına yol açabiliyor — küçük bir pay
  // bırakarak bunu engelliyoruz.
  const heightMm = canvas.height / HTML2CANVAS_SCALE / PX_PER_MM + 0.5

  // jsPDF, format dizisini varsayılan "portrait" (dikey) yönelimine göre
  // yorumluyor: genişlik yükseklikten büyükse bunu "hatalı" sayıp width/
  // height değerlerini SESSİZCE birbirine karıştırıyor. Kısa CV'lerde
  // (yükseklik < 210mm A4 genişliği) tam olarak bu oluyor ve sayfa yanlış
  // boyutlarda üretilip içeriğin altında büyük bir boşluk kalıyordu. Gerçek
  // en/boy ilişkisine uyan yönelimi açıkça belirterek bu karıştırmayı
  // engelliyoruz.
  const orientation = heightMm >= widthMm ? 'portrait' : 'landscape'

  const pdfWorker = worker.set({ jsPDF: { unit: 'mm', format: [widthMm, heightMm], orientation } }).toPdf()

  if (isIosDevice()) {
    // Normal indirme yerine PDF'i (yeni sekmede, mümkünse tıklama anında
    // AÇILMIŞ pencerede) Safari'nin kendi PDF görüntüleyicisinde açıyoruz —
    // oradaki paylaş simgesiyle "Dosyalar'a Kaydet" güvenilir çalışıyor.
    // Pencereyi burada değil, tıklama anında (senkron olarak) açmak
    // gerekiyor; aksi halde Safari'nin pop-up engelleyicisi devreye girer.
    const blobUrl: string = await pdfWorker.output('bloburl')
    const target = preOpenedWindow ?? window.open(blobUrl, '_blank')
    if (target && preOpenedWindow) {
      target.location.href = blobUrl
    }
    if (!target) {
      // Pop-up her şekilde engellendiyse son çare olarak normal indirmeyi dene.
      await pdfWorker.save()
    }
    return
  }

  await pdfWorker.save()
}
