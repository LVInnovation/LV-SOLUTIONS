import {
  BriefcaseBusiness,
  Check,
  Copy,
  CreditCard,
  Database,
  GitBranch,
  Globe2,
  KeyRound,
  NotebookText,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import type { Project } from '../../types/project'
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_OPTIONS,
} from '../../types/project'
import { formatCurrency, formatDateBR, formatTechnologies, parseTechnologies } from '../../utils/formatters'
import { calculatePaymentStatus } from '../../utils/paymentStatus'
import CustomFieldsEditor from './CustomFieldsEditor'
import SecretField from './SecretField'

type ProjectFormProps = {
  project: Project
  onChange: (project: Project) => void
  readOnly?: boolean
}

type TextInputProps = {
  label: string
  value: string | number
  onChange: (value: string) => void
  readOnly?: boolean
  placeholder?: string
  type?: string
  min?: number
  max?: number
  copyable?: boolean
}

type SectionProps = {
  title: string
  icon: LucideIcon
  children: React.ReactNode
}

function Section({ title, icon: Icon, children }: SectionProps) {
  return (
    <section className="admin-section">
      <h2 className="admin-section-title">
        <Icon className="h-5 w-5 text-cyan-200" />
        {title}
      </h2>
      {children}
    </section>
  )
}

function TextInput({
  label,
  value,
  onChange,
  readOnly = false,
  placeholder,
  type = 'text',
  min,
  max,
  copyable = false,
}: TextInputProps) {
  const [copied, setCopied] = useState(false)
  const input = (
    <input
      type={type}
      min={min}
      max={max}
      value={value}
      disabled={readOnly}
      placeholder={placeholder}
      className="admin-input"
      onChange={(event) => onChange(event.target.value)}
    />
  )

  async function copyValue() {
    const text = String(value)

    if (!text) {
      return
    }

    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {copyable ? (
        <div className="flex gap-2">
          {input}
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
      ) : (
        input
      )}
    </label>
  )
}

