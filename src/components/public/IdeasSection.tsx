import {
  BarChart3,
  CalendarCheck,
  CircleDollarSign,
  LayoutDashboard,
  Package,
  PlugZap,
  Scissors,
  Settings2,
  Smartphone,
  Sparkles,
  UserRoundCog,
  UsersRound,
  Wrench,
} from 'lucide-react'
import { ideas } from '../../data/ideas'

const icons = [
  Scissors,
  CalendarCheck,
  CircleDollarSign,
  UsersRound,
  Package,
  PlugZap,
  BarChart3,
  LayoutDashboard,
  Wrench,
  Smartphone,
  Settings2,
  UserRoundCog,
]

export default function IdeasSection() {
  return (
    <section id="ideias" className="border-b border-white/10 py-20">
      <div className="section-shell">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-100">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ideias de projetos
          </h2>
          <p className="mt-4 text-slate-300">
            Soluções que podem ser criadas e adaptadas para diferentes tipos de
            negócio.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ideas.map((idea, index) => {
            const Icon = icons[index] ?? Sparkles

            return (
              <article key={idea} className="neon-card p-4 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    {idea}
                  </h3>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
