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
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { SectionHeading } from './SectionHeading'
import type { TemplateProps } from './TemplateProps'

const LANGUAGE_LEVELS = ['Başlangıç', 'Orta', 'İyi', 'Akıcı', 'Anadil']
const SKILL_BAR_WIDTH_CLASSES = ['w-full', 'w-11/12', 'w-5/6', 'w-4/5', 'w-3/4', 'w-2/3']

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

function SidebarCard({
  icon,
  title,
  accentBorderClass,
  children,
}: {
  icon: LucideIcon
  title: string
  accentBorderClass: string
  children: ReactNode
}) {
  return (
    <div className={`rounded-xl border-t-4 bg-ink/[0.03] p-3 ${accentBorderClass}`}>
      <SectionHeading icon={icon} className="text-xs text-ink-secondary">
        {title}
      </SectionHeading>
      <div className="mt-2">{children}</div>
    </div>
  )
}

export function AfisTemplate({ data, accent }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, references } = data

  return (
    <div className="flex flex-col">
      <header
        className={`-mx-8 -mt-8 mb-6 grid grid-cols-[auto_1fr] items-center gap-5 rounded-b-3xl px-8 py-7 ${accent.bgClass}`}
      >
        {personalInfo.photoDataUrl ? (
          <img
            src={personalInfo.photoDataUrl}
            alt={personalInfo.fullName || 'Profil fotoğrafı'}
            className="h-24 w-24 shrink-0 rounded-2xl border-2 border-white/60 object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold text-white">
            {initials(personalInfo.fullName)}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-extrabold leading-tight text-white">
            {personalInfo.fullName || 'Ad Soyad'}
          </h1>
          {personalInfo.title && (
            <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-white/80">
              {personalInfo.title}
            </p>
          )}
        </div>
      </header>

      <div className="grid grid-cols-[1fr_1.6fr] gap-6">
        <aside className="flex flex-col gap-4">
          <SidebarCard icon={Mail} title="İletişim" accentBorderClass={accent.borderClass}>
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
            </div>
          </SidebarCard>

          {skills.length > 0 && (
            <SidebarCard icon={Wrench} title="Yetenekler" accentBorderClass={accent.borderClass}>
              <div className="flex flex-col gap-2">
                {skills.map((skill, index) => (
                  <div key={skill}>
                    <p className="text-xs text-ink">{skill}</p>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                      <div
                        className={`h-full rounded-full ${accent.bgClass} ${SKILL_BAR_WIDTH_CLASSES[index % SKILL_BAR_WIDTH_CLASSES.length]}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SidebarCard>
          )}

          {languages.length > 0 && (
            <SidebarCard icon={LanguagesIcon} title="Diller" accentBorderClass={accent.borderClass}>
              <div className="flex flex-col gap-1.5 text-xs text-ink-secondary">
                {languages.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-2">
                    <span>{item.name || 'Dil'}</span>
                    <LevelDots level={item.level} accentBgClass={accent.bgClass} />
                  </div>
                ))}
              </div>
            </SidebarCard>
          )}

          {certificates.length > 0 && (
            <SidebarCard icon={Award} title="Sertifikalar" accentBorderClass={accent.borderClass}>
              <div className="flex flex-col gap-1 text-xs text-ink-secondary">
                {certificates.map((item) => (
                  <span key={item.id}>
                    {item.name} {item.issuer && `— ${item.issuer}`} {item.year && `(${item.year})`}
                  </span>
                ))}
              </div>
            </SidebarCard>
          )}
        </aside>

        <main className="flex flex-col gap-5">
          {summary && (
            <section>
              <SectionHeading icon={User} className={`text-xs ${accent.textClass}`}>
                Hakkımda
              </SectionHeading>
              <p className="mt-1.5 text-sm leading-relaxed text-ink">{summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <SectionHeading icon={Briefcase} className={`text-xs ${accent.textClass}`}>
                İş Deneyimi
              </SectionHeading>
              <div className="mt-2 flex flex-col gap-3">
                {experience.map((item) => (
                  <div key={item.id} className={`border-l-4 pl-4 ${accent.borderClass}`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-ink">
                        {item.position || 'Pozisyon'}
                        {item.company && ` · ${item.company}`}
                      </p>
                      {(item.startDate || item.endDate) && (
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${accent.softBgClass} ${accent.textClass}`}
                        >
                          {item.startDate} — {item.endDate}
                        </span>
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
          )}

          {education.length > 0 && (
            <section>
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
          )}

          {references.length > 0 && (
            <section>
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
          )}
        </main>
      </div>
    </div>
  )
}
