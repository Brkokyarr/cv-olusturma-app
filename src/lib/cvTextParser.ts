import { createId } from './id'
import { EMPTY_CV_DATA, type CvData } from '../types/cv'

type SectionKey =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'certificates'
  | 'references'

// Bu başlıklar bir "bölüm" değildir ama önceki bölümün (örn. Eğitim) devam
// etmediğini gösterir — görülünce mevcut bölümü kapatıp içeriğini yok sayıyoruz
// (iletişim bilgileri zaten e-posta/telefon regex'iyle ayrı çıkarılıyor).
const IGNORED_HEADER_KEYWORDS = [
  'iletisim',
  'contact',
  'kisisel bilgiler',
  'personal information',
]

const SECTION_KEYWORDS: Record<SectionKey, string[]> = {
  summary: [
    'özet',
    'hakkımda',
    'hakkında',
    'kendim hakkında',
    'kişisel özet',
    'profesyonel özet',
    'kariyer hedefi',
    'amaç',
    'profil',
    'summary',
    'about me',
    'about',
    'objective',
    'career objective',
    'profile',
  ],
  experience: [
    'iş deneyimi',
    'deneyim',
    'çalışma deneyimi',
    'work experience',
    'professional experience',
    'experience',
  ],
  education: ['eğitim', 'öğrenim', 'akademik', 'education'],
  skills: ['yetenekler', 'beceriler', 'teknik beceriler', 'skills'],
  languages: ['diller', 'yabancı dil', 'languages'],
  certificates: [
    'sertifikalar',
    'sertifika',
    'kurslar',
    'belgeler ve sertifikalar',
    'belgeler',
    'certificates',
    'certifications',
  ],
  references: ['referanslar', 'referans', 'references'],
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/

const MONTH_NAMES =
  'Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık|' +
  'January|February|March|April|May|June|July|August|September|October|November|December|' +
  'Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec'
// Sırasıyla: tam gün-ay-yıl (15-05-2020), ay-yıl (05/2020), tek başına yıl
// (2020), ay adı + yıl (Ocak 2020). En spesifik/uzun kalıp önce denenmeli ki
// "15-05-2020" gibi bir tarih yanlışlıkla sadece "2020" olarak eşleşmesin.
const DATE_TOKEN =
  `(?:\\d{1,2}[./-]\\d{1,2}[./-]\\d{4}` +
  `|\\d{1,2}[./-]\\d{4}` +
  `|\\d{4}` +
  `|(?:${MONTH_NAMES})\\.?\\s+\\d{4})`
const DATE_RANGE_PATTERN = `(${DATE_TOKEN})\\s*[-–—]\\s*(${DATE_TOKEN}|Halen|Devam|Present|Now|Günümüz)`
const DATE_RANGE_REGEX = new RegExp(DATE_RANGE_PATTERN, 'i')
const DATE_RANGE_REGEX_GLOBAL = new RegExp(DATE_RANGE_PATTERN, 'gi')

function deasciify(value: string): string {
  return value
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
}

const NORMALIZED_SECTION_KEYWORDS: Record<SectionKey, string[]> = Object.fromEntries(
  (Object.keys(SECTION_KEYWORDS) as SectionKey[]).map((key) => [
    key,
    SECTION_KEYWORDS[key].map(deasciify),
  ]),
) as Record<SectionKey, string[]>

const NORMALIZED_IGNORED_HEADER_KEYWORDS = IGNORED_HEADER_KEYWORDS.map(deasciify)

function detectSectionHeader(line: string): SectionKey | 'ignore' | null {
  const normalized = deasciify(line.replace(/[:：]+$/, '').trim())
  if (!normalized || normalized.length > 40) return null

  if (NORMALIZED_IGNORED_HEADER_KEYWORDS.some((keyword) => normalized === keyword || normalized.startsWith(keyword))) {
    return 'ignore'
  }

  for (const key of Object.keys(NORMALIZED_SECTION_KEYWORDS) as SectionKey[]) {
    if (
      NORMALIZED_SECTION_KEYWORDS[key].some(
        (keyword) => normalized === keyword || normalized.startsWith(keyword),
      )
    ) {
      return key
    }
  }
  return null
}

function splitIntoSections(lines: string[]) {
  const sections: Record<SectionKey, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certificates: [],
    references: [],
  }
  const preamble: string[] = []
  let current: SectionKey | null = null

  for (const line of lines) {
    const header = detectSectionHeader(line)
    if (header === 'ignore') {
      current = null
      continue
    }
    if (header) {
      current = header
      continue
    }
    if (current) {
      sections[current].push(line)
    } else {
      preamble.push(line)
    }
  }

  return { sections, preamble }
}

