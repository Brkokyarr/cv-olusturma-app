import {
  Award,
  Briefcase,
  GraduationCap,
  Languages as LanguagesIcon,
  Mail,
  MapPin,
  Phone,
  Users,
  Wrench,
} from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import { getSmokingLabel } from '../../../lib/personalInfo'
import type { SectionKey } from '../../../types/cv'
import type { TemplateProps } from './TemplateProps'
import { SectionHeading } from './SectionHeading'

const MAIN_SECTION_KEYS: SectionKey[] = ['summary', 'experience', 'education', 'references']

function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'AS'
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function KompaktTemplate({ data, accent }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, references } = data

  const mainSectionRenderers: Partial<Record<SectionKey, ReactNode>> = {
    summary: summary && (
      <section>
        <SectionHeading icon={Users} className="text-xs text-ink-secondary">
          Hakkımda
        </SectionHeading>
        <p className="mt-1.5 text-sm leading-relaxed text-ink">{summary}</p>
      </section>
    ),
    experience: experience.length > 0 && (
      <section>
        <SectionHeading icon={Briefcase} className="text-xs text-ink-secondary">
          İş Deneyimi
        </SectionHeading>
        <div className="mt-1.5 flex flex-col gap-3">
          {experience.map((item) => (
            <div key={item.id}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-ink">
                  {item.position || 'Pozisyon'}
                  {item.company && ` · ${item.company}`}
                </p>
                {(item.startDate || item.endDate) && (
                  <p className="shrink-0 text-xs text-ink-muted">
                    {item.startDate} — {item.endDate}
                  </p>
                )}
              </div>
              {item.description && (
                <p className="mt-0.5 text-xs leading-relaxed text-ink-secondary">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    ),
    education: education.length > 0 && (
      <section>
        <SectionHeading icon={GraduationCap} className="text-xs text-ink-secondary">
          Eğitim
        </SectionHeading>
        <div className="mt-1.5 flex flex-col gap-2">
          {education.map((item) => (
            <div key={item.id} className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-ink">
                {item.school || 'Okul'}
                {item.field && ` · ${item.field}`}
              </p>
              {(item.startDate || item.endDate) && (
                <p className="shrink-0 text-xs text-ink-muted">
                  {item.startDate} — {item.endDate}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    ),
    references: references.length > 0 && (
      <section>
        <SectionHeading icon={Users} className="text-xs text-ink-secondary">
          Referanslar
        </SectionHeading>
        <div className="mt-1.5 flex flex-col gap-1 text-xs text-ink-secondary">
          {references.map((item) => (
            <span key={item.id}>
              {item.name} {item.relation && `— ${item.relation}`} {item.contact && `· ${item.contact}`}
            </span>
          ))}
        </div>
      </section>
    ),
  }

  const orderedMainKeys = data.sectionOrder.filter((key) => MAIN_SECTION_KEYS.includes(key))

  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-ink/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">{personalInfo.fullName || 'Ad Soyad'}</h1>
          {personalInfo.title && (
            <p className={`mt-0.5 text-sm font-medium ${accent.textClass}`}>{personalInfo.title}</p>
          )}
        </div>
        {personalInfo.photoDataUrl ? (
          <img
            src={personalInfo.photoDataUrl}
            alt={personalInfo.fullName || 'Profil fotoğrafı'}
            className="h-16 w-16 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white ${accent.bgClass}`}
          >
            {initials(personalInfo.fullName)}
          </div>
        )}
      </header>

      <div className="mt-5 flex gap-6">
        <div className="flex flex-1 flex-col gap-4">
          {orderedMainKeys.map((key) => (
            <Fragment key={key}>{mainSectionRenderers[key]}</Fragment>
          ))}
        </div>

        <aside className="flex w-1/3 shrink-0 flex-col gap-4 rounded-lg bg-ink/5 p-3">
          <div className="flex flex-col gap-1.5 text-xs text-ink-secondary">
            {personalInfo.email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3 w-3 shrink-0" />
                <span className="break-all">{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3 w-3 shrink-0" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3 w-3 shrink-0" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.smoking && (
              <span>Sigara Kullanımı: {getSmokingLabel(personalInfo.smoking)}</span>
            )}
          </div>

          {skills.length > 0 && (
            <div>
              <SectionHeading icon={Wrench} className="text-[10px] text-ink-secondary">
                Yetenekler
              </SectionHeading>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className={`rounded-full px-2 py-0.5 text-[10px] ${accent.softBgClass} ${accent.textClass}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <SectionHeading icon={LanguagesIcon} className="text-[10px] text-ink-secondary">
                Diller
              </SectionHeading>
              <div className="mt-1.5 flex flex-col gap-0.5 text-[11px] text-ink-secondary">
                {languages.map((item) => (
                  <span key={item.id}>
                    {item.name || 'Dil'} — {item.level}
                  </span>
                ))}
              </div>
            </div>
          )}

          {certificates.length > 0 && (
            <div>
              <SectionHeading icon={Award} className="text-[10px] text-ink-secondary">
                Sertifikalar
              </SectionHeading>
              <div className="mt-1.5 flex flex-col gap-0.5 text-[11px] text-ink-secondary">
                {certificates.map((item) => (
                  <span key={item.id}>
                    {item.name} {item.year && `(${item.year})`}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
