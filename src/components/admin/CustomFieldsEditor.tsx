import { Plus, Trash2 } from 'lucide-react'
import type { CustomField } from '../../types/project'
import { createId } from '../../utils/dates'
import SecretField from './SecretField'

type CustomFieldsEditorProps = {
  fields: CustomField[]
  onChange: (fields: CustomField[]) => void
  readOnly?: boolean
}

export default function CustomFieldsEditor({
  fields,
  onChange,
  readOnly = false,
}: CustomFieldsEditorProps) {
  function updateField(id: string, updates: Partial<CustomField>) {
    onChange(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field,
      ),
    )
  }

  function addField() {
    onChange([
      ...fields,
      {
        id: createId(),
        label: '',
        value: '',
        isSecret: false,
      },
    ])
  }

  function removeField(id: string) {
    onChange(fields.filter((field) => field.id !== id))
  }

  return (
    <section className="admin-section">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="admin-section-title mb-0">Campos personalizados</h2>
        <button
          type="button"
          className="ghost-button"
          onClick={addField}
          disabled={readOnly}
        >
          <Plus className="h-4 w-4" />
          Adicionar campo
        </button>
      </div>
      {fields.length === 0 ? (
        <p className="rounded-lg border border-dashed border-white/10 bg-white/[0.025] p-4 text-sm text-slate-400">
          Nenhum campo personalizado adicionado.
        </p>
      ) : (
        <div className="space-y-4">
          {fields.map((field) => (
            <div
              key={field.id}
              className="rounded-lg border border-white/10 bg-slate-950/45 p-4"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr_auto] lg:items-end">
                <label>
                  <span className="field-label">Nome do campo</span>
                  <input
                    value={field.label}
                    disabled={readOnly}
                    className="admin-input"
                    placeholder="Conta Google"
                    onChange={(event) =>
                      updateField(field.id, { label: event.target.value })
                    }
                  />
                </label>
                {field.isSecret ? (
                  <SecretField
                    label="Valor"
                    value={field.value}
                    readOnly={readOnly}
                    placeholder="Valor sensível"
                    onChange={(value) => updateField(field.id, { value })}
                  />
                ) : (
                  <label>
                    <span className="field-label">Valor</span>
                    <input
                      value={field.value}
                      disabled={readOnly}
                      className="admin-input"
                      placeholder="Valor"
                      onChange={(event) =>
                        updateField(field.id, { value: event.target.value })
                      }
                    />
                  </label>
                )}
                <button
                  type="button"
                  className="danger-button"
                  onClick={() => removeField(field.id)}
                  disabled={readOnly}
                >
                  <Trash2 className="h-4 w-4" />
                  Remover
                </button>
              </div>
              <label className="mt-4 flex items-center gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={field.isSecret}
                  disabled={readOnly}
                  className="h-4 w-4 accent-cyan-300"
                  onChange={(event) =>
                    updateField(field.id, { isSecret: event.target.checked })
                  }
                />
                Campo sensível?
              </label>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
