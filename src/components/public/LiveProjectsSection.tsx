import { ExternalLink, Rocket } from 'lucide-react'
import type { Project } from '../../types/project'
import { normalizeUrl } from '../../utils/formatters'

type LiveProjectsSectionProps = {
  projects: Project[]
}

export default function LiveProjectsSection({
  projects,
}: LiveProjectsSectionProps) {
  return (
    <section id="projetos" className="border-b border-white/10 py-20">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
              <Rocket className="h-5 w-5" />
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Projetos fechados
            </h2>
            <p className="mt-4 text-slate-300">
              Portfólio público para demosntrar soluções digitais que já estão em operação.
            </p>
          </div>
        </div>
        {projects.length === 0 ? (
          <div className="glass-panel mt-10 rounded-lg p-8 text-center">
            <p className="text-lg font-semibold text-white">
              Em breve, novos projetos em funcionamento serão exibidos aqui.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {projects.map((project) => {
              const projectUrl = normalizeUrl(project.domainUrl || project.appUrl)

              return (
                <article key={project.id} className="neon-card p-5">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {project.publicName || project.projectName}
                      </h3>
                      <p className="mt-3 leading-7 text-slate-300">
                        {project.publicDescription ||
                          'Solução digital personalizada em operação.'}
                      </p>
                    </div>
                    {projectUrl ? (
                      <a
                        href={projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="primary-button shrink-0"
                      >
                        Acessar
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="ghost-button shrink-0 opacity-60">
                        Link indisponível
                      </span>
                    )}
                  </div>
                  {project.technologies.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.technologies.map((technology) => (
                        <span key={technology} className="chip">
                          {technology}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
