# SPXia — texto novo do site (rascunho para aprovação)

1. **A rotina vem antes da tecnologia.** Cada bloco começa pelo que acontece no dia a dia (responder, copiar, retornar) e só depois diz o que resolve. A IA aparece como meio, nunca como promessa.
2. **Simplicidade + proximidade.** Frases curtas, verbos concretos, leitor tratado por "você" e "sua equipe", e a SPXia falando como "nós". Saem jargão (ROI, roadmap, workflow, fallback, 24/7) e hype ("transformar", "IA de verdade", "lucrar").
3. **O imobiliário é o exemplo, não o limite.** Chat SPX, VoxIA e CRM imobiliário abrem as soluções, mas o resto do site continua falando com qualquer empresa que quer uma rotina mais simples.
4. **Só fatos que já existem.** Números, cases, prazos e descrições de produto vêm do site atual e do roteiro do vídeo institucional. Nada foi inventado, e os números que soam como promessa viraram pergunta ao usuário (P4).
5. **A forma da marca.** Títulos em duas partes, com a segunda em **negrito** ("Sua rotina pode ser **mais simples.**"). Os CTAs são "Vamos conversar" (diagnóstico) e "Quero conhecer" (soluções). O texto vai em caixa normal (caixa alta, quando houver, vem do CSS) e o nome é sempre "SPXia".

**Como ler:** `—` = o campo sai. **negrito** = trecho em negrito do título (no código é o `titleEm`/`em`). "(novo)" = campo que não existe hoje. As âncoras (`#sobre`, `#servicos`…) não mudam. Onde a coluna "atual" está vazia, o texto hoje só existe em pt ou não existe.

---

## 0. Navbar — `components/ui/navbar.tsx` + `lib/i18n/{pt,en}.ts` (`nav`)

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| nav.sobre | SOBRE | Sobre | About |
| nav.servicos | SERVIÇOS | Soluções | Solutions |
| nav.comoFunciona | COMO FUNCIONA | Como funciona | How it works |
| nav.cases | CASES | Projetos | Projects |
| nav.mentoria | MENTORIA | Treinamento (depende de P1) | Training |
| nav.cta (link do rodapé para `#contato`) | FALE CONOSCO | Contato | Contact |
| nav.diagnostico (botão → `/diagnostico`) | AGENDAR DIAGNÓSTICO | Vamos conversar | Let's talk |
| aria-label do menu mobile (hoje só em inglês) | Open Menu / Close Menu | Abrir menu / Fechar menu | Open menu / Close menu |

## 1. Hero — `components/sections/hero.tsx`

Regra: título + 1 frase + 2 CTAs. Layout da peça `12.png`.

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| badge | CONSULTORIA · AUTOMAÇÃO · IA PARA NEGÓCIOS | — | — |
| title1 | Seu negócio precisa de | Sua rotina pode ser | Your routine can be |
| titleEm1 | IA que funciona. | **mais simples.** | **simpler.** |
| title2 | Não de promessas. | — | — |
| sub | Consultoria, automações e IA sob medida: da estratégia à produção, com resultados mensuráveis. | Inteligência artificial para facilitar o atendimento e reduzir as tarefas repetitivas da sua empresa. | Artificial intelligence that makes customer service easier and takes repetitive work off your team. |
| CTA primário (→ `/diagnostico`) | Agendar Diagnóstico (hoje é o cta2) | Vamos conversar | Let's talk |
| CTA secundário (→ `#servicos`) | Nossos Serviços (hoje é o cta1) | Quero conhecer | Tell me more |
| stats (3 números) | 50+ projetos entregues · 40+ automações em produção · 100% clientes com ROI positivo | — (os números ficam só em Resultados, ver P4) | — |
| loading | carregando cena… | — (o Spline sai) | — |
| scroll | role | — | — |
| imageAlt (novo, foto da pessoa) | | Mulher de olhos fechados, com um sorriso tranquilo. (ajustar à foto final) | A woman with her eyes closed and a calm smile. (match the final photo) |

## 2. Faixa de tecnologias — `components/sections/tech-marquee.tsx` · PERGUNTA AO USUÁRIO (P5)

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| label (se os logos atuais ficarem) | TECNOLOGIAS QUE DOMINAMOS | Tecnologias que usamos | Technologies we use |
| label (se trocar por canais, recomendado) | | Funciona com o que sua equipe já usa | Works with what your team already uses |

## 3. Sobre (01) — `components/sections/sobre.tsx`

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| label | QUEM SOMOS | Quem somos | About us |
| title | A SPXIA transforma negócios com | A SPXia nasce para | SPXia is here to |
| titleEm | inteligência artificial aplicada. | **simplificar a rotina de quem empreende.** | **make running a business simpler.** |
| p1 | Somos a divisão de inteligência e automação da Simplex Soluções. Atuamos como parceiros estratégicos de empresas que querem usar IA para resolver problemas reais, não para seguir tendências. | SPX vem de Simplex. Somos a área de inteligência artificial e automação da Simplex Soluções, no interior de Mato Grosso. | SPX comes from Simplex. We are the artificial intelligence and automation arm of Simplex Soluções, based in inland Mato Grosso, Brazil. |
| p2 | Da consultoria ao desenvolvimento, da automação ao treinamento: entregamos projetos completos, com metodologia própria, testados em produção e focados em retorno financeiro. | Responder dúvidas, organizar informações e acompanhar cada atendimento faz parte do dia a dia. Nós conectamos a IA aos processos da sua empresa para tirar do caminho o que se repete. Assim, sua equipe ganha tempo para as conversas e decisões que precisam de atenção. | Answering questions, organizing information and following up on every customer is part of the job. We connect AI to your company's processes to get the repetitive work out of the way, so your team has time for the conversations and decisions that need attention. |
| values[0] | **Estratégia + Execução** — Não entregamos slides. Entregamos sistemas rodando, automações funcionando e equipes treinadas. | **Fácil de entender** — Explicamos o que a IA vai fazer na sua rotina, com exemplos do seu negócio e sem termos técnicos. | **Easy to understand** — We explain what AI will do in your routine, with examples from your business and no tech jargon. |
| values[1] | **Rigor de Engenharia** — Cada projeto com arquitetura, testes e monitoramento. Zero improviso. | **Integrada ao seu negócio** — Conectamos a IA ao seu CRM, ao WhatsApp e aos sistemas que sua equipe já usa. Nada de começar do zero. | **Part of your business** — We connect AI to your CRM, WhatsApp and the systems your team already uses. No starting from scratch. |
| values[2] | **Resultados Rápidos** — Primeiras automações no ar em semanas. ROI mensurável desde o primeiro mês. | **No ar em semanas** — As primeiras soluções começam a funcionar em poucas semanas, testadas e monitoradas. | **Live in weeks** — The first solutions are up and running within a few weeks, tested and monitored. |
| values[3] | **Parceria de Longo Prazo** — Assessoria contínua, não projeto-e-adeus. Crescemos junto com seu negócio. | **Perto de você** — Seguimos junto depois da entrega, ajustamos o que for preciso e crescemos com o seu negócio. | **Close to you** — We stay with you after launch, adjust whatever is needed and grow with your business. |

## 4. Problema — `components/sections/problema.tsx`

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| callout.pre | A maioria das empresas | Qual tarefa você | Which task have you |
| callout.em | está perdendo dinheiro | **já repetiu vezes demais** | **repeated too many times** |
| callout.post | com IA. | hoje? | today? |
| text | Investem em ferramentas, contratam cursos rasos e tentam implementar sozinhas. O resultado: projetos abandonados, equipes frustradas e zero retorno. A SPXIA existe pra mudar isso. | Responder a mesma dúvida. Copiar a mesma informação de um sistema para outro. Retornar o cliente que ficou esperando. Quando o dia se enche disso, falta tempo para quem importa. | Answering the same question. Copying the same information from one system to another. Getting back to the customer who was left waiting. When that fills the day, there's no time left for the people who matter. |
| semTitle | SEM A SPXIA | Hoje | Today |
| comTitle | COM A SPXIA | Com a SPXia | With SPXia |
| semItems[0] | Equipe perdida entre dezenas de ferramentas de IA | A mensagem chega à noite e só é respondida no dia seguinte | A message arrives at night and gets answered the next day |
| semItems[1] | Automações que quebram e ninguém sabe consertar | O telefone toca enquanto a equipe está em visita | The phone rings while your team is out on a visit |
| semItems[2] | Investimento em tecnologia sem retorno claro | A mesma pergunta respondida várias vezes por dia | The same question answered over and over |
| semItems[3] | Projetos de IA que nunca saem do PowerPoint | Informação copiada à mão de um sistema para outro | Information copied by hand between systems |
| semItems[4] | Fornecedores que entregam e somem | Cliente sem retorno porque ninguém lembrou de ligar | Customers with no follow-up because nobody remembered to call |
| comItems[0] | Estratégia clara: qual IA usar, onde e por quê | Resposta na hora, a qualquer hora, no WhatsApp, no Instagram, no site e no e-mail | An answer right away, any time, on WhatsApp, Instagram, your website and email |
| comItems[1] | Automações monitoradas, com fallback e alertas | Ligações atendidas e retornadas em poucos minutos | Calls answered and returned within minutes |
| comItems[2] | ROI documentado desde o primeiro mês | A IA responde o que é comum; sua equipe cuida do que precisa de atenção | AI handles the common questions; your team handles what needs attention |
| comItems[3] | Projetos em produção com dados reais | Tudo registrado no seu CRM, sem copiar e colar | Everything logged in your CRM, no copy and paste |
| comItems[4] | Assessoria contínua e evolução constante | Retornos automáticos, para nenhum cliente ficar esperando | Automatic follow-ups, so no customer is left waiting |

