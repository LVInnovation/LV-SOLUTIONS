import { BRAND_NAME, WHATSAPP_NUMBER } from '../../data/contact'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="section-shell flex flex-col justify-between gap-4 text-sm text-slate-400 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-white">{BRAND_NAME}</p>
          <p>Soluções digitais sob medida para operações mais eficientes.</p>
        </div>
        <div className="sm:text-right">
          <p>WhatsApp: {WHATSAPP_NUMBER}</p>
          <p>{new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  )
}
