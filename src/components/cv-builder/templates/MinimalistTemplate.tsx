import { Award, Briefcase, GraduationCap, Languages as LanguagesIcon, Users, Wrench } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import type { SectionKey } from '../../../types/cv'
import type { TemplateProps } from './TemplateProps'
import { SectionHeading } from './SectionHeading'

export function MinimalistTemplate({ data, accent }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, references } = data

  const sectionRenderers: Record<SectionKey, ReactNode> = {
    summary: summary && (
      <section>
        <h2 className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink-muted">
          Hakkımda
        </h2>
        <p className="mt-2 text-sm font-light leading-relaxed text-ink">{summary}</p>
      </section>
    ),
    experience: experience.length > 0 && (
      <section>
        <SectionHeading
          icon={Briefcase}
          className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink-muted"
        >
          İş Deneyimi
        </SectionHeading>
        <div className="mt-2 flex flex-col gap-4">
          {experience.map((item) => (
            <div key={item.id}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-ink">
                  {item.position || 'Pozisyon'}
                </p>
                {(item.startDate || item.endDate) && (
                  <p className="shrink-0 text-[11px] text-ink-muted">
                    {item.startDate} — {item.endDate}
                  </p>
                )}
              </div>
              {item.company && <p className="text-xs text-ink-muted">{item.company}</p>}
              {item.description && (
                <p className="mt-1 text-xs font-light leading-relaxed text-ink-secondary">
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
        <SectionHeading
          icon={GraduationCap}
          className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink-muted"
        >
          Eğitim
        </SectionHeading>
        <div className="mt-2 flex flex-col gap-2">
          {education.map((item) => (
            <div key={item.id} className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-medium text-ink">{item.school || 'Okul'}</p>
              <p className="shrink-0 text-[11px] text-ink-muted">
                {item.startDate} — {item.endDate}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
    skills: skills.length > 0 && (
      <section>
        <SectionHeading
          icon={Wrench}
          className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink-muted"
        >
          Yetenekler
        </SectionHeading>
        <p className="mt-2 text-xs font-light text-ink-secondary">{skills.join('   ·   ')}</p>
      </section>
    ),
    languages: languages.length > 0 && (
      <section>
        <SectionHeading
          icon={LanguagesIcon}
          className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink-muted"
        >
          Diller
        </SectionHeading>
        <p className="mt-2 text-xs font-light text-ink-secondary">
          {languages.map((item) => `${item.name || 'Dil'} — ${item.level}`).join('   ·   ')}
        </p>
      </section>
    ),
    certificates: certificates.length > 0 && (
      <section>
        <SectionHeading
          icon={Award}
          className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink-muted"
        >
          Sertifikalar
        </SectionHeading>
        <div className="mt-2 flex flex-col gap-1 text-xs font-light text-ink-secondary">
          {certificates.map((item) => (
            <span key={item.id}>
              {item.name} {item.issuer && `— ${item.issuer}`} {item.year && `(${item.year})`}
            </span>
          ))}
        </div>
      </section>
    ),
    references: references.length > 0 && (
      <section>
        <SectionHeading
          icon={Users}
          className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink-muted"
        >
          Referanslar
        </SectionHeading>
        <div className="mt-2 flex flex-col gap-1 text-xs font-light text-ink-secondary">
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
    <div className={`flex flex-col gap-6 border-l-2 pl-5 ${accent.borderClass}`}>
      <header className="flex items-center gap-4">
        {personalInfo.photoDataUrl && (
          <img
            src={personalInfo.photoDataUrl}
            alt={personalInfo.fullName || 'Profil fotoğrafı'}
            className="h-14 w-14 shrink-0 object-cover"
          />
        )}
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">
            {personalInfo.fullName || 'Ad Soyad'}
          </h1>
          {personalInfo.title && (
            <p className="mt-0.5 text-xs text-ink-muted">{personalInfo.title}</p>
          )}
          <p className="mt-3 text-[11px] tracking-wide text-ink-muted">
            {[personalInfo.email, personalInfo.phone, personalInfo.location]
              .filter(Boolean)
              .join('   ·   ')}
          </p>
        </div>
      </header>

      {data.sectionOrder.map((key) => (
        <Fragment key={key}>{sectionRenderers[key]}</Fragment>
      ))}
    </div>
  )
}
