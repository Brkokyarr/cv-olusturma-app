import { Award, Briefcase, GraduationCap, Languages as LanguagesIcon, Users, Wrench } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import type { SectionKey } from '../../../types/cv'
import type { TemplateProps } from './TemplateProps'
import { SectionHeading } from './SectionHeading'

export function KlasikTemplate({ data, accent }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, references } = data

  const sectionRenderers: Record<SectionKey, ReactNode> = {
    summary: summary && (
      <section className="mt-5 text-center">
        <p className="text-sm italic leading-relaxed text-ink">{summary}</p>
      </section>
    ),
    experience: experience.length > 0 && (
      <section className="mt-5">
        <SectionHeading
          icon={Briefcase}
          className="justify-center border-b border-ink/20 pb-1 text-xs tracking-[0.2em] text-ink"
        >
          İş Deneyimi
        </SectionHeading>
        <div className="mt-3 flex flex-col gap-3">
          {experience.map((item) => (
            <div key={item.id}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-ink">
                  {item.position || 'Pozisyon'}
                  {item.company && `, ${item.company}`}
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
        <SectionHeading
          icon={GraduationCap}
          className="justify-center border-b border-ink/20 pb-1 text-xs tracking-[0.2em] text-ink"
        >
          Eğitim
        </SectionHeading>
        <div className="mt-3 flex flex-col gap-2">
          {education.map((item) => (
            <div key={item.id} className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-ink">
                {item.school || 'Okul'}
                {item.field && `, ${item.field}`}
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
      <section className="mt-5 text-center">
        <SectionHeading
          icon={Wrench}
          className="justify-center border-b border-ink/20 pb-1 text-xs tracking-[0.2em] text-ink"
        >
          Yetenekler
        </SectionHeading>
        <p className="mt-3 text-xs text-ink-secondary">{skills.join('  ·  ')}</p>
      </section>
    ),
    languages: languages.length > 0 && (
      <section className="mt-5 text-center">
        <SectionHeading
          icon={LanguagesIcon}
          className="justify-center border-b border-ink/20 pb-1 text-xs tracking-[0.2em] text-ink"
        >
          Diller
        </SectionHeading>
        <p className="mt-3 text-xs text-ink-secondary">
          {languages.map((item) => `${item.name || 'Dil'} (${item.level})`).join('  ·  ')}
        </p>
      </section>
    ),
    certificates: certificates.length > 0 && (
      <section className="mt-5">
        <SectionHeading
          icon={Award}
          className="justify-center border-b border-ink/20 pb-1 text-xs tracking-[0.2em] text-ink"
        >
          Sertifikalar
        </SectionHeading>
        <div className="mt-3 flex flex-col gap-1 text-center text-xs text-ink-secondary">
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
        <SectionHeading
          icon={Users}
          className="justify-center border-b border-ink/20 pb-1 text-xs tracking-[0.2em] text-ink"
        >
          Referanslar
        </SectionHeading>
        <div className="mt-3 flex flex-col gap-1 text-center text-xs text-ink-secondary">
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
    <div className="flex flex-col font-serif">
      <header className="flex flex-col items-center text-center">
        {personalInfo.photoDataUrl && (
          <img
            src={personalInfo.photoDataUrl}
            alt={personalInfo.fullName || 'Profil fotoğrafı'}
            className="mb-3 h-20 w-20 rounded-full object-cover"
          />
        )}
        <h1 className={`text-2xl font-bold tracking-wide ${accent.textClass}`}>
          {personalInfo.fullName || 'Ad Soyad'}
        </h1>
        {personalInfo.title && (
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-ink-secondary">
            {personalInfo.title}
          </p>
        )}
        <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-ink-secondary">
          {[personalInfo.email, personalInfo.phone, personalInfo.location]
            .filter(Boolean)
            .map((value, index) => (
              <span key={value}>
                {index > 0 && <span className="mr-3 text-ink-muted">|</span>}
                {value}
              </span>
            ))}
        </div>
        <div className="mx-auto mt-3 w-24 border-t border-ink/40" />
      </header>

      {data.sectionOrder.map((key) => (
        <Fragment key={key}>{sectionRenderers[key]}</Fragment>
      ))}
    </div>
  )
}
