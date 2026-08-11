import { Navbar } from "@/components/ui/navbar"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { Hero } from "@/components/sections/hero"
import { TechMarquee } from "@/components/sections/tech-marquee"
import { Sobre } from "@/components/sections/sobre"
import { Problema } from "@/components/sections/problema"
import { Servicos } from "@/components/sections/servicos"
import { ComoFunciona } from "@/components/sections/como-funciona"
import { Cases } from "@/components/sections/cases"
import { Resultados } from "@/components/sections/resultados"
import { Mentoria } from "@/components/sections/mentoria"
import { Produtos } from "@/components/sections/produtos"
import { Quote } from "@/components/sections/quote"
import { Faq } from "@/components/sections/faq"
import { CtaFinal } from "@/components/sections/cta-final"
import { Footer } from "@/components/sections/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Navbar />

      <main>
        <Hero />
        <TechMarquee />
        <Sobre />
        <Problema />
        <Servicos />
        <ComoFunciona />
        <Cases />
        <Resultados />
        <Mentoria />
        {/* Oculta até NEXT_PUBLIC_SHOW_PRODUCTS=true */}
        <Produtos />
        <Quote />
        <Faq />
        <CtaFinal />
      </main>

      <Footer />
    </div>
  )
}
