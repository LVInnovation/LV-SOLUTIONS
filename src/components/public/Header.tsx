import { Link } from 'react-router-dom'
import BrandMark from '../BrandMark'

const navItems = [
  { label: 'Início', href: '#inicio' },
  { label: 'Ideias', href: '#ideias' },
  { label: 'Projetos em funcionamento', href: '#projetos' },
  { label: 'Orçamento', href: '#orcamento' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-2xl">
      <div className="section-shell flex min-h-20 flex-wrap items-center justify-between gap-4 py-4">
        <a href="#inicio" aria-label="Ir para o início">
          <BrandMark variant="header" />
        </a>
        <nav className="hidden items-center gap-1 text-sm text-slate-300 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 transition hover:bg-white/[0.07] hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="ghost-button px-3 py-2">
            Área Restrita
          </Link>
        </div>
      </div>
      <nav className="section-shell flex gap-2 overflow-x-auto pb-3 text-sm text-slate-300 lg:hidden">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
