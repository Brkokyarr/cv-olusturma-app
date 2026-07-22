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
import type { SectionKey } from '../../../types/cv'
import type { TemplateProps } from './TemplateProps'
import { SectionHeading } from './SectionHeading'

export function ModernTemplate({ data, accent }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, references } = data

  const sectionRenderers: Record<SectionKey, ReactNode> = {
    summary: summary && (
      <section className="mt-4">
        <SectionHeading icon={User} className="text-xs text-ink-secondary">
          Hakkımda
        </SectionHeading>
        <p className="mt-1.5 text-sm leading-relaxed text-ink">{summary}</p>
      </section>
    ),
    experience: experience.length > 0 && (
      <section className="mt-4">
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
      <section className="mt-4">
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
    skills: skills.length > 0 && (
      <section className="mt-4">
        <SectionHeading icon={Wrench} className="text-xs text-ink-secondary">
          Yetenekler
        </SectionHeading>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
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
      <section className="mt-4">
        <SectionHeading icon={LanguagesIcon} className="text-xs text-ink-secondary">
          Diller
        </SectionHeading>
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-secondary">
          {languages.map((item) => (
            <span key={item.id}>
              {item.name || 'Dil'} — {item.level}
            </span>
          ))}
        </div>
      </section>
    ),
    certificates: certificates.length > 0 && (
      <section className="mt-4">
        <SectionHeading icon={Award} className="text-xs text-ink-secondary">
          Sertifikalar
        </SectionHeading>
        <div className="mt-1.5 flex flex-col gap-1 text-xs text-ink-secondary">
          {certificates.map((item) => (
            <span key={item.id}>
              {item.name} {item.issuer && `— ${item.issuer}`} {item.year && `(${item.year})`}
            </span>
          ))}
        </div>
      </section>
    ),
    references: references.length > 0 && (
      <section className="mt-4">
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

  return (
    <div className="flex flex-col">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${accent.textClass}`}>
            {personalInfo.fullName || 'Ad Soyad'}
          </h1>
          {personalInfo.title && (
            <p className="mt-0.5 text-sm font-medium text-ink-secondary">{personalInfo.title}</p>
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
          </div>
          <div className={`mt-3 h-0.5 w-12 rounded-full ${accent.bgClass}`} />
        </div>
        {personalInfo.photoDataUrl && (
          <img
            src={personalInfo.photoDataUrl}
            alt={personalInfo.fullName || 'Profil fotoğrafı'}
            className="h-20 w-20 shrink-0 rounded-full object-cover"
          />
        )}
      </header>

      {data.sectionOrder.map((key) => (
        <Fragment key={key}>{sectionRenderers[key]}</Fragment>
      ))}
    </div>
  )
}