## 5. Soluções (02, hoje "Serviços") — `components/sections/servicos.tsx`

A ordem dos cards muda. A coluna "atual" mostra o card que ocupa essa posição hoje. "Mentoria e Treinamento" sai daqui: o treinamento entra no card de acompanhamento e na seção 9.

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| label | SERVIÇOS | Soluções | Solutions |
| title | Tudo que seu negócio precisa para | Tecnologia que ajuda. | Technology that helps. |
| titleEm | lucrar com IA. | **Tempo para o que importa.** | **Time for what matters.** |
| desc | Da estratégia ao código. Do treinamento ao monitoramento. Soluções completas. | Começamos pelo atendimento, com IA integrada ao seu CRM. E construímos o que mais a sua operação precisar. | We start with customer service, with AI connected to your CRM. Then we build whatever else your operation needs. |
| items[0] | ESTRATÉGIA · **Consultoria em IA** — Diagnóstico do seu negócio, identificação de oportunidades e elaboração de roadmap de implementação de IA com ROI projetado. | Atendimento · **Chat SPX** — WhatsApp, Instagram, site e e-mail num só lugar. A IA responde na hora, tira dúvidas, entende o que o cliente procura e passa a conversa para a pessoa certa, com todo o histórico. | Customer service · **Chat SPX** — WhatsApp, Instagram, website and email in one place. AI replies right away, answers questions, understands what the customer is looking for and hands the conversation to the right person, with the full history. |
| items[1] | DESENVOLVIMENTO · **Desenvolvimento de Sistemas** — Criação de sistemas sob medida: SaaS, plataformas web, aplicações internas, APIs e integrações com IA embarcada. | Ligações · **VoxIA** — A IA que liga e atende. Retorna o contato em poucos minutos, atende a qualquer hora, qualifica, agenda a visita e registra tudo no CRM. | Phone calls · **VoxIA** — The AI that makes and takes calls. It calls new contacts back within minutes, answers at any hour, qualifies, books the visit and logs everything in your CRM. |
| items[2] | AUTOMAÇÃO · **Automações Inteligentes** — Workflows automatizados com n8n, WhatsApp, CRM, financeiro, e-mail e qualquer API. Monitorados 24/7. | Integração · **CRM e automações** — Ligamos a IA ao seu CRM e aos sistemas da equipe. Retornos automáticos e informação no lugar certo, sem copiar e colar. | Integration · **CRM and automations** — We connect AI to your CRM and your team's systems. Automatic follow-ups and information in the right place, with no copy and paste. |
| items[3] | INTELIGÊNCIA ARTIFICIAL · **Projetos de IA** — Elaboração e implementação de projetos com agentes de IA, chatbots, análise de dados, geração de conteúdo e assistentes virtuais. | Sob medida · **Sistemas sob medida** — Quando nenhuma ferramenta pronta resolve, desenvolvemos a que sua operação precisa: plataformas web, sistemas internos e integrações. | Custom · **Custom systems** — When no off-the-shelf tool fits, we build the one your operation needs: web platforms, internal systems and integrations. |
| items[4] | EDUCAÇÃO · **Mentoria e Treinamento** — Programas de capacitação para times e líderes: como usar IA no dia a dia, ferramentas práticas, estratégia e implementação. | Consultoria · **Consultoria em IA** — Entendemos sua rotina, mostramos onde a IA faz diferença e montamos um plano em etapas, com investimento claro. | Consulting · **AI consulting** — We learn how your business runs, show where AI makes a difference and lay out a step-by-step plan with clear costs. |
| items[5] | PARCERIA · **Assessoria Contínua** — Acompanhamento mensal do seu negócio: evolução dos projetos, novas oportunidades de IA, suporte técnico e estratégico. | Acompanhamento · **Acompanhamento contínuo** — Depois da entrega, seguimos junto: suporte, treinamento da equipe e melhorias conforme o negócio cresce. | Ongoing support · **Ongoing support** — After launch we stay with you: support, team training and improvements as your business grows. |

## 6. Como funciona (03) — `components/sections/como-funciona.tsx`

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| label | COMO FUNCIONA | Como funciona | How it works |
| title | Do diagnóstico ao | Por onde começar com IA? | Where do you start with AI? |
| titleEm | resultado. | **Pelo que complica o seu dia.** | **With whatever makes your day harder.** |
| desc | Processo claro, sem surpresas. Você acompanha cada etapa. | Um passo de cada vez, e você acompanha todos eles. | One step at a time, and you follow every one. |
| steps[0] | **Diagnóstico** — Analisamos seu negócio, processos e oportunidades. Identificamos onde IA gera mais impacto financeiro. · _Reunião inicial + relatório com ROI projetado_ | **Diagnóstico** — Você conta como é a rotina da empresa. Nós encontramos as tarefas que mais tomam o tempo da equipe. · _Gratuito e sem compromisso_ | **Diagnosis** — You tell us how your company works day to day. We find the tasks that take up most of your team's time. · _Free, no commitment_ |
| steps[1] | **Estratégia** — Desenhamos o roadmap: quais projetos, em que ordem, com quais ferramentas e qual investimento. · _Plano de ação com cronograma e entregáveis_ | **Plano** — Mostramos o que simplificar primeiro, quanto custa e quanto tempo leva. · _Proposta com etapas e prazos_ | **Plan** — We show you what to simplify first, what it costs and how long it takes. · _Proposal with steps and timelines_ |
| steps[2] | **Execução** — Desenvolvemos os sistemas, automações e integrações. Tudo com arquitetura, testes e documentação. · _Entregas semanais com validação do cliente_ | **Implantação** — Configuramos as soluções e conectamos ao seu CRM e aos sistemas da equipe. Tudo testado antes de entrar no ar. · _Entregas semanais, validadas por você_ | **Setup** — We set up the solutions and connect them to your CRM and team systems. Everything is tested before it goes live. · _Weekly deliveries, approved by you_ |
| steps[3] | **Evolução** — Monitoramos, otimizamos e expandimos. Assessoria contínua para garantir que o resultado cresça. · _Acompanhamento mensal + novas oportunidades_ | **Acompanhamento** — Seguimos de perto: ajustamos, treinamos a equipe e sugerimos os próximos passos. · _Acompanhamento mensal_ | **Follow-up** — We stay close: we fine-tune, train your team and suggest the next steps. · _Monthly check-ins_ |

## 7. Projetos (04, hoje "Cases") — `components/sections/cases.tsx` · ver P6

