import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ProblemSection from '@/components/ProblemSection'
import FeatureGrid from '@/components/FeatureGrid'
import PricingTable from '@/components/PricingTable'
import CaseStudySection from '@/components/CaseStudySection'
import FAQAccordion from '@/components/FAQAccordion'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ProblemSection />
      <FeatureGrid />
      <PricingTable />
      <CaseStudySection />
      <FAQAccordion />
      <CTASection />
      <Footer />
    </main>
  )
}