function splitBlocks(lines: string[]): string[][] {
  const blocks: string[][] = []
  let current: string[] = []

  for (const line of lines) {
    if (!line) {
      if (current.length) {
        blocks.push(current)
        current = []
      }
    } else {
      current.push(line)
    }
  }
  if (current.length) blocks.push(current)

  return blocks
}

function stripTrailingPunctuation(value: string): string {
  return value.replace(/[\s|,\-–·]+$/, '').trim()
}

function splitFirstLine(firstLine: string): [string, string] {
  const parts = firstLine.split(/\s+[-–@|·]\s+|,\s*/)
  return [
    stripTrailingPunctuation(parts[0] ?? ''),
    stripTrailingPunctuation(parts[1] ?? ''),
  ]
}

function findPhoneNumber(text: string): string {
  const matches = text.match(/\+?\d[\d\s().-]{7,}\d/g) ?? []
  const candidate = matches
    .map((match) => ({ raw: match.trim(), digitCount: match.replace(/\D/g, '').length }))
    .find(({ digitCount }) => digitCount >= 10 && digitCount <= 13)
  return candidate?.raw ?? ''
}

// OCR/PDF çıkarımından gelen gürültülü metinlerde ("WEĞ İİ > OKYAR © ...")
// bazı satırlar gerçek içerik gibi durmaz — çok fazla sembol içerir ya da
// harf oranı çok düşüktür. Böyle satırları isim/unvan/konum gibi alanlara
// güvenle doldurmak yerine boş bırakmak, yanlış dolu göstermekten iyidir.
const SUSPICIOUS_CHARS_REGEX = /[©®™*<>{}[\]_~^]/

function looksClean(value: string): boolean {
  if (!value) return false
  if (SUSPICIOUS_CHARS_REGEX.test(value)) return false
  const letters = (value.match(/\p{L}/gu) ?? []).length
  return letters / value.length >= 0.5
}

function guessNameAndTitle(preamble: string[]): { fullName: string; title: string } {
  const candidates = preamble.filter((line) => line && !EMAIL_REGEX.test(line) && looksClean(line))
  const fullName = candidates[0]?.slice(0, 80) ?? ''
  const title = candidates[1] && candidates[1].length < 80 ? candidates[1] : ''
  return { fullName, title }
}

const PHONE_LIKE_REGEX = /^\+?[\d\s().-]{7,}$/

function guessLocation(preamble: string[], fullName: string, title: string): string {
  const candidate = preamble.find(
    (line) =>
      line &&
      line.length >= 2 &&
      /\p{L}{2,}/u.test(line) &&
      looksClean(line) &&
      line !== fullName &&
      line !== title &&
      line.length <= 50 &&
      !EMAIL_REGEX.test(line) &&
      !PHONE_LIKE_REGEX.test(line) &&
      !DATE_RANGE_REGEX.test(line),
  )
  return candidate ?? ''
}

function parseSummary(lines: string[]): string {
  return lines.filter(Boolean).join(' ').trim()
}

// Bazı CV'lerde "Hakkımda" başlığı hiç yazılmaz, kişi bilgilerinin hemen
// altına başlıksız bir tanıtım cümlesi/paragrafı eklenir. Başlıklı bölümlerde
// özet bulunamazsa, kişisel bilgiler bloğunda kalan uzunca (cümle gibi
// duran) bir satırı özet olarak deniyoruz.
function guessImplicitSummary(preamble: string[], usedLines: Set<string>): string {
  const candidate = preamble.find(
    (line) =>
      line &&
      !usedLines.has(line) &&
      line.length >= 40 &&
      looksClean(line) &&
      !EMAIL_REGEX.test(line) &&
      !PHONE_LIKE_REGEX.test(line) &&
      !DATE_RANGE_REGEX.test(line),
  )
  return candidate ?? ''
}