Formato de cada item: setor · **título** — descrição · métricas.

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| label | CASES | Projetos | Projects |
| title | Projetos | Soluções em uso | Solutions in use |
| titleEm | em produção. | **todos os dias.** | **every day.** |
| desc | Não são protótipos. São sistemas rodando com dados reais e clientes pagando. Todos construídos através de desenvolvimento via IA. | Não são protótipos. São sistemas que empresas usam no dia a dia, com dados reais. Todos construídos pela nossa equipe com apoio de IA. | Not prototypes. These are systems companies use every day, with real data. All built by our team with the help of AI. |
| aiBadge | DESENVOLVIDO COM IA | Feito com IA | Built with AI |
| items[0] | AUTOMAÇÃO E AGENTES IA · **CopilotAB** — Plataforma completa de automação com agentes de IA e WhatsApp. Atendimento inteligente, qualificação de leads e gestão de conversas. Tudo automatizado e monitorado em tempo real. · Agentes de IA autônomos / Integração WhatsApp nativa / Gestão de conversas em tempo real / Qualificação automática de leads | Sistema personalizado premium · **Copilot**: um sistema exclusivo, feito sob medida para a operação do cliente. · Projeto exclusivo / Feito para a rotina da equipe / Acabamento premium (usuário, 14/10: não é atendimento com IA) | Premium custom system · **Copilot**: an exclusive system, tailor-made for the client’s operation. · Exclusive project / Built around the team’s routine / Premium finish |
| items[1] | ASSISTENTE VIRTUAL · **ChatSPX** — Assistente virtual inteligente com IA conversacional avançada. Interface moderna, respostas contextuais e integração com bases de conhecimento customizadas para cada cliente. · IA conversacional avançada / Base de conhecimento customizada / Interface moderna e responsiva / Respostas contextuais em tempo real | Assistente virtual · **Chat SPX** — Assistente que conversa com os seus clientes e responde com base no conhecimento da sua empresa, configurado para cada cliente. · Conversa natural / Base de conhecimento da sua empresa / Funciona no computador e no celular / Respostas de acordo com o contexto | Virtual assistant · **Chat SPX** — An assistant that talks with your customers and answers from your company's own knowledge, set up for each client. · Natural conversation / Your company's knowledge base / Works on desktop and mobile / Answers that fit the context |
| items[2] | ENERGIA SOLAR · **Gestão de Financiamento e Fomento** — Sistema de gestão completo para financiamento e fomento de projetos de energia solar. Controle de propostas, simulações financeiras, acompanhamento de aprovações e relatórios gerenciais. · Simulação financeira automatizada / Controle de propostas e aprovações / Relatórios gerenciais completos / Pipeline de financiamento integrado | Energia solar · **Gestão de Financiamento e Fomento** — Sistema que organiza o financiamento de projetos de energia solar: propostas, simulações, aprovações e relatórios num só lugar. · Simulações financeiras automáticas / Propostas e aprovações sob controle / Relatórios para a gestão / Etapas do financiamento integradas | Solar energy · **Financing & Funding Management** — A system that organizes financing for solar energy projects: proposals, simulations, approvals and reports in one place. · Automatic financial simulations / Proposals and approvals under control / Management reports / Connected financing steps |
| items[3] | ASSISTÊNCIA TÉCNICA · **Sistema de Ordens de Serviço** — Sistema completo de gestão de OS com controle financeiro, estoque, clientes e relatórios. Redução de 60% no tempo de atendimento. · Gestão de OS completa / Controle financeiro integrado / Gestão de estoque e clientes / -60% tempo de atendimento | Assistência técnica · **Sistema de Ordens de Serviço** — Ordens de serviço, financeiro, estoque e clientes num só sistema. O tempo de atendimento caiu 60%. · Ordens de serviço do início ao fim / Financeiro integrado / Estoque e clientes / −60% no tempo de atendimento | Technical support · **Service Order System** — Service orders, finances, inventory and customers in one system. Service time dropped by 60%. · Service orders from start to finish / Integrated finances / Inventory and customers / Service time cut by 60% |
| items[4] | PROSPECÇÃO B2B · **Captador Inteligente** — Plataforma de prospecção com IA que identifica, qualifica e organiza leads automaticamente. Integração com WhatsApp e CRM. · Captação automática de leads / Qualificação por IA / Integração WhatsApp e CRM / Pipeline de vendas integrado | Prospecção de clientes · **Captador Inteligente** — Encontra, qualifica e organiza novos contatos com IA, já ligado ao WhatsApp e ao CRM. · Novos contatos captados automaticamente / Qualificação com IA / WhatsApp e CRM integrados / Funil de vendas organizado | Lead prospecting · **Smart Lead Capture** — Finds, qualifies and organizes new contacts with AI, connected to WhatsApp and your CRM. · New contacts captured automatically / AI qualification / WhatsApp and CRM connected / Organized sales pipeline |
| items[5] | ATENDIMENTO · **Agentes de IA no WhatsApp** — Chatbots inteligentes que atendem, qualificam e encaminham clientes 24/7. Redução de 80% no tempo de resposta. · Atendimento 24/7 / Qualificação automática / Encaminhamento inteligente / -80% tempo de resposta | Atendimento · **Agentes de IA no WhatsApp** — Atendem, qualificam e encaminham clientes a qualquer hora. O tempo de resposta caiu 80%. · Atendimento a qualquer hora / Qualificação automática / Encaminhamento para a pessoa certa / −80% no tempo de resposta | Customer service · **AI agents on WhatsApp** — They serve, qualify and route customers at any hour. Response time dropped by 80%. · Service at any hour / Automatic qualification / Routing to the right person / Response time cut by 80% |

## 8. Resultados (05) — `components/sections/resultados.tsx` · PERGUNTA AO USUÁRIO (P4)

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| label | RESULTADOS | Resultados | Results |
| title | Números que | Menos tarefas repetidas. | Fewer repeated tasks. |
| titleEm | importam. | **Mais tempo para pessoas.** | **More time for people.** |
| desc | Métricas reais de projetos entregues para nossos clientes. | O que já entregamos para empresas como a sua. | What we've already delivered for companies like yours. |
| items[0] | 50+ · PROJETOS ENTREGUES · Sistemas, automações e integrações em produção | 50+ · Projetos entregues · Sistemas, automações e integrações em uso | 50+ · Projects delivered · Systems, automations and integrations in use |
| items[1] | 40+ · AUTOMAÇÕES ATIVAS · Workflows rodando 24/7 com monitoramento | 40+ · Automações ativas · Funcionando todos os dias, com monitoramento | 40+ · Active automations · Running every day, with monitoring |
| items[2] | 3x · ROI MÉDIO · Retorno sobre investimento nos primeiros 6 meses | 3x · Retorno médio · O investimento volta três vezes nos primeiros 6 meses (só se confirmado) | 3x · Average return · Investment returned three times over in the first 6 months (only if confirmed) |
| items[3] | 80% · REDUÇÃO DE TEMPO · Em processos manuais substituídos por automação | 80% · Menos tempo · Em tarefas manuais que passaram a ser automáticas (só se confirmado) | 80% · Less time · On manual tasks that became automatic (only if confirmed) |

## 9. Treinamento (06, hoje "Mentoria") — `components/sections/mentoria.tsx` · PERGUNTA AO USUÁRIO (P1)

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| label | MENTORIA E TREINAMENTO | Treinamento | Training |
| title | Conhecimento que | Sua equipe à vontade | Your team at ease |
| titleEm | gera resultado. | **com a IA.** | **with AI.** |
| desc | Programas práticos para líderes e times. Sem teoria vazia: tudo aplicado ao seu contexto. | Programas práticos para quem lidera e para quem executa. Tudo com exemplos da sua empresa. | Hands-on programs for the people who lead and the people who do the work. All with examples from your own company. |
| counterLabel (ao lado dos 50 avatares) | empresas atendidas | empresas atendidas | companies served |
| programs[0] | _CEOs, diretores, gestores_ · **IA para Líderes de Negócio** · Panorama real de IA em 2026 / Onde IA gera receita vs onde queima caixa / Como avaliar fornecedores e projetos / Roadmap prático para sua empresa | _Donos, diretores e gestores_ · **IA para quem decide** · O que a IA já faz hoje, explicado sem exagero / Onde ela ajuda e onde não vale a pena / Como avaliar fornecedores e projetos / Um plano prático para a sua empresa | _Owners, directors and managers_ · **AI for decision-makers** · What AI can already do, explained plainly / Where it helps and where it isn't worth it / How to evaluate vendors and projects / A practical plan for your company |
| programs[1] | _Desenvolvedores, tech leads, analistas_ · **IA para Times Técnicos** · Claude Code e agentes na prática / Automações com n8n e APIs / Integração de IA em sistemas existentes / Boas práticas e armadilhas | _Desenvolvedores e analistas_ · **IA para equipes técnicas** · Claude Code e agentes na prática / Automações com n8n e APIs / IA dentro dos sistemas que já existem / Boas práticas e erros comuns | _Developers and analysts_ · **AI for technical teams** · Claude Code and agents in practice / Automations with n8n and APIs / AI inside the systems you already have / Good practices and common mistakes |
| programs[2] | _Empreendedores e profissionais_ · **Mentoria Individual** · Diagnóstico personalizado / Plano de implementação sob medida / Acompanhamento semanal / Acesso direto ao time SPXIA | _Empreendedores e profissionais_ · **Mentoria individual** · Um olhar sobre a sua situação / Plano feito para o seu negócio / Encontros semanais / Contato direto com a equipe SPXia | _Business owners and professionals_ · **One-on-one mentoring** · A close look at your situation / A plan built for your business / Weekly sessions / Direct contact with the SPXia team |

## 10. Produtos (07) — `components/sections/produtos.tsx` · PERGUNTA AO USUÁRIO (P2)

Hoje fica oculta até `NEXT_PUBLIC_SHOW_PRODUCTS=true`. Os títulos, preços e descrições dos cursos vêm do banco e não fazem parte deste rascunho.

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| label | PRODUTOS | Cursos e materiais | Courses and materials |
| title | Invista no seu | Aprenda | Learn |
| titleEm | crescimento. | **no seu ritmo.** | **at your own pace.** |
| desc | Cursos, mentorias e ferramentas para transformar seu negócio com IA. | Cursos, mentorias e materiais para usar IA na rotina da sua empresa. | Courses, mentoring and materials to bring AI into your company's routine. |
| or | ou | ou | or |
| buy | Comprar Agora | Comprar | Buy |
| subscribe | Assinar Agora | Assinar | Subscribe |

## 11. Frase de destaque (Quote) — `components/sections/quote.tsx` · PERGUNTA AO USUÁRIO (P3)

Opção A (recomendada): frase da marca, sem assinatura. Opção B: manter a citação do Paulo Seze como está, trocando só a grafia para "SPXia" (não reescrevi palavras dele).

