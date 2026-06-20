import { ArrowDown, MessageCircle, Sparkles } from 'lucide-react'
import { WHATSAPP_LINK } from '../../data/contact'

export default function Hero() {
  function scrollToProjects() {
    document.getElementById('projetos')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden border-b border-white/10 bg-slate-950"
    >
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-80"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(2,4,11,0.98) 0%, rgba(2,4,11,0.86) 36%, rgba(2,4,11,0.42) 72%, rgba(2,4,11,0.78) 100%), url(/hero-tech.png)',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_22%_28%,rgba(48,210,255,0.18),transparent_28rem),radial-gradient(circle_at_72%_42%,rgba(220,80,255,0.2),transparent_25rem)]" />
      <div className="section-shell flex min-h-[78svh] items-center py-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-sm font-medium text-cyan-100 shadow-lg shadow-cyan-500/10">
            <Sparkles className="h-4 w-4" />
            Tech premium para operações reais
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-7xl">
            Sistemas personalizados para transformar sua operação
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Desenvolvimento de soluções digitais sob medida para empresas,
            profissionais autônomos e pequenos negócios.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="primary-button"
            >
              <MessageCircle className="h-5 w-5" />
              Solicitar orçamento
            </a>
            <button
              type="button"
              className="secondary-button"
              onClick={scrollToProjects}
            >
              <ArrowDown className="h-5 w-5" />
              Ver projetos em funcionamento
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
