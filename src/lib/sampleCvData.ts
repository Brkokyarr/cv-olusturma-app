import { EMPTY_CV_DATA, type CvData } from '../types/cv'

export const SAMPLE_CV_DATA: CvData = {
  ...EMPTY_CV_DATA,
  personalInfo: {
    fullName: 'Ayşe Yılmaz',
    title: 'Ürün Tasarımcısı',
    email: 'ayse.yilmaz@ornek.com',
    phone: '0532 123 45 67',
    location: 'İstanbul, Türkiye',
    photoDataUrl: '',
  },
  summary:
    '5 yıllık deneyime sahip, kullanıcı odaklı ürün tasarımcısı. Dijital ürünlerde uçtan uca tasarım süreçlerini yönetiyorum.',
  experience: [
    {
      id: 'sample-exp-1',
      position: 'Kıdemli Ürün Tasarımcısı',
      company: 'Teknoloji A.Ş.',
      startDate: '2022',
      endDate: 'Halen',
      description: 'Mobil ve web ürünlerinin tasarım sistemini yönetiyorum.',
    },
    {
      id: 'sample-exp-2',
      position: 'Ürün Tasarımcısı',
      company: 'Dijital Stüdyo',
      startDate: '2019',
      endDate: '2022',
      description: 'E-ticaret platformunun kullanıcı deneyimini geliştirdim.',
    },
  ],
  education: [
    {
      id: 'sample-edu-1',
      school: 'İstanbul Teknik Üniversitesi',
      field: 'Endüstri Ürünleri Tasarımı',
      startDate: '2015',
      endDate: '2019',
    },
  ],
  skills: ['Figma', 'Kullanıcı Araştırması', 'Prototipleme', 'Tasarım Sistemleri'],
  languages: [{ id: 'sample-lang-1', name: 'İngilizce', level: 'İleri' }],
  certificates: [],
  references: [],
  customFields: [{ id: 'sample-cf-1', label: 'Sürücü Belgesi', value: 'B Sınıfı' }],
}