| campo | atual (pt) | novo (pt) — opção A | novo (en) — opção A |
|---|---|---|---|
| text | IA não é sobre tecnologia. É sobre | A tecnologia trabalha. | Technology does the work. |
| textEm | resultado de negócio. | **O tempo é seu.** | **The time is yours.** |
| text2 | Se não gera receita, reduz custo ou libera tempo, não vale o investimento. | Automatizar o que se repete abre espaço para o que precisa de gente: as conversas, as decisões e o cuidado com cada cliente. | Automating the repetitive work makes room for what needs a person: the conversations, the decisions and the care for each customer. |
| author | Paulo Seze, SPXIA | — (opção B: Paulo Seze, SPXia) | — (option B: Paulo Seze, SPXia) |

## 12. Perguntas frequentes — `components/sections/faq.tsx`

As perguntas 2 e 3 são novas: tratam das duas maiores dúvidas de quem tem equipe de atendimento e CRM. A resposta 1 depende de P9.

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| kicker | FAQ | Dúvidas | Questions |
| title | Perguntas frequentes | Perguntas frequentes | Frequently asked questions |
| items[0] | **Como funciona o diagnóstico gratuito de 30 minutos?** É uma conversa objetiva com nosso time: você apresenta a operação e nós mapeamos onde IA e automação geram mais impacto, com estimativa de retorno. Você sai com um direcionamento claro, mesmo que decida não seguir com a gente. Sem compromisso e sem apresentação de vendas disfarçada. | **Como funciona o diagnóstico gratuito?** Você preenche um questionário sobre a rotina da empresa. Em até 24 horas, enviamos uma pré-análise por e-mail e WhatsApp. Depois, numa conversa de 30 minutos, mostramos por onde começar. Você sai com um caminho claro, mesmo que decida não seguir com a gente. Sem compromisso. | **How does the free diagnosis work?** You fill in a questionnaire about how your company works. Within 24 hours we send you a first analysis by email and WhatsApp. Then, in a 30-minute conversation, we show you where to start. You leave with a clear path, even if you decide not to work with us. No commitment. |
| items[1] (novo) | | **A IA vai substituir minha equipe?** Não. A IA cuida do que se repete: responder dúvidas comuns, registrar informações, lembrar dos retornos. Sua equipe fica com o que precisa de gente: a conversa, a negociação e a decisão. | **Will AI replace my team?** No. AI takes care of the repetitive part: answering common questions, logging information, remembering follow-ups. Your team keeps what needs a person: the conversation, the negotiation and the decision. |
| items[2] (novo) | | **Funciona com o CRM que eu já uso?** Integrar a IA ao CRM é parte central do nosso trabalho. No diagnóstico, olhamos o sistema que você usa e explicamos como a conexão vai funcionar antes de qualquer proposta. | **Does it work with the CRM I already use?** Connecting AI to your CRM is a core part of what we do. In the diagnosis, we look at the system you use and explain how the connection will work before any proposal. |
| items[3] | **Qual o prazo típico de um projeto?** As primeiras automações costumam entrar no ar em poucas semanas, não meses. Projetos completos variam com o escopo, mas trabalhamos com entregas incrementais: você vê resultado funcionando desde o primeiro ciclo. Prazos e marcos ficam definidos antes de começar. | **Quanto tempo leva para começar a funcionar?** As primeiras soluções costumam entrar no ar em poucas semanas, não em meses. Trabalhamos em etapas, e você vê algo funcionando desde a primeira entrega. Prazos e etapas ficam combinados antes de começar. | **How long until it's up and running?** The first solutions usually go live within a few weeks, not months. We work in steps, so you see something working from the first delivery. Timelines and steps are agreed before we start. |
| items[4] | **Preciso ter equipe técnica?** Não. Nós cuidamos de arquitetura, desenvolvimento, integração e monitoramento, além de treinar seu time para operar o dia a dia. Se você já tem equipe técnica, melhor ainda: ela é envolvida desde o início e sai dominando as ferramentas. | **Preciso ter equipe técnica?** Não. Nós cuidamos da configuração, da integração e do acompanhamento, e ensinamos sua equipe a usar no dia a dia. Se você já tem equipe técnica, ela participa desde o início. | **Do I need a technical team?** No. We handle setup, integration and follow-up, and we teach your team to use it day to day. If you already have a technical team, they're involved from the start. |
| items[5] | **Como ficam a segurança e a LGPD dos meus dados?** Seus dados continuam seus. Trabalhamos com acordo de confidencialidade, acesso mínimo necessário e infraestrutura sob seu controle sempre que possível. Cada projeto considera a LGPD desde o desenho da solução, não como remendo no final. | **E a segurança dos meus dados?** Seus dados continuam seus. Trabalhamos com acordo de confidencialidade, acesso só ao que é necessário e, sempre que possível, com a estrutura sob o seu controle. A LGPD entra desde o desenho da solução, não como remendo no final. | **What about the security of my data?** Your data stays yours. We work under a confidentiality agreement, access only what's needed and, whenever possible, keep the infrastructure under your control. Brazil's data protection law (LGPD) is part of the design from day one, not a patch at the end. |
| items[6] | **Quais são os modelos de contratação e o investimento?** Trabalhamos com projetos de escopo fechado e com assessoria contínua mensal. O investimento depende do escopo. Por isso o diagnóstico vem antes: você recebe uma proposta com números e retorno esperado, e decide com base em dados. Sem surpresa no meio do caminho. | **Quanto custa?** Depende do que a sua empresa precisa. Trabalhamos com projetos de escopo fechado e com acompanhamento mensal. Depois do diagnóstico, você recebe uma proposta clara, com valores e o que esperar, e decide com calma. Sem surpresa no meio do caminho. | **How much does it cost?** It depends on what your company needs. We work with fixed-scope projects and monthly support plans. After the diagnosis you get a clear proposal, with prices and what to expect, and decide in your own time. No surprises along the way. |
| items[7] | **Funciona para o meu setor?** IA e automação resolvem problemas de processo. E todo setor tem processos: atendimento, vendas, financeiro, operações. Já entregamos projetos em serviços, varejo, indústria e saúde. E somos francos no diagnóstico: se IA não fizer sentido para o seu caso agora, dizemos isso. | **Funciona para o meu setor?** Hoje nosso foco é o mercado imobiliário, com atendimento integrado ao CRM. Mas já entregamos projetos em serviços, varejo, indústria e saúde. E somos francos: se a IA não fizer sentido para o seu caso agora, dizemos isso. | **Does it work for my industry?** Our focus today is real estate, with customer service connected to the CRM. But we've delivered projects in services, retail, manufacturing and healthcare. And we're honest: if AI doesn't make sense for your case right now, we'll tell you. |
| items[8] | **E depois da entrega, tem suporte?** Tem. Nenhum projeto é entregue e abandonado: toda solução sai com monitoramento, documentação e time treinado. Para quem quer evoluir continuamente, a assessoria mensal mantém o sistema otimizado e a operação acompanhada de perto. | **E depois da entrega, tem suporte?** Tem. Toda solução sai com monitoramento, documentação e equipe treinada. Com o acompanhamento mensal, seguimos ajustando e melhorando junto com você. | **Is there support after launch?** Yes. Every solution ships with monitoring, documentation and a trained team. With monthly support, we keep fine-tuning and improving it with you. |

## 13. CTA final (contato) — `components/sections/cta-final.tsx` + `lib/i18n` (`contato`)

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| title | Vamos transformar seu negócio com | O que pode ficar | What could be |
| titleEm | IA de verdade? | **mais simples na sua empresa?** | **simpler at your company?** |
| desc | Agende um diagnóstico gratuito. Em 30 minutos mapeamos onde IA gera mais impacto na sua empresa. | Agende um diagnóstico gratuito. Em 30 minutos, mostramos onde a IA ajuda primeiro na sua rotina. | Book a free diagnosis. In 30 minutes, we'll show you where AI can help your routine first. |
| cta (→ `/diagnostico`) | Agendar Diagnóstico Gratuito | Vamos conversar | Let's talk |
| emailCta | FALAR POR E-MAIL | Prefiro e-mail | Email us instead |
| email | contato@simplexsolucoes.com.br | sem mudança (ver P10) | sem mudança |
| location | Mato Grosso, Brasil | sem mudança (ver P8) | Mato Grosso, Brazil |

## 14. Rodapé — `components/sections/footer.tsx` + `lib/i18n` (`footer`)

Os links de navegação usam os textos da seção 0.

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| navigation | NAVEGAÇÃO | Navegação | Navigation |
| contact | CONTATO | Contato | Contact |
| legal | LEGAL | Legal | Legal |
| privacy | POLÍTICA DE PRIVACIDADE | Política de privacidade | Privacy policy |
| terms | TERMOS DE USO | Termos de uso | Terms of use |
| origin | FEITO EM MATO GROSSO, BRASIL | Feito no interior de Mato Grosso | Made in inland Mato Grosso, Brazil |
| footer.copy | SPXIA © 2026 · Consultoria, Automação e IA para Negócios | SPXia © 2026 · Inteligência artificial para uma rotina mais simples | SPXia © 2026 · Artificial intelligence for a simpler routine |
| texto do lettering (prop `text`, lido por leitor de tela) | SPX IA | SPXia | SPXia |

