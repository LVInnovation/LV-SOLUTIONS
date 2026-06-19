import { Check, Copy, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

type SecretFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
  placeholder?: string
}

export default function SecretField({
  label,
  value,
  onChange,
  readOnly = false,
  placeholder,
}: SecretFieldProps) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  async function copyValue() {
    if (!value) {
      return
    }

    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <div className="flex gap-2">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          disabled={readOnly}
          placeholder={placeholder}
          className="admin-input"
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className="ghost-button min-w-[7rem] px-3"
          onClick={() => setVisible((current) => !current)}
          title={visible ? 'Ocultar' : 'Mostrar'}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={copyValue}
          disabled={!value}
          title="Copiar"
          aria-label={`Copiar ${label}`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </label>
  )
}
