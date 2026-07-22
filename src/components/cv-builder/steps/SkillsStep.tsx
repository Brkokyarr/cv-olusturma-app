import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../ui/Button'
import { Field } from '../../ui/Field'
import { Input } from '../../ui/Input'

interface SkillsStepProps {
  skills: string[]
  onChange: (skills: string[]) => void
}

export function SkillsStep({ skills, onChange }: SkillsStepProps) {
  const [draft, setDraft] = useState('')

  function addSkill() {
    const value = draft.trim()
    if (!value || skills.includes(value)) {
      setDraft('')
      return
    }
    onChange([...skills, value])
    setDraft('')
  }

  function removeSkill(skill: string) {
    onChange(skills.filter((item) => item !== skill))
  }

  return (
    <div className="flex flex-col gap-4">
      <Field
        label="Yetenek Ekle"
        htmlFor="skill-input"
        hint="Yazıp Enter'a basın veya Ekle'ye tıklayın."
      >
        <div className="flex gap-2">
          <Input
            id="skill-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addSkill()
              }
            }}
            placeholder="Örn. React"
          />
          <Button variant="secondary" onClick={addSkill}>
            <Plus className="h-4 w-4" />
            Ekle
          </Button>
        </div>
      </Field>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-muted px-3 py-1.5 text-xs font-medium text-primary"
          >
            {skill}
            <button
              type="button"
              aria-label={`${skill} yeteneğini kaldır`}
              onClick={() => removeSkill(skill)}
              className="rounded-full hover:text-text-primary"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {skills.length === 0 && (
          <p className="text-sm text-text-secondary">Henüz yetenek eklenmedi.</p>
        )}
      </div>
    </div>
  )
}