## 15. Outros textos de interface (sem mudança de tom)

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| preloader (`site-preloader.tsx`) | carregando · pronto · estrutura / fontes / recursos | sem mudança (se o preloader ficar) | loading · ready · structure / fonts / assets |
| seletor de idioma (`language-switcher.tsx`) | Selecionar idioma · Idiomas · Português (Brasil) | sem mudança | Select language · Languages · English (US) |

## 16. /diagnostico — `app/diagnostico/page.tsx`

Hoje a página só existe em pt.

### Topo e progresso

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| aria-label do logo | Voltar para a home da SPXIA | Voltar para a página inicial da SPXia | Back to the SPXia home page |
| link de voltar | Voltar ao site | Voltar ao site | Back to the site |
| progresso | Etapa {n} de {total} | Etapa {n} de {total} | Step {n} of {total} |
| aria-label da barra | Progresso do diagnóstico | Progresso do diagnóstico | Diagnosis progress |
| metadata title (novo, exige um `layout.tsx` porque a página é client) | | Diagnóstico gratuito | Free diagnosis |

### Etapa 1 — contato

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| label | ETAPA 1 DE {total} | Etapa 1 de {total} | Step 1 of {total} |
| title / titleEm | Seus **dados** | Para **começar** | Let's **get started** |
| desc | Primeiro, nos conte sobre você e sua empresa. | Conte um pouco sobre você e sua empresa. | Tell us a little about you and your company. |
| nome (rótulo / placeholder) | Seu nome \* / Nome completo | Seu nome \* / Nome completo | Your name \* / Full name |
| e-mail | E-mail \* / seu@email.com | E-mail \* / seu@email.com | Email \* / you@email.com |
| WhatsApp | WhatsApp \* / (00) 00000-0000 | WhatsApp \* / (00) 00000-0000 | WhatsApp \* / (00) 00000-0000 |
| empresa | Nome da empresa \* / Empresa LTDA | Nome da empresa \* / Empresa LTDA | Company name \* / Company Ltd. |
| CNPJ | CNPJ / 00.000.000/0000-00 | CNPJ / 00.000.000/0000-00 | CNPJ (Brazilian company ID) / 00.000.000/0000-00 |
| ramo | Ramo de atuação \* / Ex.: Tecnologia, Varejo, Saúde, Indústria | Ramo de atuação \* / Ex.: imobiliária, incorporadora, varejo, saúde | Industry \* / e.g. real estate agency, developer, retail, healthcare |
| negócio | Descreva brevemente seu negócio \* / O que sua empresa faz? Quantos funcionários? Quais os principais desafios? | Conte sobre o seu negócio \* / O que sua empresa faz? Quantas pessoas trabalham nela? O que mais toma tempo hoje? | Tell us about your business \* / What does your company do? How many people work there? What takes up the most time today? |
| botões | Cancelar / Próximo | Cancelar / Próximo | Cancel / Next |

### Etapas de perguntas

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| label | ETAPA {n} DE {total} | Etapa {n} de {total} | Step {n} of {total} |
| title / titleEm | Diagnóstico **estratégico** | Como é a **sua rotina** | Your **day-to-day** |
| desc | Todas as perguntas são obrigatórias. Responda com o máximo de detalhes. | Todas as perguntas são obrigatórias. Quanto mais detalhes, melhor a análise. | All questions are required. The more detail you give, the better the analysis. |
| erro do campo | Esta pergunta é obrigatória | Responda esta pergunta para continuar | Answer this question to continue |
| aviso | Preencha todas as perguntas antes de avançar. | Ainda faltam respostas nesta página. | Some questions on this page are still unanswered. |
| botões | Voltar / Próximo / Revisar e Enviar | Voltar / Próximo / Revisar e enviar | Back / Next / Review and send |

### As 20 perguntas (pergunta / _placeholder_)

Os ids `q1`…`q20` não mudam. O sentido de cada pergunta foi mantido para não afetar a análise. Ver P9 sobre a quantidade.

| id | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| q1 | Qual é o principal objetivo da empresa ao investir em IA? / _Ex.: aumentar vendas, reduzir custos, ganhar produtividade, melhorar atendimento, automatizar processos._ | O que a empresa mais quer melhorar com IA? / _Ex.: vender mais, gastar menos, atender melhor, ganhar tempo._ | What does your company most want to improve with AI? / _e.g. sell more, spend less, serve customers better, save time._ |
| q2 | Quais resultados hoje estão abaixo do esperado e precisam melhorar com urgência? / _Descreva as dores mais críticas do negócio._ | O que hoje está abaixo do esperado e precisa melhorar logo? / _Conte o que mais preocupa no momento._ | What is below expectations today and needs to improve soon? / _Tell us what worries you most right now._ |
| q3 | Quais processos da empresa são mais repetitivos, manuais e demorados? / _Esses são os primeiros candidatos para automação com IA._ | Quais tarefas se repetem mais e tomam mais tempo? / _Costumam ser as primeiras a ficar mais simples._ | Which tasks repeat the most and take the most time? / _These are usually the first to get simpler._ |
| q4 | Quais áreas da empresa mais sofrem com gargalos? / _Ex.: Comercial, atendimento, financeiro, jurídico, RH, operações, marketing._ | Em quais áreas o trabalho mais trava? / _Ex.: comercial, atendimento, financeiro, jurídico, RH, operações, marketing._ | Where does work get stuck the most? / _e.g. sales, customer service, finance, legal, HR, operations, marketing._ |
| q5 | Quais tarefas dependem muito de pessoas para analisar, responder, classificar ou decidir? / _Esses pontos costumam ter alto potencial para IA._ | Quais tarefas dependem de alguém para analisar, responder, classificar ou decidir? / _Nesses pontos, a IA costuma ajudar bastante._ | Which tasks need someone to review, answer, sort or decide? / _AI tends to help a lot here._ |
| q6 | Hoje a empresa perde dinheiro onde? / _Ex.: retrabalho, demora no atendimento, erros humanos, baixa conversão, falta de follow-up._ | Onde a empresa perde dinheiro hoje? / _Ex.: retrabalho, demora para responder, erros, poucas vendas fechadas, cliente sem retorno._ | Where is your company losing money today? / _e.g. rework, slow replies, mistakes, few closed deals, customers left without follow-up._ |
| q7 | Quais indicadores a empresa quer melhorar com IA? / _Ex.: faturamento, margem, NPS, tempo de resposta, taxa de conversão, produtividade._ | Quais números a empresa quer ver melhorar? / _Ex.: faturamento, margem, satisfação dos clientes, tempo de resposta, vendas fechadas._ | Which numbers do you want to see improve? / _e.g. revenue, margin, customer satisfaction, response time, closed deals._ |
| q8 | A empresa possui dados organizados para apoiar decisões? / _Sem dados minimamente estruturados, projetos de IA ficam limitados._ | As informações da empresa estão organizadas? / _A IA trabalha melhor quando os dados têm alguma ordem._ | Is your company's information organized? / _AI works better when the data has some order._ |
| q9 | Onde esses dados estão hoje? / _Ex.: ERP, CRM, planilhas, WhatsApp, e-mail, sistema financeiro, banco de dados._ | Onde essas informações ficam hoje? / _Ex.: CRM, ERP, planilhas, WhatsApp, e-mail, sistema financeiro._ | Where is that information kept today? / _e.g. CRM, ERP, spreadsheets, WhatsApp, email, finance system._ |
| q10 | A qualidade dos dados atuais é confiável? / _Dados duplicados, incompletos ou desatualizados comprometem o resultado._ | Dá para confiar nessas informações? / _Dados repetidos, incompletos ou desatualizados atrapalham o resultado._ | Can you trust that information? / _Duplicate, incomplete or outdated data gets in the way._ |
| q11 | A empresa já possui sistemas integráveis? / _Ex.: APIs, ERP, CRM, automações, banco de dados, plataformas de atendimento._ | Quais sistemas a empresa já usa? / _Ex.: CRM, ERP, plataforma de atendimento, automações, banco de dados._ | Which systems does your company already use? / _e.g. CRM, ERP, customer service platform, automations, database._ |
| q12 | Quais decisões hoje são tomadas mais por feeling do que por informação? / _A IA pode apoiar com previsões, análises e recomendações._ | Quais decisões hoje são tomadas mais no instinto do que com informação? / _A IA pode ajudar com análises, previsões e sugestões._ | Which decisions are made more on gut feeling than on information? / _AI can help with analysis, forecasts and suggestions._ |
| q13 | Existe volume suficiente de demanda para justificar automação com IA? / _Ex.: grande número de leads, atendimentos, documentos, chamados, contratos._ | Quanto volume a empresa recebe por mês? / _Ex.: número de contatos, atendimentos, documentos, chamados ou contratos._ | How much volume does your company handle per month? / _e.g. number of leads, conversations, documents, tickets or contracts._ |
| q14 | Quais atividades precisam acontecer com mais velocidade? / _Ex.: atendimento, orçamento, proposta, triagem, cobrança, suporte._ | O que precisa acontecer mais rápido? / _Ex.: atendimento, orçamento, proposta, triagem, cobrança, suporte._ | What needs to happen faster? / _e.g. customer service, quotes, proposals, screening, billing, support._ |
| q15 | Quais áreas precisam de maior padronização? / _IA funciona muito bem para manter padrão em comunicação, análise e execução._ | Onde falta padrão no jeito de fazer as coisas? / _A IA ajuda a manter o mesmo padrão na comunicação, na análise e na execução._ | Where is there no standard way of doing things? / _AI helps keep the same standard in communication, analysis and execution._ |
| q16 | A equipe está preparada para usar IA no dia a dia? / _Maturidade digital, resistência cultural e necessidade de treinamento._ | Como a equipe se sente em relação a usar IA no dia a dia? / _Familiaridade com tecnologia, resistência e necessidade de treinamento._ | How does your team feel about using AI day to day? / _Comfort with technology, resistance and training needs._ |
| q17 | Quem serão os responsáveis internos pelo projeto de IA? / _Sem dono do projeto, a implantação tende a perder força._ | Quem vai cuidar do projeto dentro da empresa? / _Sem um responsável, a implantação perde força._ | Who will own the project inside your company? / _Without an owner, the rollout tends to lose steam._ |
| q18 | Quais riscos a empresa precisa controlar ao usar IA? / _Ex.: segurança da informação, privacidade, erros, LGPD, impacto operacional._ | Que cuidados a empresa precisa ter ao usar IA? / _Ex.: segurança da informação, privacidade, LGPD, erros, impacto na operação._ | What does your company need to be careful about when using AI? / _e.g. information security, privacy, data protection law (LGPD), errors, impact on operations._ |
| q19 | Qual orçamento e expectativa de retorno para a implantação? / _Define prioridade, escopo e velocidade do projeto._ | Quanto a empresa pretende investir e que retorno espera? / _Isso ajuda a definir prioridade, tamanho e ritmo do projeto._ | How much do you plan to invest, and what return do you expect? / _This helps set the priority, size and pace of the project._ |
| q20 | Se a IA desse certo em 90 dias, o que teria mudado na prática? / _Transforme intenção em meta objetiva e mensurável._ | Se a IA desse certo em 90 dias, o que teria mudado na prática? / _Descreva uma meta clara, que dê para medir._ | If AI worked out in 90 days, what would have changed in practice? / _Describe a clear goal you could measure._ |

