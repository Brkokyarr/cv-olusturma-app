import {
  Award,
  Briefcase,
  GraduationCap,
  Languages as LanguagesIcon,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
  Wrench,
} from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import { getSmokingLabel } from '../../../lib/personalInfo'
import type { SectionKey } from '../../../types/cv'
import type { TemplateProps } from './TemplateProps'
import { SectionHeading } from './SectionHeading'

const LANGUAGE_LEVELS = ['Başlangıç', 'Orta', 'İyi', 'Akıcı', 'Anadil']

function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'AS'
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function LevelDots({ level, accentBgClass }: { level: string; accentBgClass: string }) {
  const filled = LANGUAGE_LEVELS.indexOf(level) + 1

  return (
    <span className="inline-flex items-center gap-0.5">
      {LANGUAGE_LEVELS.map((option, index) => (
        <span
          key={option}
          className={`h-1.5 w-1.5 rounded-full ${index < filled ? accentBgClass : 'bg-ink/15'}`}
        />
      ))}
    </span>
  )
}

export function SikTemplate({ data, accent }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, references } = data

  const sectionRenderers: Record<SectionKey, ReactNode> = {
    summary: summary && (
      <section className="mt-5 rounded-lg border border-ink/10 p-3">
        <SectionHeading icon={User} className="text-xs text-ink-secondary">
          Hakkımda
        </SectionHeading>
        <p className="mt-1.5 text-sm leading-relaxed text-ink">{summary}</p>
      </section>
    ),
    experience: experience.length > 0 && (
      <section className="mt-5">
        <SectionHeading icon={Briefcase} className={`text-xs ${accent.textClass}`}>
          İş Deneyimi
        </SectionHeading>
        <div className="mt-2 flex flex-col gap-3">
          {experience.map((item) => (
            <div key={item.id} className="relative border-l-2 border-ink/10 pl-3">
              <span className={`absolute -left-[5px] top-1 h-2 w-2 rounded-full ${accent.bgClass}`} />
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
      <section className="mt-5">
        <SectionHeading icon={GraduationCap} className={`text-xs ${accent.textClass}`}>
          Eğitim
        </SectionHeading>
        <div className="mt-2 flex flex-col gap-2">
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
    skills: skills.length > 0 && (
      <section className="mt-5">
        <SectionHeading icon={Wrench} className={`text-xs ${accent.textClass}`}>
          Yetenekler
        </SectionHeading>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span
              key={skill}
              className={`rounded-full px-2.5 py-1 text-xs ${accent.softBgClass} ${accent.textClass}`}
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    ),
    languages: languages.length > 0 && (
      <section className="mt-5">
        <SectionHeading icon={LanguagesIcon} className={`text-xs ${accent.textClass}`}>
          Diller
        </SectionHeading>
        <div className="mt-2 flex flex-col gap-1.5 text-xs text-ink-secondary">
          {languages.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-2">
              <span>{item.name || 'Dil'}</span>
              <LevelDots level={item.level} accentBgClass={accent.bgClass} />
            </div>
          ))}
        </div>
      </section>
    ),
    certificates: certificates.length > 0 && (
      <section className="mt-5">
        <SectionHeading icon={Award} className={`text-xs ${accent.textClass}`}>
          Sertifikalar
        </SectionHeading>
        <div className="mt-2 flex flex-col gap-1 text-xs text-ink-secondary">
          {certificates.map((item) => (
            <span key={item.id}>
              {item.name} {item.issuer && `— ${item.issuer}`} {item.year && `(${item.year})`}
            </span>
          ))}
        </div>
      </section>
    ),
    references: references.length > 0 && (
      <section className="mt-5">
        <SectionHeading icon={Users} className={`text-xs ${accent.textClass}`}>
          Referanslar
        </SectionHeading>
        <div className="mt-2 flex flex-col gap-1 text-xs text-ink-secondary">
          {references.map((item) => (
            <span key={item.id}>
              {item.name} {item.relation && `— ${item.relation}`} {item.contact && `· ${item.contact}`}
            </span>
          ))}
        </div>
      </section>
    ),
  }

  return (
    <div className="flex flex-col">
      <header className="flex items-center gap-4">
        {personalInfo.photoDataUrl ? (
          <img
            src={personalInfo.photoDataUrl}
            alt={personalInfo.fullName || 'Profil fotoğrafı'}
            className={`h-20 w-20 shrink-0 rounded-full object-cover ring-4 ${accent.softBgClass}`}
          />
        ) : (
          <div
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white ${accent.bgClass}`}
          >
            {initials(personalInfo.fullName)}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-ink">{personalInfo.fullName || 'Ad Soyad'}</h1>
          {personalInfo.title && (
            <p className={`mt-0.5 text-sm font-semibold ${accent.textClass}`}>{personalInfo.title}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-secondary">
            {personalInfo.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.smoking && (
              <span>Sigara Kullanımı: {getSmokingLabel(personalInfo.smoking)}</span>
            )}
          </div>
        </div>
      </header>

      {data.sectionOrder.map((key) => (
        <Fragment key={key}>{sectionRenderers[key]}</Fragment>
      ))}
    </div>
  )
}
