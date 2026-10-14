"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Minus, Plus } from "lucide-react"
import { motion } from "motion/react"

import { MailCheckIcon, type MailCheckIconHandle } from "@/components/icons/animated/mail-check"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion-animated"
import { useReveal } from "@/components/ui/motion-kit"
import { useI18n } from "@/lib/i18n/context"

const copy = {
  pt: {
    title: "Perguntas",
    titleEm: "frequentes.",
    contactTitle: "Ainda ficou com dúvida?",
    items: [
      {
        question: "Como funciona o diagnóstico gratuito?",
        answer:
          "Você preenche um questionário sobre a rotina da empresa. Em até 24 horas, enviamos uma pré-análise por e-mail e WhatsApp. Depois, numa conversa de 30 minutos, mostramos por onde começar. Você sai com um caminho claro, mesmo que decida não seguir com a gente. Sem compromisso.",
      },
      {
        question: "A IA vai substituir minha equipe?",
        answer:
          "Não. A IA cuida do que se repete: responder dúvidas comuns, registrar informações, lembrar dos retornos. Sua equipe fica com o que precisa de gente: a conversa, a negociação e a decisão.",
      },
      {
        question: "Funciona com o CRM que eu já uso?",
        answer:
          "Integrar a IA ao CRM é parte central do nosso trabalho. No diagnóstico, olhamos o sistema que você usa e explicamos como a conexão vai funcionar antes de qualquer proposta.",
      },
      {
        question: "Quanto tempo leva para começar a funcionar?",
        answer:
          "As primeiras soluções costumam entrar no ar em poucas semanas, não em meses. Trabalhamos em etapas, e você vê algo funcionando desde a primeira entrega. Prazos e etapas ficam combinados antes de começar.",
      },
      {
        question: "Preciso ter equipe técnica?",
        answer:
          "Não. Nós cuidamos da configuração, da integração e do acompanhamento, e ensinamos sua equipe a usar no dia a dia. Se você já tem equipe técnica, ela participa desde o início.",
      },
      {
        question: "E a segurança dos meus dados?",
        answer:
          "Seus dados continuam seus. Trabalhamos com acordo de confidencialidade, acesso só ao que é necessário e, sempre que possível, com a estrutura sob o seu controle. A LGPD entra desde o desenho da solução, não como remendo no final.",
      },
      {
        question: "Quanto custa?",
        answer:
          "Depende do que a sua empresa precisa. Trabalhamos com projetos de escopo fechado e com acompanhamento mensal. Depois do diagnóstico, você recebe uma proposta clara, com valores e o que esperar, e decide com calma. Sem surpresa no meio do caminho.",
      },
      {
        question: "Funciona para o meu setor?",
        answer:
          "Hoje nosso foco é o mercado imobiliário, com atendimento integrado ao CRM. Mas já entregamos projetos em serviços, varejo, indústria e saúde. E somos francos: se a IA não fizer sentido para o seu caso agora, dizemos isso.",
      },
      {
        question: "E depois da entrega, tem suporte?",
        answer:
          "Tem. Toda solução sai com monitoramento, documentação e equipe treinada. Com o acompanhamento mensal, seguimos ajustando e melhorando junto com você.",
      },
    ],
  },
  en: {
    title: "Frequently asked",
    titleEm: "questions.",
    contactTitle: "Still have a question?",
    items: [
      {
        question: "How does the free diagnosis work?",
        answer:
          "You fill in a questionnaire about how your company works. Within 24 hours we send you a first analysis by email and WhatsApp. Then, in a 30-minute conversation, we show you where to start. You leave with a clear path, even if you decide not to work with us. No commitment.",
      },
      {
        question: "Will AI replace my team?",
        answer:
          "No. AI takes care of the repetitive part: answering common questions, logging information, remembering follow-ups. Your team keeps what needs a person: the conversation, the negotiation and the decision.",
      },
      {
        question: "Does it work with the CRM I already use?",
        answer:
          "Connecting AI to your CRM is a core part of what we do. In the diagnosis, we look at the system you use and explain how the connection will work before any proposal.",
      },
      {
        question: "How long until it's up and running?",
        answer:
          "The first solutions usually go live within a few weeks, not months. We work in steps, so you see something working from the first delivery. Timelines and steps are agreed before we start.",
      },
      {
        question: "Do I need a technical team?",
        answer:
          "No. We handle setup, integration and follow-up, and we teach your team to use it day to day. If you already have a technical team, they're involved from the start.",
      },
      {
        question: "What about the security of my data?",
        answer:
          "Your data stays yours. We work under a confidentiality agreement, access only what's needed and, whenever possible, keep the infrastructure under your control. Brazil's data protection law (LGPD) is part of the design from day one, not a patch at the end.",
      },
      {
        question: "How much does it cost?",
        answer:
          "It depends on what your company needs. We work with fixed-scope projects and monthly support plans. After the diagnosis you get a clear proposal, with prices and what to expect, and decide in your own time. No surprises along the way.",
      },
      {
        question: "Does it work for my industry?",
        answer:
          "Our focus today is real estate, with customer service connected to the CRM. But we've delivered projects in services, retail, manufacturing and healthcare. And we're honest: if AI doesn't make sense for your case right now, we'll tell you.",
      },
      {
        question: "Is there support after launch?",
        answer:
          "Yes. Every solution ships with monitoring, documentation and a trained team. With monthly support, we keep fine-tuning and improving it with you.",
      },
    ],
  },
} as const

