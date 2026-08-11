import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Sobre from '../components/Sobre'
import Problema from '../components/Problema'
import Servicos from '../components/Servicos'
import ComoFunciona from '../components/ComoFunciona'
import Cases from '../components/Cases'
import Resultados from '../components/Resultados'
import Mentoria from '../components/Mentoria'
import Produtos from '../components/Produtos'
import Quote from '../components/Quote'
import Contato from '../components/Contato'
import Footer from '../components/Footer'

export default function Site() {
  return (
    <>
      <Navbar />
      <Hero />
      <Sobre />
      <Problema />
      <Servicos />
      <ComoFunciona />
      <Cases />
      <Resultados />
      <Mentoria />
      <Produtos />
      <Quote />
      <Contato />
      <Footer />
    </>
  )
}
