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

export function TimelineTemplate({ data, accent }: TemplateProps) {
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
      <section className="mt-5">
        <SectionHeading icon={Briefcase} className="text-xs text-ink-secondary">
          İş Deneyimi
        </SectionHeading>
        <div className="relative mt-3 flex flex-col gap-4 border-l-2 border-ink/10 pl-5">
          {experience.map((item) => (
            <div key={item.id} className="relative">
              <span
                className={`absolute -left-[1.65rem] top-0.5 h-2.5 w-2.5 rounded-full ring-4 ring-paper ${accent.bgClass}`}
              />
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
        <SectionHeading icon={GraduationCap} className="text-xs text-ink-secondary">
          Eğitim
        </SectionHeading>
        <div className="relative mt-3 flex flex-col gap-3 border-l-2 border-ink/10 pl-5">
          {education.map((item) => (
            <div key={item.id} className="relative">
              <span
                className={`absolute -left-[1.65rem] top-0.5 h-2.5 w-2.5 rounded-full ring-4 ring-paper ${accent.bgClass}`}
              />
              <div className="flex items-baseline justify-between gap-2">
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
            </div>
          ))}
        </div>
      </section>
    ),
    skills: skills.length > 0 && (
      <section className="mt-5">
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
      <section className="mt-5">
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
      <section className="mt-5">
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
      <section className="mt-5">
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
      <header className="flex items-center gap-4 border-b border-ink/10 pb-4">
        {personalInfo.photoDataUrl ? (
          <img
            src={personalInfo.photoDataUrl}
            alt={personalInfo.fullName || 'Profil fotoğrafı'}
            className={`h-16 w-16 shrink-0 rounded-2xl border-2 object-cover ${accent.borderClass}`}
          />
        ) : (
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${accent.softBgClass}`}>
            <User className={`h-7 w-7 ${accent.textClass}`} />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-ink">{personalInfo.fullName || 'Ad Soyad'}</h1>
          {personalInfo.title && (
            <p className={`mt-0.5 text-sm font-semibold ${accent.textClass}`}>{personalInfo.title}</p>
          )}
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-secondary">
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
