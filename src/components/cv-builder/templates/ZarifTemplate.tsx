import { Fragment, type ReactNode } from 'react'
import type { SectionKey } from '../../../types/cv'
import type { TemplateProps } from './TemplateProps'

function ZarifHeading({ children, accentTextClass }: { children: ReactNode; accentTextClass: string }) {
  return (
    <h2
      className={`border-b border-ink/15 pb-1 text-[11px] font-semibold uppercase tracking-[0.3em] ${accentTextClass}`}
    >
      {children}
    </h2>
  )
}

export function ZarifTemplate({ data, accent }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, references, customFields } =
    data

  const sectionRenderers: Record<SectionKey, ReactNode> = {
    summary: summary && (
      <section className="mt-6">
        <ZarifHeading accentTextClass={accent.textClass}>Hakkımda</ZarifHeading>
        <p className="mt-2 text-sm font-light leading-relaxed text-ink">{summary}</p>
      </section>
    ),
    experience: experience.length > 0 && (
      <section className="mt-6">
        <ZarifHeading accentTextClass={accent.textClass}>İş Deneyimi</ZarifHeading>
        <div className="mt-3 flex flex-col gap-4">
          {experience.map((item) => (
            <div key={item.id}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-serif text-sm font-semibold text-ink">
                  {item.position || 'Pozisyon'}
                </p>
                {(item.startDate || item.endDate) && (
                  <p className="shrink-0 text-[11px] tracking-wide text-ink-muted">
                    {item.startDate} — {item.endDate}
                  </p>
                )}
              </div>
              {item.company && (
                <p className={`text-xs italic ${accent.textClass}`}>{item.company}</p>
              )}
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
      <section className="mt-6">
        <ZarifHeading accentTextClass={accent.textClass}>Eğitim</ZarifHeading>
        <div className="mt-3 flex flex-col gap-2">
          {education.map((item) => (
            <div key={item.id} className="flex items-baseline justify-between gap-2">
              <p className="font-serif text-sm font-semibold text-ink">
                {item.school || 'Okul'}
                {item.field && <span className="font-sans text-xs font-normal text-ink-secondary"> · {item.field}</span>}
              </p>
              {(item.startDate || item.endDate) && (
                <p className="shrink-0 text-[11px] tracking-wide text-ink-muted">
                  {item.startDate} — {item.endDate}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    ),
    skills: skills.length > 0 && (
      <section className="mt-6">
        <ZarifHeading accentTextClass={accent.textClass}>Yetenekler</ZarifHeading>
        <p className="mt-2 text-xs font-light leading-relaxed text-ink-secondary">
          {skills.join('  ·  ')}
        </p>
      </section>
    ),
    languages: languages.length > 0 && (
      <section className="mt-6">
        <ZarifHeading accentTextClass={accent.textClass}>Diller</ZarifHeading>
        <p className="mt-2 text-xs font-light leading-relaxed text-ink-secondary">
          {languages.map((item) => `${item.name || 'Dil'} (${item.level})`).join('  ·  ')}
        </p>
      </section>
    ),
    certificates: certificates.length > 0 && (
      <section className="mt-6">
        <ZarifHeading accentTextClass={accent.textClass}>Sertifikalar</ZarifHeading>
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
      <section className="mt-6">
        <ZarifHeading accentTextClass={accent.textClass}>Referanslar</ZarifHeading>
        <div className="mt-2 flex flex-col gap-1 text-xs font-light text-ink-secondary">
          {references.map((item) => (
            <span key={item.id}>
              {item.name} {item.relation && `— ${item.relation}`} {item.contact && `· ${item.contact}`}
            </span>
          ))}
        </div>
      </section>
    ),
    customFields: customFields.length > 0 && (
      <section className="mt-6">
        <ZarifHeading accentTextClass={accent.textClass}>Ek Bilgiler</ZarifHeading>
        <div className="mt-2 flex flex-col gap-1 text-xs font-light text-ink-secondary">
          {customFields.map((item) => (
            <span key={item.id}>
              <span className="font-medium text-ink">{item.label || 'Kategori'}:</span> {item.value}
            </span>
          ))}
        </div>
      </section>
    ),
  }

  return (
    <div className="flex flex-col">
      <header className="flex items-center gap-5">
        {personalInfo.photoDataUrl && (
          <img
            src={personalInfo.photoDataUrl}
            alt={personalInfo.fullName || 'Profil fotoğrafı'}
            className="h-20 w-20 shrink-0 rounded-full object-cover grayscale"
          />
        )}
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-wide text-ink">
            {personalInfo.fullName || 'Ad Soyad'}
          </h1>
          {personalInfo.title && (
            <p className={`mt-1 text-xs uppercase tracking-[0.2em] ${accent.textClass}`}>
              {personalInfo.title}
            </p>
          )}
        </div>
      </header>

      <div className={`mt-4 h-px w-full ${accent.bgClass}`} />

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] tracking-wide text-ink-muted">
        {[personalInfo.email, personalInfo.phone, personalInfo.location]
          .filter(Boolean)
          .map((value, index) => (
            <span key={value}>
              {index > 0 && <span className="mr-3 text-ink-muted">•</span>}
              {value}
            </span>
          ))}
      </div>

      {data.sectionOrder.map((key) => (
        <Fragment key={key}>{sectionRenderers[key]}</Fragment>
      ))}
    </div>
  )
}