### Etapa final, envio, sucesso e erro

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| label | ETAPA FINAL | Última etapa | Last step |
| title / titleEm | Confirmar **envio** | Tudo **certo?** | All **set?** |
| desc | Revise seus dados e complete a verificação para enviar o diagnóstico. | Confira seus dados e faça a verificação para enviar. | Check your details and complete the verification to send. |
| blocos de revisão | Seus dados / Respostas | Seus dados / Suas respostas | Your details / Your answers |
| linhas de revisão | Nome / E-mail / WhatsApp / Empresa / Ramo | sem mudança | Name / Email / WhatsApp / Company / Industry |
| erro de verificação | Complete o reCAPTCHA para enviar. | Faça a verificação para enviar. | Complete the verification to send. |
| aviso sem chave reCAPTCHA (só em ambiente mal configurado) | Verificação anti-spam indisponível: defina NEXT_PUBLIC_RECAPTCHA_SITE_KEY para ativar o reCAPTCHA. | sem mudança (texto para desenvolvedor) | sem mudança |
| botões | Voltar / Enviar diagnóstico | Voltar / Enviar diagnóstico | Back / Send diagnosis |
| enviando (título / texto) | Enviando diagnóstico... / Estamos salvando suas respostas. | Enviando… / Estamos salvando suas respostas. | Sending… / We're saving your answers. |
| sucesso: title / titleEm | Diagnóstico **enviado!** | Recebemos **suas respostas.** | We got **your answers.** |
| sucesso: texto | Recebemos suas respostas e vamos analisar com IA antes de entrar em contato. Você receberá uma pré-análise pelo e-mail e WhatsApp em até 24h. | Agora analisamos tudo com a ajuda da IA. Em até 24 horas, você recebe uma pré-análise por e-mail e WhatsApp, e nossa equipe entra em contato. | Now we review everything with the help of AI. Within 24 hours you'll get a first analysis by email and WhatsApp, and our team will reach out. |
| sucesso: passos | Dados coletados / Análise com IA / Contato da equipe | Respostas recebidas / Análise com IA / Conversa com a equipe | Answers received / AI analysis / Talk with our team |
| sucesso: botão | Voltar ao site | Voltar ao site | Back to the site |
| erro: título | Erro ao enviar | Não conseguimos enviar | We couldn't send it |
| erro: texto | {mensagem crua do Supabase, em inglês} | Algo falhou do nosso lado. Tente de novo em instantes; suas respostas continuam aqui. | Something went wrong on our side. Please try again in a moment; your answers are still here. |
| erro: botão | Tentar novamente | Tentar novamente | Try again |
| rodapé | SPX IA · seus dados são usados apenas para a análise do diagnóstico | SPXia · Seus dados são usados apenas para este diagnóstico. | SPXia · Your data is used only for this diagnosis. |

## 17. /checkout — `app/checkout/layout.tsx` + `app/checkout/[slug]/page.tsx`

Hoje a página só existe em pt. Nome, descrição e preço do produto vêm do banco.

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| metadata title | Checkout | Pagamento | Checkout |
| carregando | Carregando... | Carregando… | Loading… |
| produto não encontrado: título | Produto não encontrado | Produto não encontrado | Product not found |
| produto não encontrado: texto | O link que você acessou não corresponde a nenhum produto disponível. Ele pode ter saído do ar ou o endereço foi digitado errado. | Este link não leva a nenhum produto disponível. Ele pode ter saído do ar ou ter sido digitado errado. | This link doesn't lead to any available product. It may have been taken down or typed incorrectly. |
| produto não encontrado: botões | Agendar Diagnóstico / Voltar para a home | Vamos conversar / Voltar ao início | Let's talk / Back to home |
| rótulo do resumo (sem categoria) | Resumo do pedido | Resumo do pedido | Order summary |
| parcelas | ou {n}x R$ {valor} | ou {n}x de R$ {valor} | or {n} installments of R$ {value} |
| ciclo da assinatura | /mês · /trim · /sem · /ano | /mês · /trimestre · /semestre · /ano | /month · /quarter · /6 months · /year |
| formulário: título / texto | Dados para pagamento / Preencha seus dados para gerar a cobrança. | sem mudança | Payment details / Fill in your details to generate the charge. |
| campos (rótulo / placeholder) | Nome completo \* (Seu nome) · E-mail \* (seu@email.com) · CPF ou CNPJ \* (000.000.000-00) · WhatsApp ((00) 00000-0000) · Forma de pagamento \* | sem mudança | Full name \* (Your name) · Email \* (you@email.com) · CPF or CNPJ (Brazilian tax ID) \* (000.000.000-00) · WhatsApp ((00) 00000-0000) · Payment method \* |
| formas de pagamento | Pix · Boleto · Cartão | Pix · Boleto · Cartão | Pix · Boleto (bank slip) · Card |
| botão | Assinar / Pagar R$ {valor} | sem mudança | Subscribe / Pay R$ {value} |
| selo | Pagamento processado com segurança via Asaas | Pagamento seguro, processado pela Asaas | Secure payment processed by Asaas |
| processando | Processando pagamento... / Aguarde, estamos gerando sua cobrança. | Processando pagamento… / Só um instante, estamos gerando sua cobrança. | Processing payment… / One moment, we're generating your charge. |
| sucesso: título | Cobrança gerada! | Cobrança gerada! | Charge created! |
| alt do QR Code | QR Code do Pix | QR Code do Pix | Pix QR code |
| Pix copia e cola | Pix Copia e Cola · Copiar · Copiado! · Clique para copiar | Pix copia e cola · Copiar · Copiado! · Clique para copiar | Pix copy-and-paste code · Copy · Copied! · Click to copy |
| boleto / fatura | Abrir Boleto / Ver Fatura | Abrir boleto / Ver fatura | Open bank slip / View invoice |
| acesso | Após a confirmação do pagamento, seu acesso será liberado automaticamente. / Use o e-mail {email} para acessar a plataforma. / Acessar Plataforma | Assim que o pagamento for confirmado, seu acesso é liberado automaticamente. / Use o e-mail {email} para entrar na plataforma. / Acessar plataforma | As soon as payment is confirmed, your access is unlocked automatically. / Use {email} to sign in to the platform. / Go to platform |
| erro: título / botão | Erro no pagamento / Tentar novamente | O pagamento não foi concluído / Tentar novamente | Payment not completed / Try again |
| erro: mensagem padrão | Erro ao processar pagamento | Não conseguimos processar o pagamento. Tente de novo. | We couldn't process the payment. Please try again. |

