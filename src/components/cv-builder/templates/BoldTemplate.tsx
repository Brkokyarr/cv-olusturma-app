import {
  Award,
  Briefcase,
  GraduationCap,
  Info,
  Languages as LanguagesIcon,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import { getSmokingLabel } from '../../../lib/personalInfo'
import type { SectionKey } from '../../../types/cv'
import type { TemplateProps } from './TemplateProps'

function ContactBadge({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-white/15 px-2.5 py-1 text-xs leading-none text-white">
      <Icon className="h-3 w-3 shrink-0" />
      {children}
    </span>
  )
}

function PillHeading({
  icon: Icon,
  children,
  accentBgClass,
}: {
  icon: LucideIcon
  children: ReactNode
  accentBgClass: string
}) {
  return (
    <h2
      className={`inline-flex w-fit items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold uppercase leading-none tracking-wide text-white ${accentBgClass}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {children}
    </h2>
  )
}

export function BoldTemplate({ data, accent }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, references } = data

  const sectionRenderers: Record<SectionKey, ReactNode> = {
    summary: summary && (
      <section className="mt-5">
        <PillHeading icon={User} accentBgClass={accent.bgClass}>
          Hakkımda
        </PillHeading>
        <p className="mt-2 text-sm leading-relaxed text-ink">{summary}</p>
      </section>
    ),
    experience: experience.length > 0 && (
      <section className="mt-5">
        <PillHeading icon={Briefcase} accentBgClass={accent.bgClass}>
          İş Deneyimi
        </PillHeading>
        <div className="mt-2 flex flex-col gap-3">
          {experience.map((item) => (
            <div key={item.id} className={`rounded-lg ${accent.softBgClass} p-3`}>
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
        <PillHeading icon={GraduationCap} accentBgClass={accent.bgClass}>
          Eğitim
        </PillHeading>
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
        <PillHeading icon={Wrench} accentBgClass={accent.bgClass}>
          Yetenekler
        </PillHeading>
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
        <PillHeading icon={LanguagesIcon} accentBgClass={accent.bgClass}>
          Diller
        </PillHeading>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-secondary">
          {languages.map((item) => (
            <span key={item.id}>
              {item.name || 'Dil'} — {item.level}
            </span>
          ))}
        </div>
      </section>
    ),
    certificates: certificates.length > 0 && (
      <section className="mt-5">
        <PillHeading icon={Award} accentBgClass={accent.bgClass}>
          Sertifikalar
        </PillHeading>
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
        <PillHeading icon={Users} accentBgClass={accent.bgClass}>
          Referanslar
        </PillHeading>
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
      <header className={`-mx-8 -mt-8 flex items-center gap-4 rounded-b-2xl px-8 py-6 ${accent.bgClass}`}>
        {personalInfo.photoDataUrl ? (
          <img
            src={personalInfo.photoDataUrl}
            alt={personalInfo.fullName || 'Profil fotoğrafı'}
            className="h-20 w-20 shrink-0 rounded-full border-2 border-white/60 object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/15">
            <User className="h-8 w-8 text-white" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-white">{personalInfo.fullName || 'Ad Soyad'}</h1>
          {personalInfo.title && (
            <p className="mt-0.5 text-sm font-medium text-white/85">{personalInfo.title}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {personalInfo.email && <ContactBadge icon={Mail}>{personalInfo.email}</ContactBadge>}
            {personalInfo.phone && <ContactBadge icon={Phone}>{personalInfo.phone}</ContactBadge>}
            {personalInfo.location && (
              <ContactBadge icon={MapPin}>{personalInfo.location}</ContactBadge>
            )}
            {personalInfo.smoking && (
              <ContactBadge icon={Info}>
                Sigara Kullanımı: {getSmokingLabel(personalInfo.smoking)}
              </ContactBadge>
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
