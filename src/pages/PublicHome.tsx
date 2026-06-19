import Footer from '../components/public/Footer'
import Header from '../components/public/Header'
import Hero from '../components/public/Hero'
import IdeasSection from '../components/public/IdeasSection'
import LiveProjectsSection from '../components/public/LiveProjectsSection'
import WhatsAppCTA from '../components/public/WhatsAppCTA'
import { getPortfolioProjects } from '../services/projectRepository'

export default function PublicHome() {
  const portfolioProjects = getPortfolioProjects()

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