function parseSkills(lines: string[]): string[] {
  const joined = lines.filter(Boolean).join(', ')
  return joined
    .split(/[,•·\n]/)
    .map((skill) => skill.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean)
}

function parseLanguages(lines: string[]) {
  const joined = lines.filter(Boolean).join(', ')
  const parts = joined
    .split(/[,•·]/)
    .map((part) => part.trim())
    .filter(Boolean)

  return parts.map((part) => {
    const match = part.match(/^(.+?)[\s:(–-]+([A-Za-zÇĞİÖŞÜçğıöşü]+)\)?$/)
    return match
      ? { id: createId(), name: match[1].trim(), level: match[2].trim() }
      : { id: createId(), name: part, level: '' }
  })
}

// Bir satırın "açıklama" değil de "şirket adı" olma ihtimalini kabaca
// tahmin eder: açıklamalar genelde cümle gibi uzun ve noktalamalıdır, şirket
// adları ise kısa, tek satırlık bir isimdir.
function looksLikeCompanyName(line: string): boolean {
  return (
    line.length > 0 && line.length <= 60 && !/[.!?]\s+\S/.test(line) && looksClean(line)
  )
}

function parseExperienceBlock(block: string[]) {
  const dateLineIndex = block.findIndex((line) => DATE_RANGE_REGEX.test(line))
  const dateMatch = (dateLineIndex >= 0 ? block[dateLineIndex] : block.join(' ')).match(
    DATE_RANGE_REGEX,
  )
  const contentLines = block.filter((_, index) => index !== dateLineIndex)
  let [position, company] = splitFirstLine(contentLines[0] ?? '')
  let descriptionLines = contentLines.slice(1)

  // İlk satırda "Pozisyon - Şirket" gibi bir ayraç yoksa (company boş
  // kaldıysa), şirket adı muhtemelen kendi satırında yazılmıştır.
  if (!company && descriptionLines.length > 0 && looksLikeCompanyName(descriptionLines[0])) {
    company = descriptionLines[0]
    descriptionLines = descriptionLines.slice(1)
  }

  // Ayraçla bulunmuş olsa bile gürültülü (OCR artığı sembol içeren) bir
  // şirket adını güvenle göstermeyelim.
  if (company && !looksClean(company)) {
    company = ''
  }

  return {
    id: createId(),
    company,
    position,
    startDate: dateMatch?.[1] ?? '',
    endDate: dateMatch?.[2] ?? '',
    description: descriptionLines.join(' ').trim(),
  }
}

/**
 * Bazı CV'lerde (özellikle boş satır olmadan üst üste akan listeler) tek bir
 * blok içinde birden fazla iş deneyimi birleşik gelir. Bu durumda bloktaki
 * HER tarih aralığını bir girdinin sonu sayıp bloğu o kadar girdiye bölüyoruz
 * — tek tarihli normal bloklarda bu, eski tek-girdi davranışıyla aynı sonucu
 * verir.
 */
function parseExperienceBlocks(block: string[]) {
  const text = block.join(' ')
  const dateMatches = [...text.matchAll(DATE_RANGE_REGEX_GLOBAL)]

  if (dateMatches.length <= 1) {
    return [parseExperienceBlock(block)]
  }

  const entries: ReturnType<typeof parseExperienceBlock>[] = []
  let cursor = 0

  for (const match of dateMatches) {
    const matchIndex = match.index ?? 0
    const segment = text.slice(cursor, matchIndex).trim()
    const [position, company] = splitFirstLine(segment)
    entries.push({
      id: createId(),
      position,
      company,
      startDate: match[1] ?? '',
      endDate: match[2] ?? '',
      description: '',
    })
    cursor = matchIndex + match[0].length
  }

  const trailing = text.slice(cursor).trim()
  const lastEntry = entries[entries.length - 1]
  if (trailing && lastEntry) {
    lastEntry.description = trailing
  }

  return entries
}

const SCHOOL_NAME_KEYWORDS = [
  'universite',
  'university',
  'college',
  'okul',
  'lise',
  'enstitu',
  'institute',
  'akademi',
  'academy',
]

