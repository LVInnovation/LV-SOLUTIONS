import { MessageCircle } from 'lucide-react'
import { WHATSAPP_LINK } from '../../data/contact'

export default function WhatsAppCTA() {
  return (
    <section id="orcamento" className="py-20">
      <div className="section-shell">
        <div className="glass-panel overflow-hidden rounded-lg p-8 sm:p-10">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Tem uma ideia ou precisa de um sistema para seu negócio?
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Entre em contato pelo WhatsApp e solicite um orçamento
              personalizado.
            </p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="primary-button mt-8 w-full sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              Solicitar orçamento pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