function TextArea({
  label,
  value,
  onChange,
  readOnly = false,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <textarea
        value={value}
        disabled={readOnly}
        placeholder={placeholder}
        className="admin-input min-h-32 resize-y"
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function BooleanField({
  label,
  checked,
  onChange,
  readOnly = false,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  readOnly?: boolean
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-200">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        disabled={readOnly}
        className="h-5 w-5 accent-cyan-300"
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  )
}

export default function ProjectForm({
  project,
  onChange,
  readOnly = false,
}: ProjectFormProps) {
  function update<K extends keyof Project>(field: K, value: Project[K]) {
    onChange({ ...project, [field]: value })
  }

  const payment = calculatePaymentStatus(
    project.dueDay,
    project.lastPaymentDate,
    project.projectStatus,
  )

  return (
    <div className="space-y-5">
      <Section title="Cliente" icon={UserRound}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Nome do cliente/dono"
            value={project.clientName}
            readOnly={readOnly}
            placeholder="Nome do cliente"
            onChange={(value) => update('clientName', value)}
          />
          <TextInput
            label="Telefone"
            value={project.clientPhone}
            readOnly={readOnly}
            placeholder="(11) 99999-9999"
            copyable
            onChange={(value) => update('clientPhone', value)}
          />
          <TextInput
            label="Email"
            value={project.clientEmail}
            readOnly={readOnly}
            placeholder="cliente@email.com"
            copyable
            onChange={(value) => update('clientEmail', value)}
          />
          <SecretField
            label="Login do cliente"
            value={project.clientLogin}
            readOnly={readOnly}
            onChange={(value) => update('clientLogin', value)}
          />
          <SecretField
            label="Senha do cliente"
            value={project.clientPassword}
            readOnly={readOnly}
            onChange={(value) => update('clientPassword', value)}
          />
        </div>
      </Section>

      <Section title="Projeto" icon={BriefcaseBusiness}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Nome do projeto"
            value={project.projectName}
            readOnly={readOnly}
            placeholder="Elegance Space"
            onChange={(value) => update('projectName', value)}
          />
          <TextInput
            label="Nome público do projeto"
            value={project.publicName}
            readOnly={readOnly}
            placeholder="Nome exibido no portfólio"
            onChange={(value) => update('publicName', value)}
          />
          <label>
            <span className="field-label">Status do projeto</span>
            <select
              value={project.projectStatus}
              disabled={readOnly}
              className="admin-input"
              onChange={(event) =>
                update(
                  'projectStatus',
                  event.target.value as Project['projectStatus'],
                )
              }
            >
              {PROJECT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <TextInput
            label="Data de criação"
            value={formatDateBR(project.createdAt.slice(0, 10))}
            readOnly
            onChange={() => undefined}
          />
          <TextInput
            label="Data/mês de implantação"
            type="month"
            value={project.implementationDate}
            readOnly={readOnly}
            onChange={(value) => update('implementationDate', value)}
          />
          <TextInput
            label="Link do sistema/app"
            value={project.appUrl}
            readOnly={readOnly}
            placeholder="https://app.exemplo.com"
            copyable
            onChange={(value) => update('appUrl', value)}
          />
          <div className="md:col-span-2">
            <TextInput
              label="Tecnologias usadas"
              value={formatTechnologies(project.technologies)}
              readOnly={readOnly}
              placeholder="React, Vite, Tailwind"
              onChange={(value) => update('technologies', parseTechnologies(value))}
            />
          </div>
          <div className="md:col-span-2">
            <TextArea
              label="Descrição curta pública"
              value={project.publicDescription}
              readOnly={readOnly}
              placeholder="Resumo para aparecer no site público"
              onChange={(value) => update('publicDescription', value)}
            />
          </div>
          <div className="md:col-span-2">
            <TextArea
              label="Descrição interna"
              value={project.internalDescription}
              readOnly={readOnly}
              placeholder="Detalhes internos do projeto"
              onChange={(value) => update('internalDescription', value)}
            />
          </div>
        </div>
      </Section>

      <Section title="Financeiro" icon={CreditCard}>
        <div className="mb-5 grid gap-4 rounded-lg border border-white/10 bg-slate-950/45 p-4 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase text-slate-500">Situação</p>
            <p className="mt-1 text-lg font-semibold text-white">{payment.label}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Status</p>
            <p className="mt-1 font-semibold text-slate-100">
              {PROJECT_STATUS_LABELS[project.projectStatus]}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Mensalidade</p>
            <p className="mt-1 font-semibold text-slate-100">
              {formatCurrency(project.monthlyValue)}
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Valor de implantação"
            type="number"
            min={0}
            value={project.implementationValue}
            readOnly={readOnly}
            onChange={(value) => update('implementationValue', Number(value) || 0)}
          />
          <TextInput
            label="Valor da mensalidade"
            type="number"
            min={0}
            value={project.monthlyValue}
            readOnly={readOnly}
            onChange={(value) => update('monthlyValue', Number(value) || 0)}
          />
          <TextInput
            label="Dia de vencimento"
            type="number"
            min={1}
            max={31}
            value={project.dueDay}
            readOnly={readOnly}
            onChange={(value) => update('dueDay', Number(value) || 1)}
          />
          <TextInput
            label="Último pagamento"
            type="date"
            value={project.lastPaymentDate}
            readOnly={readOnly}
            onChange={(value) => update('lastPaymentDate', value)}
          />
        </div>
      </Section>

      <Section title="GitHub" icon={GitBranch}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Login GitHub"
            value={project.githubLogin}
            readOnly={readOnly}
            onChange={(value) => update('githubLogin', value)}
          />
          <TextInput
            label="Repositório"
            value={project.githubRepository}
            readOnly={readOnly}
            onChange={(value) => update('githubRepository', value)}
          />
          <TextInput
            label="Link GitHub"
            value={project.githubUrl}
            readOnly={readOnly}
            copyable
            onChange={(value) => update('githubUrl', value)}
          />
          <TextInput
            label="Branch principal"
            value={project.githubBranch}
            readOnly={readOnly}
            onChange={(value) => update('githubBranch', value)}
          />
        </div>
      </Section>

      <Section title="Vercel" icon={Globe2}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Login Vercel"
            value={project.vercelLogin}
            readOnly={readOnly}
            onChange={(value) => update('vercelLogin', value)}
          />
          <TextInput
            label="Nome do projeto na Vercel"
            value={project.vercelProjectName}
            readOnly={readOnly}
            onChange={(value) => update('vercelProjectName', value)}
          />
          <TextInput
            label="Link do projeto na Vercel"
            value={project.vercelProjectUrl}
            readOnly={readOnly}
            copyable
            onChange={(value) => update('vercelProjectUrl', value)}
          />
          <TextInput
            label="Domínio/URL pública"
            value={project.domainUrl}
            readOnly={readOnly}
            copyable
            onChange={(value) => update('domainUrl', value)}
          />
        </div>
      </Section>

      <Section title="Supabase" icon={Database}>
        <div className="mb-4 rounded-lg border border-cyan-300/15 bg-cyan-300/5 p-4 text-sm leading-6 text-cyan-100/85">
          Campos apenas para guardar referência manual nesta V1. Não há conexão
          com Supabase neste protótipo.
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Login Supabase"
            value={project.supabaseLogin}
            readOnly={readOnly}
            onChange={(value) => update('supabaseLogin', value)}
          />
          <TextInput
            label="Link Supabase"
            value={project.supabaseProjectUrl}
            readOnly={readOnly}
            copyable
            onChange={(value) => update('supabaseProjectUrl', value)}
          />
          <TextInput
            label="Project Ref"
            value={project.supabaseProjectRef}
            readOnly={readOnly}
            copyable
            onChange={(value) => update('supabaseProjectRef', value)}
          />
          <TextInput
            label="API URL"
            value={project.supabaseApiUrl}
            readOnly={readOnly}
            copyable
            onChange={(value) => update('supabaseApiUrl', value)}
          />
          <SecretField
            label="Publishable Key"
            value={project.supabasePublishableKey}
            readOnly={readOnly}
            onChange={(value) => update('supabasePublishableKey', value)}
          />
          <SecretField
            label="Secret Key"
            value={project.supabaseSecretKey}
            readOnly={readOnly}
            onChange={(value) => update('supabaseSecretKey', value)}
          />
          <TextInput
            label="Host"
            value={project.supabaseHost}
            readOnly={readOnly}
            copyable
            onChange={(value) => update('supabaseHost', value)}
          />
          <TextInput
            label="Port"
            value={project.supabasePort}
            readOnly={readOnly}
            onChange={(value) => update('supabasePort', value)}
          />
          <TextInput
            label="Database"
            value={project.supabaseDatabase}
            readOnly={readOnly}
            onChange={(value) => update('supabaseDatabase', value)}
          />
          <TextInput
            label="User"
            value={project.supabaseUser}
            readOnly={readOnly}
            copyable
            onChange={(value) => update('supabaseUser', value)}
          />
          <SecretField
            label="Database Password"
            value={project.supabaseDatabasePassword}
            readOnly={readOnly}
            onChange={(value) => update('supabaseDatabasePassword', value)}
          />
        </div>
      </Section>

      <Section title="Portfólio público" icon={ShieldCheck}>
        <div className="grid gap-4">
          <BooleanField
            label="Exibir no site público?"
            checked={project.showInPortfolio}
            readOnly={readOnly}
            onChange={(checked) => update('showInPortfolio', checked)}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Nome público do projeto"
              value={project.publicName}
              readOnly={readOnly}
              onChange={(value) => update('publicName', value)}
            />
            <TextInput
              label="Link público de acesso"
              value={project.domainUrl}
              readOnly={readOnly}
              copyable
              onChange={(value) => update('domainUrl', value)}
            />
            <div className="md:col-span-2">
              <TextInput
                label="Tecnologias usadas"
                value={formatTechnologies(project.technologies)}
                readOnly={readOnly}
                placeholder="React, Vite, Tailwind"
                onChange={(value) =>
                  update('technologies', parseTechnologies(value))
                }
              />
            </div>
            <div className="md:col-span-2">
              <TextArea
                label="Descrição curta pública"
                value={project.publicDescription}
                readOnly={readOnly}
                onChange={(value) => update('publicDescription', value)}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Observações" icon={NotebookText}>
        <TextArea
          label="Anotações"
          value={project.notes}
          readOnly={readOnly}
          placeholder="Observações livres sobre contrato, alterações ou suporte"
          onChange={(value) => update('notes', value)}
        />
      </Section>

      <CustomFieldsEditor
        fields={project.customFields}
        readOnly={readOnly}
        onChange={(customFields) => update('customFields', customFields)}
      />

      <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-slate-400">
        <div className="mb-2 flex items-center gap-2 text-slate-200">
          <KeyRound className="h-4 w-4 text-cyan-200" />
          Segurança V1
        </div>
        Login fixo e localStorage são apenas para protótipo. Para produção,
        migrar para Supabase Auth e banco com criptografia.
      </div>
    </div>
  )
}
