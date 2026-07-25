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

export function KartTemplate({ data, accent }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, references } = data

  const sectionRenderers: Record<SectionKey, ReactNode> = {
    summary: summary && (
      <section className="mt-4 rounded-xl border border-ink/10 p-4 shadow-sm">
        <SectionHeading icon={User} className={`text-xs ${accent.textClass}`}>
          Hakkımda
        </SectionHeading>
        <p className="mt-2 text-sm leading-relaxed text-ink">{summary}</p>
      </section>
    ),
    experience: experience.length > 0 && (
      <section className="mt-4 rounded-xl border border-ink/10 p-4 shadow-sm">
        <SectionHeading icon={Briefcase} className={`text-xs ${accent.textClass}`}>
          İş Deneyimi
        </SectionHeading>
        <div className="mt-3 flex flex-col gap-3">
          {experience.map((item) => (
            <div key={item.id} className={`border-l-2 pl-3 ${accent.borderClass}`}>
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
      <section className="mt-4 rounded-xl border border-ink/10 p-4 shadow-sm">
        <SectionHeading icon={GraduationCap} className={`text-xs ${accent.textClass}`}>
          Eğitim
        </SectionHeading>
        <div className="mt-3 flex flex-col gap-2">
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
      <section className="mt-4 rounded-xl border border-ink/10 p-4 shadow-sm">
        <SectionHeading icon={Users} className={`text-xs ${accent.textClass}`}>
          Referanslar
        </SectionHeading>
        <div className="mt-3 flex flex-col gap-1 text-xs text-ink-secondary">
          {references.map((item) => (
            <span key={item.id}>
              {item.name} {item.relation && `— ${item.relation}`} {item.contact && `· ${item.contact}`}
            </span>
          ))}
        </div>
      </section>
    ),
    skills: skills.length > 0 && (
      <div className="rounded-xl border border-ink/10 p-4 shadow-sm">
        <SectionHeading icon={Wrench} className={`text-xs ${accent.textClass}`}>
          Yetenekler
        </SectionHeading>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span
              key={skill}
              className={`rounded-md px-2 py-1 text-xs ${accent.softBgClass} ${accent.textClass}`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    ),
    languages: languages.length > 0 && (
      <div className="rounded-xl border border-ink/10 p-4 shadow-sm">
        <SectionHeading icon={LanguagesIcon} className={`text-xs ${accent.textClass}`}>
          Diller
        </SectionHeading>
        <div className="mt-2 flex flex-col gap-1 text-xs text-ink-secondary">
          {languages.map((item) => (
            <span key={item.id}>
              {item.name || 'Dil'} — {item.level}
            </span>
          ))}
        </div>
      </div>
    ),
    certificates: certificates.length > 0 && (
      <div className="rounded-xl border border-ink/10 p-4 shadow-sm">
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
      </div>
    ),
  }

  const mainKeys: SectionKey[] = ['summary', 'experience', 'education', 'references']
  const gridKeys: SectionKey[] = ['skills', 'languages', 'certificates']
  const orderedMainKeys = data.sectionOrder.filter((key) => mainKeys.includes(key))
  const orderedGridKeys = data.sectionOrder.filter((key) => gridKeys.includes(key))

  return (
    <div className="flex flex-col">
      <header className="flex flex-wrap items-center gap-4 rounded-xl border border-ink/10 p-4 shadow-sm">
        {personalInfo.photoDataUrl ? (
          <img
            src={personalInfo.photoDataUrl}
            alt={personalInfo.fullName || 'Profil fotoğrafı'}
            className="h-16 w-16 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${accent.softBgClass}`}
          >
            <User className={`h-7 w-7 ${accent.textClass}`} />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-ink">{personalInfo.fullName || 'Ad Soyad'}</h1>
          {personalInfo.title && (
            <p className={`text-sm font-medium ${accent.textClass}`}>{personalInfo.title}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 text-[11px] text-ink-secondary">
          {personalInfo.email && (
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3 w-3 shrink-0" />
              {personalInfo.email}
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
      </header>

      {orderedMainKeys.map((key) => (
        <Fragment key={key}>{sectionRenderers[key]}</Fragment>
      ))}

      {orderedGridKeys.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {orderedGridKeys.map((key) => (
            <Fragment key={key}>{sectionRenderers[key]}</Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