## 18. /login — `app/login/page.tsx` + `lib/auth-errors.ts`

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| entrar: título / texto | Entrar / Área de membros SPXIA | Entrar / Área de membros SPXia | Sign in / SPXia members area |
| criar conta: título / texto | Criar Conta / Acesse a área de membros SPXIA | Criar conta / Crie seu acesso à área de membros SPXia | Create account / Create your access to the SPXia members area |
| recuperar: título / texto | Recuperar Senha / Informe seu e-mail para redefinir a senha | Recuperar senha / Informe seu e-mail e enviamos um link para criar uma nova senha | Reset password / Enter your email and we'll send you a link to set a new password |
| campos (rótulo / placeholder) | Nome completo (Seu nome) · E-mail (seu@email.com) · Senha (Mínimo 6 caracteres) | sem mudança | Full name (Your name) · Email (you@email.com) · Password (At least 6 characters) |
| link | Esqueceu a senha? | Esqueceu a senha? | Forgot your password? |
| botão | Aguarde... / Enviar E-mail / {título} | Aguarde… / Enviar link / {título} | Please wait… / Send link / {title} |
| trocas de modo | Lembrou a senha? Fazer login · Já tem conta? Fazer login · Não tem conta? Criar conta | Lembrou a senha? Entrar · Já tem conta? Entrar · Ainda não tem conta? Criar conta | Remembered it? Sign in · Already have an account? Sign in · Don't have an account? Create one |
| sucesso: recuperação | E-mail de recuperação enviado! Verifique sua caixa de entrada. | Enviamos o link para o seu e-mail. Confira a caixa de entrada. | We've sent the link to your email. Check your inbox. |
| sucesso: cadastro | Conta criada! Verifique seu e-mail para confirmar. | Conta criada. Confirme pelo link que enviamos ao seu e-mail. | Account created. Confirm it using the link we sent to your email. |

Mensagens de erro (`lib/auth-errors.ts`): o pt já está no tom e fica como está. Abaixo, o en.

| atual (pt) — fica | novo (en) |
|---|---|
| E-mail ou senha incorretos. | Incorrect email or password. |
| Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada. | Confirm your email before signing in. Check your inbox. |
| Este e-mail já está cadastrado. | This email is already registered. |
| A senha deve ter no mínimo 6 caracteres. | Your password must be at least 6 characters. |
| E-mail inválido. | Invalid email. |
| Aguarde alguns segundos antes de tentar novamente. | Wait a few seconds before trying again. |
| Muitas tentativas. Aguarde alguns minutos e tente de novo. | Too many attempts. Wait a few minutes and try again. |
| A nova senha deve ser diferente da senha atual. | Your new password must be different from the current one. |
| Link expirado ou inválido. Solicite a recuperação de senha novamente. | This link has expired or is invalid. Request a new password reset. |
| O link de recuperação expirou. Solicite um novo e-mail. | The reset link has expired. Request a new email. |
| Falha de conexão. Verifique sua internet e tente novamente. | Connection failed. Check your internet and try again. |
| Não foi possível concluir a operação. Tente novamente. | We couldn't complete that. Please try again. |

## 19. /redefinir-senha — `app/redefinir-senha/page.tsx`

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| título / texto | Nova Senha / Defina sua nova senha de acesso | Nova senha / Escolha sua nova senha de acesso | New password / Choose your new password |
| campos (rótulo / placeholder) | Nova senha (Mínimo 6 caracteres) · Confirmar senha (Repita a senha) | sem mudança | New password (At least 6 characters) · Confirm password (Repeat the password) |
| botão | Aguarde... / Redefinir Senha | Aguarde… / Salvar nova senha | Please wait… / Save new password |
| erro | As senhas não coincidem. | As senhas não são iguais. | The passwords don't match. |
| sucesso | Senha redefinida com sucesso! | Pronto, sua senha foi alterada. | Done, your password has been changed. |

## 20. Página 404 — `app/not-found.tsx`

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| kicker | 404 | 404 | 404 |
| título | Página não encontrada | Página não encontrada | Page not found |
| texto | O endereço que você tentou acessar não existe ou foi movido. | Este endereço não existe ou mudou de lugar. | This address doesn't exist or has moved. |
| botão | Voltar para o início | Voltar ao início | Back to home |

## 21. Página de erro — `app/error.tsx`

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| kicker | ERRO | Erro | Error |
| título | Algo deu errado | Algo deu errado | Something went wrong |
| texto | Ocorreu um erro inesperado. Tente novamente. Se persistir, fale com a gente em {e-mail}. | Algo não saiu como esperado. Tente de novo. Se continuar, fale com a gente em {e-mail}. | Something didn't work as expected. Please try again. If it keeps happening, write to us at {email}. |
| botões | Tentar novamente / Voltar para o início | Tentar de novo / Voltar ao início | Try again / Back to home |

## 22. Metadata e SEO — `app/layout.tsx`

O site é servido como pt-BR (`lang="pt-BR"`, `locale: pt_BR`) e a troca de idioma acontece no cliente, então só o pt vai para o HTML. O en fica pronto para uma versão em inglês ou para `alternates`.

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| title.default | SPXIA \| Intelligence and Automation | SPXia \| Sua rotina pode ser mais simples | SPXia \| Your routine can be simpler |
| title.template | SPXIA \| %s | %s \| SPXia | %s \| SPXia |
| description (148 / 145 caracteres) | SPXIA é a divisão de inteligência e automação da Simplex Soluções. Consultoria, desenvolvimento de sistemas, automações e projetos de IA sob medida. Da estratégia à produção, com resultados mensuráveis. | A SPXia conecta a IA ao atendimento e aos processos da sua empresa para reduzir tarefas repetitivas. IA de atendimento integrada ao CRM imobiliário. | SPXia connects AI to your company's customer service and processes to cut repetitive work. AI customer service connected to your real estate CRM. |
| keywords | inteligência artificial, IA para negócios, automação, consultoria em IA, agentes de IA, desenvolvimento de sistemas, n8n, chatbots, Mato Grosso, SPXIA, Simplex Soluções | inteligência artificial, IA para empresas, IA de atendimento, atendimento com IA, CRM imobiliário, IA para imobiliárias, IA para incorporadoras, automação de atendimento, Chat SPX, VoxIA, consultoria em IA, Mato Grosso, SPXia, Simplex Soluções | artificial intelligence, AI for business, AI customer service, real estate CRM, AI for real estate agencies, AI for real estate developers, customer service automation, Chat SPX, VoxIA, AI consulting, Mato Grosso, SPXia |
| openGraph.siteName | SPXIA | SPXia | SPXia |
| openGraph.title | SPXIA \| Intelligence and Automation | SPXia \| Sua rotina pode ser mais simples | SPXia \| Your routine can be simpler |
| openGraph.description | = description | = description nova | = description |
| openGraph.images[0].alt | SPX IA \| Intelligence and Automation | SPXia: sua rotina pode ser mais simples. | SPXia: your routine can be simpler. |
| twitter.title / description | iguais ao OG | iguais ao OG novo | same as OG |

## 23. llms.txt — `public/llms.txt`

O resumo segue o site. A linha de números traz só os dois que não dependem de P4. A seção "Treinamento" depende de P1. Os links legais passam a usar as rotas em português (hoje `/privacy` e `/terms` funcionam por redirecionamento).

| campo | atual (pt) | novo (pt) | novo (en) |
|---|---|---|---|
| título | SPXIA — Intelligence and Automation | SPXia — Inteligência artificial para uma rotina mais simples | SPXia — Artificial intelligence for a simpler routine |
| resumo (`>`) | A SPXIA é a divisão de inteligência artificial e automação da Simplex Soluções (Mato Grosso, Brasil). Consultoria, desenvolvimento de sistemas, automações e projetos de IA sob medida — da estratégia à produção, com resultados mensuráveis. | ver arquivo abaixo | see file below |
| frase | Seu negócio precisa de IA que funciona. Não de promessas. | Sua rotina pode ser mais simples. Menos tarefas repetidas, mais tempo para pessoas. | Your routine can be simpler. Fewer repeated tasks, more time for people. |
| números | 50+ projetos entregues · 40+ automações em produção · 3x ROI médio · 80% de redução de tempo em processos manuais · 100% dos clientes com ROI positivo | 50+ projetos entregues · 40+ automações ativas | 50+ projects delivered · 40+ active automations |

Arquivo proposto (pt):

