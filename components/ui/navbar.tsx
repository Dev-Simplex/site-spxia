"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/lib/i18n/context"

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const defaultTextColor = "text-gray-300"
  const hoverTextColor = "text-white"
  const textSizeClass = "text-sm"

  return (
    // Janela de 20px (h-5) sobre duas cópias empilhadas do rótulo: o hover sobe
    // metade do bloco e troca uma pela outra. Por isso o alinhamento é no topo
    // (items-center mostraria metade de cada) e o bloco não encolhe nem quebra
    // — sem shrink-0/nowrap os rótulos apareciam cortados ("SOBRI").
    <a
      href={href}
      className={`group relative flex h-5 items-start overflow-hidden ${textSizeClass}`}
    >
      <div className="flex shrink-0 flex-col whitespace-nowrap transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={`leading-5 ${defaultTextColor}`}>{children}</span>
        <span className={`leading-5 ${hoverTextColor}`}>{children}</span>
      </div>
    </a>
  )
}

export function Navbar() {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [headerShapeClass, setHeaderShapeClass] = useState("rounded-full")
  // overflow-hidden é necessário durante a animação de expansão/colapso do menu
  // mobile, mas cortaria o dropdown do seletor de idioma — liberar após expandir.
  const [mobileMenuOverflowClass, setMobileMenuOverflowClass] = useState("overflow-hidden")
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const overflowTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current)
    }
    if (overflowTimeoutRef.current) {
      clearTimeout(overflowTimeoutRef.current)
    }

    if (isOpen) {
      setHeaderShapeClass("rounded-xl")
      overflowTimeoutRef.current = setTimeout(() => {
        setMobileMenuOverflowClass("overflow-visible")
      }, 300)
    } else {
      setMobileMenuOverflowClass("overflow-hidden")
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass("rounded-full")
      }, 300)
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current)
      }
      if (overflowTimeoutRef.current) {
        clearTimeout(overflowTimeoutRef.current)
      }
    }
  }, [isOpen])

  const logoElement = (
    <Link href="/" aria-label="SPXIA, página inicial" className="flex items-center">
      <Logo width={84} height={28} />
    </Link>
  )

  const navLinksData = [
    { label: t.nav.sobre, href: "#sobre" },
    { label: t.nav.servicos, href: "#servicos" },
    { label: t.nav.comoFunciona, href: "#como-funciona" },
    { label: t.nav.cases, href: "#cases" },
    { label: t.nav.mentoria, href: "#mentoria" },
  ]

  // O "Fale conosco" saiu do header a pedido do cliente: o CTA da barra é só o
  // diagnóstico. O contato segue acessível pelo link do rodapé e pela seção final.
  const diagnosticoButtonElement = (
    // O conteúdo desktop da pill mede ~865px e só cabe a partir de ~897px de
    // viewport — por isso o hambúrguer fica até lg (1024px); entre 640 e 1024
    // a versão desktop cortava logo e CTA para fora da tela.
    <div className="relative group w-full lg:w-auto">
      <div
        className="absolute inset-0 -m-2 rounded-full
                     hidden lg:block
                     bg-primary
                     opacity-40 filter blur-lg pointer-events-none
                     transition-all duration-300 ease-out
                     group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"
      ></div>
      <Link
        href="/diagnostico"
        className="relative z-10 inline-block text-center px-4 py-3.5 lg:px-3 lg:py-2 text-xs lg:text-sm font-semibold text-white bg-gradient-to-br from-[#E60107] to-[#B02428] rounded-full hover:from-[#F0474C] hover:to-[#C42A2F] transition-all duration-200 w-full lg:w-auto"
      >
        {t.nav.diagnostico}
      </Link>
    </div>
  )

  return (
    <header
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-20
                       flex flex-col items-center
                       pl-6 pr-6 py-3 backdrop-blur-sm
                       ${headerShapeClass}
                       border border-[#333] bg-[#1f1f1f57]
                       w-[calc(100%-2rem)] lg:w-auto
                       transition-[border-radius] duration-0 ease-in-out`}
    >
      <div className="flex items-center justify-between w-full gap-x-6 lg:gap-x-8">
        <div className="flex items-center">{logoElement}</div>

        <nav className="hidden lg:flex items-center space-x-6 text-sm">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.href} href={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher />
          {diagnosticoButtonElement}
        </div>

        {/* 44×44 de área de toque; as margens negativas devolvem os 28px de
            altura que o logo ocupa, para a pill não engordar. */}
        <button
          className="lg:hidden flex items-center justify-center w-11 h-11 -my-2 -mr-2 text-gray-300 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12M6 12h12"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          )}
        </button>
      </div>

      <div
        className={`lg:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 ${mobileMenuOverflowClass}
                       ${isOpen ? "max-h-[1000px] opacity-100 pt-2" : "max-h-0 opacity-0 pt-0 pointer-events-none"}`}
      >
        {/* py-2.5 leva cada link a 44px de alvo de toque (linha de 24px + 20px). */}
        <nav className="flex flex-col items-center space-y-1 text-base w-full">
          {navLinksData.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-white transition-colors w-full text-center py-2.5"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4 mt-3 w-full">
          <LanguageSwitcher />
          {diagnosticoButtonElement}
        </div>
      </div>
    </header>
  )
}
