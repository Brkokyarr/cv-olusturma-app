import { Field } from '../../ui/Field'
import { Textarea } from '../../ui/Textarea'

interface SummaryStepProps {
  summary: string
  onChange: (value: string) => void
}

export function SummaryStep({ summary, onChange }: SummaryStepProps) {
  return (
    <Field
      label="Kısa Özet / Hakkımda"
      htmlFor="summary"
      hint="2-3 cümlede kendinizi ve kariyer hedefinizi anlatın."
    >
      <Textarea
        id="summary"
        rows={6}
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Örn. 3 yıllık deneyime sahip, kullanıcı deneyimine önem veren bir frontend geliştiricisiyim..."
      />
    </Field>
  )
}