export function Faq() {
  const { t: dict, locale } = useI18n()
  const t = copy[locale]
  const email = dict.contato.email
  const reveal = useReveal()
  const [expanded, setExpanded] = useState<React.Key | null>(0)
  const mailIcon = useRef<MailCheckIconHandle>(null)

  return (
    <section id="faq" className="scroll-mt-24 bg-background">
      <div className="mx-auto grid w-full max-w-7xl items-start gap-x-20 gap-y-12 px-4 py-24 md:px-8 md:py-32 lg:grid-cols-[1fr_1.45fr] lg:px-10">
        <motion.div
          className="lg:sticky lg:top-28"
          {...reveal()}
          onViewportEnter={() => mailIcon.current?.startAnimation()}
        >
          <h2 className="text-balance text-4xl leading-[1.08] tracking-tight text-foreground md:text-5xl">
            {t.title} <strong className="font-bold">{t.titleEm}</strong>
          </h2>

          {/* Ilustração sobre a forma do símbolo, com o card de contato encaixado embaixo. */}
          <div className="relative mt-10 overflow-hidden rounded-[28px] border border-border bg-surface px-6 pt-8 sm:px-10">
            <Image
              src="/images/formas/simbolo-azul.svg"
              alt=""
              width={734}
              height={691}
              className="pointer-events-none absolute -right-[35%] -top-[25%] w-[95%] max-w-none opacity-15"
            />
            <Image
              src="/images/ilustracoes/duvidas.png"
              alt=""
              width={1146}
              height={1200}
              sizes="260px"
              className="relative mx-auto h-auto w-full max-w-[260px]"
            />
            <a
              href={`mailto:${email}`}
              onMouseEnter={() => mailIcon.current?.startAnimation()}
              onMouseLeave={() => mailIcon.current?.stopAnimation()}
              className="group relative -mx-6 mt-6 flex items-center gap-4 border-t border-border bg-card px-6 py-5 transition-colors hover:bg-accent sm:-mx-10 sm:px-10"
            >
              <MailCheckIcon
                ref={mailIcon}
                size={20}
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
              />
              <span className="min-w-0">
                <span className="block font-semibold text-foreground">{t.contactTitle}</span>
                <span className="block truncate text-[0.9375rem] font-medium text-primary">{email}</span>
              </span>
            </a>
          </div>
        </motion.div>

        <Accordion
          className="border-t border-border"
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
          expandedValue={expanded}
          onValueChange={setExpanded}
        >
          {t.items.map((item, index) => (
            // Wrapper fora do AccordionItem: ele clona os filhos diretos.
            <motion.div key={item.question} className="border-b border-border" {...reveal(Math.min(index, 6) * 0.05)}>
              <AccordionItem value={index}>
                <AccordionTrigger className="flex w-full items-center justify-between gap-6 py-6 text-left">
                  <span className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {item.question}
                  </span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-primary transition-colors group-hover:border-primary group-data-[expanded]:border-primary group-data-[expanded]:bg-primary group-data-[expanded]:text-primary-foreground">
                    <Plus className="size-4 group-data-[expanded]:hidden" aria-hidden="true" />
                    <Minus className="hidden size-4 group-data-[expanded]:block" aria-hidden="true" />
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="max-w-[620px] pb-6 pr-10 text-muted-foreground">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
