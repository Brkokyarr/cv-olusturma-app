import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'
import { Card } from '../ui/Card'

const TIPS = [
  {
    title: 'Kısa ve öz tutun',
    body: 'İşe alım uzmanları bir CV\'ye ortalama birkaç saniye bakıyor. Deneyiminiz çok uzun olmadıkça CV\'nizi 1-2 sayfada tutun; her cümlenin gerçekten bir değer kattığından emin olun.',
  },
  {
    title: 'Sonuç odaklı yazın',
    body: '"Ekip yönettim" yerine "8 kişilik bir ekibi yönetip satışları %20 artırdım" gibi somut, ölçülebilir sonuçlar paylaşın. Sayılar ve rakamlar dikkat çeker ve iddialarınızı destekler.',
  },
  {
    title: 'Her başvuruya göre uyarlayın',
    body: 'İlan metnindeki anahtar kelimeleri (yazılım dilleri, araçlar, yetkinlikler) CV\'nize doğal bir şekilde yansıtın. Hem işe alım uzmanı hem de otomatik başvuru takip sistemleri (ATS) bu kelimeleri arar.',
  },
  {
    title: 'Doğru şablonu seçin',
    body: 'Kurumsal bir pozisyona başvuruyorsanız sade ve klasik bir düzen (Klasik, Minimalist); tasarım veya yaratıcı alanlarda çalışıyorsanız daha görsel bir şablon (Yaratıcı, Bold, Afiş) tercih edin.',
  },
  {
    title: 'Yazım ve dil bilgisine dikkat edin',
    body: 'Küçük bir yazım hatası bile özensiz bir izlenim bırakabilir. CV\'nizi göndermeden önce en az bir kez yüksek sesle okuyun veya güvendiğiniz birine kontrol ettirin.',
  },
  {
    title: 'İletişim bilgilerinizi güncel tutun',
    body: 'Telefon numaranız, e-postanız ve bulunduğunuz şehir güncel olmalı. İşverenin sizinle nasıl iletişime geçeceği net olmalı — eksik ya da yanlış bilgi geri dönüş şansınızı azaltır.',
  },
]

const FAQS = [
  {
    q: 'CV Oluştur gerçekten ücretsiz mi?',
    a: 'Evet, tamamen ücretsiz. Herhangi bir üyelik, kredi kartı bilgisi veya gizli ücret istemiyoruz. Uygulama, gösterilen reklamlarla desteklenmektedir.',
  },
  {
    q: 'Kayıt olmam ya da hesap oluşturmam gerekiyor mu?',
    a: 'Hayır. CV Oluştur\'da kullanıcı hesabı sistemi yok. CV\'leriniz doğrudan kullandığınız tarayıcıda saklanır; e-posta veya şifre girmenize gerek yoktur.',
  },
  {
    q: 'Verilerim/CV bilgilerim bir sunucuya gönderiliyor mu?',
    a: 'Hayır. Girdiğiniz tüm bilgiler yalnızca kendi cihazınızda (tarayıcı depolama alanında) tutulur. Herhangi bir sunucuya veya üçüncü bir tarafa gönderilmez.',
  },
  {
    q: 'Eski CV\'mi yükleyip düzenleyebilir miyim?',
    a: 'Evet. PDF veya Word (.docx) formatındaki mevcut CV\'nizi yükleyebilirsiniz; bilgileriniz otomatik olarak algılanıp seçtiğiniz yeni şablona yerleştirilir. Sonrasında dilediğiniz gibi düzenleyebilirsiniz.',
  },
  {
    q: 'Kaç farklı şablon var?',
    a: '11 farklı tasarım arasından seçim yapabilirsiniz — klasik ve kurumsalından, renkli ve yaratıcı olanına kadar geniş bir yelpaze sunuyoruz. Her şablonda renk temasını ve kağıt tonunu da özelleştirebilirsiniz.',
  },
  {
    q: 'Hazırladığım CV\'yi nasıl indiririm?',
    a: 'CV\'nizi oluşturduktan sonra tek dokunuşla PDF olarak indirebilir, doğrudan iş başvurularınızda kullanabilirsiniz.',
  },
]

export function CvGuideSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="mt-10 flex flex-col gap-10">
      <section aria-labelledby="cv-guide-heading">
        <h2 id="cv-guide-heading" className="text-lg font-semibold text-text-primary">
          Etkili Bir CV Nasıl Yazılır?
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-text-secondary">
          İyi bir CV, iş başvurunuzun görüşmeye dönüşme şansını doğrudan etkiler. İşe alım uzmanlarının
          dikkatini çekmek ve doğru izlenimi bırakmak için CV'nizi hazırlarken şu noktalara dikkat edin:
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {TIPS.map((tip) => (
            <Card key={tip.title} className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-text-primary">{tip.title}</h3>
              <p className="text-xs leading-relaxed text-text-secondary">{tip.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="cv-faq-heading">
        <h2 id="cv-faq-heading" className="text-lg font-semibold text-text-primary">
          Sık Sorulan Sorular
        </h2>
        <div className="mt-4 flex max-w-3xl flex-col gap-2">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <Card key={item.q} className="p-0">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-text-primary">{item.q}</span>
                  <ChevronDown
                    className={clsx(
                      'h-4 w-4 shrink-0 text-text-secondary transition-transform',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
                <p
                  className={clsx(
                    'px-5 text-sm leading-relaxed text-text-secondary',
                    isOpen ? 'pb-4' : 'hidden',
                  )}
                >
                  {item.a}
                </p>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
