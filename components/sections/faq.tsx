"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion-animated"
import { useI18n } from "@/lib/i18n/context"

// FAQ redigido para objeções de venda da SPXIA — PENDENTE de revisão do Walisson.
const copy = {
  pt: {
    kicker: "FAQ",
    title: "Perguntas frequentes",
    items: [
      {
        question: "Como funciona o diagnóstico gratuito de 30 minutos?",
        answer:
          "É uma conversa objetiva com nosso time: você apresenta a operação e nós mapeamos onde IA e automação geram mais impacto, com estimativa de retorno. Você sai com um direcionamento claro, mesmo que decida não seguir com a gente. Sem compromisso e sem apresentação de vendas disfarçada.",
      },
      {
        question: "Qual o prazo típico de um projeto?",
        answer:
          "As primeiras automações costumam entrar no ar em poucas semanas, não meses. Projetos completos variam com o escopo, mas trabalhamos com entregas incrementais: você vê resultado funcionando desde o primeiro ciclo. Prazos e marcos ficam definidos antes de começar.",
      },
      {
        question: "Preciso ter equipe técnica?",
        answer:
          "Não. Nós cuidamos de arquitetura, desenvolvimento, integração e monitoramento, além de treinar seu time para operar o dia a dia. Se você já tem equipe técnica, melhor ainda: ela é envolvida desde o início e sai dominando as ferramentas.",
      },
      {
        question: "Como ficam a segurança e a LGPD dos meus dados?",
        answer:
          "Seus dados continuam seus. Trabalhamos com acordo de confidencialidade, acesso mínimo necessário e infraestrutura sob seu controle sempre que possível. Cada projeto considera a LGPD desde o desenho da solução, não como remendo no final.",
      },
      {
        question: "Quais são os modelos de contratação e o investimento?",
        answer:
          "Trabalhamos com projetos de escopo fechado e com assessoria contínua mensal. O investimento depende do escopo. Por isso o diagnóstico vem antes: você recebe uma proposta com números e retorno esperado, e decide com base em dados. Sem surpresa no meio do caminho.",
      },
      {
        question: "Funciona para o meu setor?",
        answer:
          "IA e automação resolvem problemas de processo. E todo setor tem processos: atendimento, vendas, financeiro, operações. Já entregamos projetos em serviços, varejo, indústria e saúde. E somos francos no diagnóstico: se IA não fizer sentido para o seu caso agora, dizemos isso.",
      },
      {
        question: "E depois da entrega, tem suporte?",
        answer:
          "Tem. Nenhum projeto é entregue e abandonado: toda solução sai com monitoramento, documentação e time treinado. Para quem quer evoluir continuamente, a assessoria mensal mantém o sistema otimizado e a operação acompanhada de perto.",
      },
    ],
  },
  en: {
    kicker: "FAQ",
    title: "Frequently asked questions",
    items: [
      {
        question: "How does the free 30-minute diagnosis work?",
        answer:
          "It's an objective conversation with our team: you walk us through your operation and we map where AI and automation generate the most impact, with an estimated return. You leave with clear direction, even if you decide not to move forward with us. No commitment and no sales pitch in disguise.",
      },
      {
        question: "What is the typical timeline for a project?",
        answer:
          "The first automations usually go live within weeks, not months. Full projects vary with scope, but we work with incremental deliveries: you see working results from the first cycle. Timelines and milestones are defined before we start.",
      },
      {
        question: "Do I need a technical team?",
        answer:
          "No. We handle architecture, development, integration and monitoring, and we train your team to run day-to-day operations. If you already have a technical team, even better: they are involved from day one and come out mastering the tools.",
      },
      {
        question: "What about security and data protection (LGPD)?",
        answer:
          "Your data stays yours. We work with confidentiality agreements, least-privilege access and infrastructure under your control whenever possible. Every project considers data protection from the solution design, not as a patch at the end.",
      },
      {
        question: "What are the engagement models and the investment?",
        answer:
          "We work with fixed-scope projects and ongoing monthly advisory. Investment depends on scope. That's why the diagnosis comes first: you receive a proposal with numbers and expected return, and decide based on data. No surprises along the way.",
      },
      {
        question: "Does it work for my industry?",
        answer:
          "AI and automation solve process problems. And every industry has processes: support, sales, finance, operations. We have delivered projects in services, retail, manufacturing and healthcare. And we are upfront in the diagnosis: if AI doesn't make sense for your case right now, we'll tell you.",
      },
      {
        question: "Is there support after delivery?",
        answer:
          "Yes. No project is delivered and abandoned: every solution ships with monitoring, documentation and a trained team. For those who want continuous evolution, the monthly advisory keeps the system optimized and the operation closely monitored.",
      },
    ],
  },
} as const

export function Faq() {
  const { locale } = useI18n()
  const t = copy[locale]
  const reduceMotion = useReducedMotion()
  const [hovered, setHovered] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<React.Key | null>(null)

  return (
    <section id="faq" className="bg-background py-24 sm:py-28 lg:py-32">
      <div className="container mx-auto max-w-3xl px-4">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary-text">
          {t.kicker}
        </p>
        <h2 className="mt-4 font-serif text-3xl text-foreground md:text-4xl">
          {t.title}
        </h2>

        <Accordion
          className="mt-12 divide-y divide-border border-y border-border"
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
          expandedValue={expanded}
          onValueChange={setExpanded}
        >
          {t.items.map((item, index) => {
            const isExpanded = expanded === index

            return (
              // Wrapper decorativo: o AccordionItem clona seus filhos diretos, então
              // as camadas de hover/borda ficam aqui fora, não dentro dele.
              <motion.div
                key={item.question}
                className="group relative isolate"
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, ease: "easeOut", delay: Math.min(index, 6) * 0.05 }}
              >
                {/* Realce que desliza de um item para o outro conforme o ponteiro anda. */}
                <AnimatePresence>
                  {hovered === index && (
                    <motion.span
                      key="faq-hover"
                      layoutId="faq-hover"
                      aria-hidden
                      className="absolute inset-x-0 inset-y-0 -z-10 bg-[linear-gradient(90deg,rgba(249,1,8,0.12),rgba(249,1,8,0.03)_45%,transparent_75%)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                    />
                  )}
                </AnimatePresence>

                {/* Traço vertical que acende na margem do item ativo — fica fora da
                    coluna de texto para não deslocar o alinhamento da seção. */}
                <span
                  aria-hidden
                  className={`absolute -left-3 top-0 -z-10 h-full w-0.5 origin-center bg-primary transition-transform duration-300 ease-out motion-reduce:transition-none ${
                    isExpanded || hovered === index ? "scale-y-100" : "scale-y-0"
                  }`}
                />

                {/* Fio vermelho que corre na base quando a resposta abre. */}
                <motion.span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-px w-full origin-left bg-[linear-gradient(90deg,var(--primary),transparent)]"
                  initial={false}
                  animate={{ scaleX: isExpanded ? 1 : 0, opacity: isExpanded ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />

                <AccordionItem value={index}>
                  <AccordionTrigger className="w-full py-5 text-left">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-foreground transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none">
                        {item.question}
                      </span>
                      <span className="-mr-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-transparent transition-colors duration-300 group-hover:border-primary/30 group-hover:bg-primary/10 motion-reduce:transition-none">
                        <ChevronDown className="h-4 w-4 text-primary transition-transform duration-200 group-data-[expanded]:rotate-180" />
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="pb-5 pr-8 text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}