```markdown
# SPXia — Inteligência artificial para uma rotina mais simples

> A SPXia conecta a inteligência artificial ao atendimento e aos processos das empresas para reduzir tarefas repetitivas. É a área de IA e automação da Simplex Soluções, no interior de Mato Grosso, Brasil. Foco atual: atendimento com IA integrado ao CRM de imobiliárias e incorporadoras.

Sua rotina pode ser mais simples. Menos tarefas repetidas, mais tempo para pessoas.

## Quem somos

SPX vem de Simplex. Ajudamos empresas a usar IA onde ela faz diferença no dia a dia: no atendimento, na organização das informações e nas tarefas que se repetem. Explicamos cada passo com clareza e seguimos junto depois da entrega.

Números: 50+ projetos entregues · 40+ automações ativas.

## Soluções

- Chat SPX: WhatsApp, Instagram, site e e-mail num só lugar. A IA responde na hora, tira dúvidas, entende o que o cliente procura e passa a conversa para a pessoa certa, com todo o histórico.
- VoxIA: a IA que liga e atende. Retorna o contato em poucos minutos, atende a qualquer hora, qualifica, agenda a visita e registra tudo no CRM.
- CRM e automações: integração da IA ao CRM e aos sistemas da equipe, com retornos automáticos.
- Sistemas sob medida: plataformas web, sistemas internos e integrações.
- Consultoria em IA: entendimento da rotina e plano em etapas, com investimento claro.
- Acompanhamento contínuo: suporte, treinamento da equipe e melhorias.

## Como funciona

1. Diagnóstico gratuito: questionário sobre a rotina, pré-análise em até 24 horas e conversa de 30 minutos.
2. Plano: o que simplificar primeiro, quanto custa e quanto tempo leva.
3. Implantação: configuração e integração, com entregas semanais validadas pelo cliente.
4. Acompanhamento: ajustes, treinamento da equipe e próximos passos.

## Projetos

- Copilot: sistema personalizado premium, feito sob medida para a operação do cliente.
- Chat SPX: assistente virtual que responde com base no conhecimento de cada empresa — https://www.chatspx.com.br/
- Gestão de Financiamento e Fomento (energia solar): propostas, simulações, aprovações e relatórios.
- Sistema de Ordens de Serviço: ordens de serviço, financeiro, estoque e clientes; tempo de atendimento 60% menor.
- Captador Inteligente: prospecção com IA, integrada ao WhatsApp e ao CRM.
- Agentes de IA no WhatsApp: atendimento a qualquer hora; tempo de resposta 80% menor.

## Treinamento

- IA para quem decide (donos, diretores e gestores).
- IA para equipes técnicas (desenvolvedores e analistas): Claude Code, agentes, n8n e APIs.
- Mentoria individual (empreendedores e profissionais): encontros semanais com plano de ação.

## Contato

- E-mail: contato@simplexsolucoes.com.br
- Localização: Mato Grosso, Brasil
- Site: https://spx.ia.br
- Diagnóstico gratuito: https://spx.ia.br/diagnostico

## Links

- [Página inicial](https://spx.ia.br)
- [Diagnóstico gratuito](https://spx.ia.br/diagnostico)
- [Política de privacidade](https://spx.ia.br/privacidade)
- [Termos de uso](https://spx.ia.br/termos)
- [Chat SPX](https://www.chatspx.com.br/)
- [Simplex Soluções](https://simplexsolucoes.com.br)
```

Arquivo proposto (en). Sugestão: publicar como `/llms-en.txt` ou anexar ao fim do `llms.txt`.

```markdown
# SPXia — Artificial intelligence for a simpler routine

> SPXia connects artificial intelligence to companies' customer service and processes to cut repetitive work. It is the AI and automation arm of Simplex Soluções, based in inland Mato Grosso, Brazil. Current focus: AI customer service connected to the CRM of real estate agencies and developers.

Your routine can be simpler. Fewer repeated tasks, more time for people.

## About us

SPX comes from Simplex. We help companies use AI where it makes a difference day to day: in customer service, in keeping information organized and in the tasks that repeat. We explain every step clearly and stay with you after launch.

Numbers: 50+ projects delivered · 40+ active automations.

## Solutions

- Chat SPX: WhatsApp, Instagram, website and email in one place. AI replies right away, answers questions, understands what the customer is looking for and hands the conversation to the right person, with the full history.
- VoxIA: the AI that makes and takes calls. It calls new contacts back within minutes, answers at any hour, qualifies, books the visit and logs everything in the CRM.
- CRM and automations: AI connected to the CRM and the team's systems, with automatic follow-ups.
- Custom systems: web platforms, internal systems and integrations.
- AI consulting: understanding the routine and a step-by-step plan with clear costs.
- Ongoing support: support, team training and improvements.

## How it works

1. Free diagnosis: a questionnaire about the routine, a first analysis within 24 hours and a 30-minute conversation.
2. Plan: what to simplify first, what it costs and how long it takes.
3. Setup: configuration and integration, with weekly deliveries approved by the client.
4. Follow-up: fine-tuning, team training and next steps.

## Projects

- Copilot: premium custom system, tailor-made for the client’s operation.
- Chat SPX: a virtual assistant that answers from each company's own knowledge — https://www.chatspx.com.br/
- Financing & Funding Management (solar energy): proposals, simulations, approvals and reports.
- Service Order System: service orders, finances, inventory and customers; service time cut by 60%.
- Smart Lead Capture: AI prospecting connected to WhatsApp and the CRM.
- AI agents on WhatsApp: service at any hour; response time cut by 80%.

## Training

- AI for decision-makers (owners, directors and managers).
- AI for technical teams (developers and analysts): Claude Code, agents, n8n and APIs.
- One-on-one mentoring (business owners and professionals): weekly sessions with an action plan.

## Contact

- Email: contato@simplexsolucoes.com.br
- Location: Mato Grosso, Brazil
- Website: https://spx.ia.br
- Free diagnosis: https://spx.ia.br/diagnostico

## Links

- [Home](https://spx.ia.br)
- [Free diagnosis](https://spx.ia.br/diagnostico)
- [Privacy policy](https://spx.ia.br/privacidade)
- [Terms of use](https://spx.ia.br/termos)
- [Chat SPX](https://www.chatspx.com.br/)
- [Simplex Soluções](https://simplexsolucoes.com.br)
```

---

## Perguntas ao usuário

| # | Pergunta | Minha recomendação |
|---|---|---|
| P1 | **Mentoria** (seção 06): manter? Ela fala com líderes e desenvolvedores, e o novo público é o dono de empresa que quer uma rotina mais simples. | Manter, renomeada para "Treinamento" (texto da seção 9), como apoio às soluções. O programa "IA para equipes técnicas" (Claude Code, n8n) é o que menos combina. Eu tiraria, a menos que ele ainda venda. |
| P2 | **Produtos** (seção 07, cursos com checkout, hoje oculta pela flag): mantém? | Continua oculta. O texto novo fica pronto caso volte. `/checkout` e `/login` seguem funcionando para quem tem o link. |
| P3 | **Frase do Paulo Seze**: manter a citação ("IA não é sobre tecnologia…") ou trocar? | Trocar pela frase da marca "A tecnologia trabalha. **O tempo é seu.**", sem assinatura (opção A). Se quiser a voz do Paulo, peça a ele uma frase no tom novo. Não reescrevi palavras atribuídas a ele. |
| P4 | **Números**: "3x ROI médio", "80% de redução de tempo" e "100% dos clientes com ROI positivo" (este último no hero e no llms.txt) podem ser comprovados? | Manter "50+ projetos" e "40+ automações". Os outros entram só se houver como mostrar de onde vêm. Se não houver, a seção Resultados fica com os dois números, mais o −60% e o −80% dos projetos, que têm um case por trás. Confirmar também "50 empresas atendidas" (os avatares da Mentoria). |
| P5 | **Faixa de tecnologias** (n8n, OpenAI, Docker, PostgreSQL…): faz sentido para o dono de imobiliária? | Trocar os logos pelos canais que o cliente reconhece (WhatsApp, Instagram, e-mail, telefone, CRM), com o rótulo "Funciona com o que sua equipe já usa". A outra opção é remover a faixa. |
| P6 | **Nome e duplicidade**: o site escreve "ChatSPX" e o roteiro e a política de privacidade escrevem "Chat SPX". O card ChatSPX em Projetos repete o produto de Soluções. | Grafar "Chat SPX" em tudo. Em Projetos, tirar o card Chat SPX ou trocá-lo por um caso de cliente real, se puder ser citado. |
| P7 | **Chat SPX e VoxIA**: ficam como os dois primeiros cards de Soluções (como está aqui) ou ganham uma seção própria? A VoxIA tem página ou link? | Nesta rodada, ficam em Soluções (menos mudança de layout). Numa segunda fase, criar uma seção própria logo depois do Problema, com o título "IA de atendimento integrada ao seu CRM imobiliário." e as telas do vídeo (`folha-12-quadros.jpg`). |
| P8 | **Localização**: "Mato Grosso, Brasil" ou "Sinop, MT" (que aparece na capa do manual)? | "Sinop, Mato Grosso", se a empresa quiser ser vista como local, o que reforça a proximidade. Só troco com a sua confirmação. |
| P9 | **Fluxo do diagnóstico**: hoje o site promete uma "conversa de 30 minutos" e a página pede um questionário com pré-análise em até 24h. O texto novo junta os dois (questionário → pré-análise em 24h → conversa de 30 min). Está certo? E as 20 perguntas obrigatórias combinam pouco com "simples" e com um botão chamado "Vamos conversar". | Confirmar o fluxo. Reduzir para umas 8 perguntas obrigatórias e deixar as outras opcionais. Essa é uma decisão de produto, então mantive as 20 e só simplifiquei a redação. |
| P10 | **E-mail de contato**: continua contato@simplexsolucoes.com.br ou existe um endereço @spx.ia.br? | Usar um e-mail do domínio da marca, se existir. Se não existir, mantém o atual. |
