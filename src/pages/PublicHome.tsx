import { useEffect, useState } from 'react'
import Footer from '../components/public/Footer'
import Header from '../components/public/Header'
import Hero from '../components/public/Hero'
import IdeasSection from '../components/public/IdeasSection'
import LiveProjectsSection from '../components/public/LiveProjectsSection'
import WhatsAppCTA from '../components/public/WhatsAppCTA'
import { getPortfolioProjects } from '../services/projectRepository'
import type { Project } from '../types/project'

export default function PublicHome() {
  const [portfolioProjects, setPortfolioProjects] = useState<Project[]>([])

  useEffect(() => {
    let isMounted = true

    getPortfolioProjects()
      .then((projects) => {
        if (isMounted) {
          setPortfolioProjects(projects)
        }
      })
      .catch(() => {
        if (isMounted) {
          setPortfolioProjects([])
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="page-shell">
      <Header />
      <main>
        <Hero />
        <IdeasSection />
        <LiveProjectsSection projects={portfolioProjects} />
        <WhatsAppCTA />
      </main>
      <Footer />
    </div>
  )
}