function parseEducationBlock(block: string[]) {
  const dateLineIndex = block.findIndex((line) => DATE_RANGE_REGEX.test(line))
  const dateMatch = (dateLineIndex >= 0 ? block[dateLineIndex] : block.join(' ')).match(
    DATE_RANGE_REGEX,
  )
  const contentLines = block.filter((_, index) => index !== dateLineIndex)

  let school = contentLines[0] ?? ''
  let field = contentLines[1] ?? ''

  if (contentLines.length === 1) {
    ;[school, field] = splitFirstLine(contentLines[0])
  } else if (contentLines.length >= 2 && SCHOOL_NAME_KEYWORDS.some((kw) => deasciify(contentLines[1]).includes(kw))) {
    // "Bölüm" sonra "Üniversite" sırasıyla yazılmışsa (bazı şablonlarda
    // olduğu gibi) okul ismini doğru satırdan al.
    school = contentLines[1]
    field = contentLines[0]
  }

  return {
    id: createId(),
    school,
    field,
    startDate: dateMatch?.[1] ?? '',
    endDate: dateMatch?.[2] ?? '',
  }
}

function parseCertificateBlock(block: string[]) {
  const text = block.join(' ')
  const yearMatch = text.match(/\b(19|20)\d{2}\b/)
  const [name, issuer] = splitFirstLine(block[0] ?? '')

  return { id: createId(), name, issuer, year: yearMatch?.[0] ?? '' }
}

function parseReferenceBlock(block: string[]) {
  const text = block.join(' ')
  const emailMatch = text.match(EMAIL_REGEX)
  const [name, relation] = splitFirstLine(block[0] ?? '')

  return { id: createId(), name, relation, contact: emailMatch?.[0] ?? '' }
}

// Bazı PDF'ler (özellikle tasarım araçlarından çıkanlar) her harfi ayrı bir
// metin parçası olarak konumlandırır: "S a t ı ş" gibi çıkar. OCR çıktısında
// da benzer şekilde harfler düzensiz 1-2'li gruplar halinde bölünebilir
// ("B U RA K" gibi). 3+ kısa (1-2 harfli) parçanın tek boşlukla ayrıldığı
// dizileri gerçek kelimeye geri çeviriyoruz.
function collapseLetterSpacing(text: string): string {
  return text.replace(
    /(?<![\p{L}])(?:\p{L}{1,2}\s){2,}\p{L}{1,2}(?![\p{L}])/gu,
    (match) => match.replace(/\s+/g, ''),
  )
}

// İkon fontları (e-posta/telefon/konum ikonları gibi) PDF'e genelde Private
// Use Area'da özel karakterler olarak gömülür; metne karışınca tarayıcıda
// "□" gibi görünürler. Bunlar gerçek içerik değildir, temizlemezsek örn.
// konum tahmini bu karakterleri yanlışlıkla gerçek bir satır sanabilir.
function stripIconGlyphs(text: string): string {
  return text.replace(/[\u{E000}-\u{F8FF}\u{FFFD}\u{FFFC}]/gu, '')
}

export function parseCvTextHeuristically(rawText: string): CvData {
  const text = collapseLetterSpacing(stripIconGlyphs(rawText))
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line, index, all) => line || all[index - 1] === '')
  const { sections, preamble } = splitIntoSections(lines)
  const { fullName, title } = guessNameAndTitle(preamble)
  const location = guessLocation(preamble, fullName, title)
  const summary =
    parseSummary(sections.summary) ||
    guessImplicitSummary(preamble, new Set([fullName, title, location]))

  return {
    theme: EMPTY_CV_DATA.theme,
    personalInfo: {
      fullName,
      title,
      email: text.match(EMAIL_REGEX)?.[0] ?? '',
      phone: findPhoneNumber(text),
      location,
      photoDataUrl: '',
      smoking: '',
    },
    summary,
    experience: splitBlocks(sections.experience).flatMap(parseExperienceBlocks),
    education: splitBlocks(sections.education).map(parseEducationBlock),
    skills: parseSkills(sections.skills),
    languages: parseLanguages(sections.languages),
    certificates: splitBlocks(sections.certificates).map(parseCertificateBlock),
    references: splitBlocks(sections.references).map(parseReferenceBlock),
    sectionOrder: EMPTY_CV_DATA.sectionOrder,
  }
}
