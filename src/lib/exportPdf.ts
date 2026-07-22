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

export async function exportElementToPdf(element: HTMLElement, filename: string) {
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
  const heightMm = canvas.height / HTML2CANVAS_SCALE / PX_PER_MM

  await worker
    .set({ jsPDF: { unit: 'mm', format: [widthMm, heightMm] } })
    .toPdf()
    .save()
}
