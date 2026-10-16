// Perguntas do questionário. A página mostra; a rota /api/diagnostico usa o texto em pt como coluna da planilha.

export interface Question {
  id: string
  label: string
  placeholder: string
}

export const questionCopy: Record<"pt" | "en", Question[]> = {
  "pt": [
    {
      "id": "q1",
      "label": "O que a empresa mais quer melhorar com IA?",
      "placeholder": "Ex.: vender mais, gastar menos, atender melhor, ganhar tempo."
    },
    {
      "id": "q2",
      "label": "O que hoje está abaixo do esperado e precisa melhorar logo?",
      "placeholder": "Conte o que mais preocupa no momento."
    },
    {
      "id": "q3",
      "label": "Quais tarefas se repetem mais e tomam mais tempo?",
      "placeholder": "Costumam ser as primeiras a ficar mais simples."
    },
    {
      "id": "q4",
      "label": "Em quais áreas o trabalho mais trava?",
      "placeholder": "Ex.: comercial, atendimento, financeiro, jurídico, RH, operações, marketing."
    },
    {
      "id": "q5",
      "label": "Quais tarefas dependem de alguém para analisar, responder, classificar ou decidir?",
      "placeholder": "Nesses pontos, a IA costuma ajudar bastante."
    },
    {
      "id": "q6",
      "label": "Onde a empresa perde dinheiro hoje?",
      "placeholder": "Ex.: retrabalho, demora para responder, erros, poucas vendas fechadas, cliente sem retorno."
    },
    {
      "id": "q7",
      "label": "Quais números a empresa quer ver melhorar?",
      "placeholder": "Ex.: faturamento, margem, satisfação dos clientes, tempo de resposta, vendas fechadas."
    },
    {
      "id": "q8",
      "label": "As informações da empresa estão organizadas?",
      "placeholder": "A IA trabalha melhor quando os dados têm alguma ordem."
    },
    {
      "id": "q9",
      "label": "Onde essas informações ficam hoje?",
      "placeholder": "Ex.: CRM, ERP, planilhas, WhatsApp, e-mail, sistema financeiro."
    },
    {
      "id": "q10",
      "label": "Dá para confiar nessas informações?",
      "placeholder": "Dados repetidos, incompletos ou desatualizados atrapalham o resultado."
    },
    {
      "id": "q11",
      "label": "Quais sistemas a empresa já usa?",
      "placeholder": "Ex.: CRM, ERP, plataforma de atendimento, automações, banco de dados."
    },
    {
      "id": "q12",
      "label": "Quais decisões hoje são tomadas mais no instinto do que com informação?",
      "placeholder": "A IA pode ajudar com análises, previsões e sugestões."
    },
    {
      "id": "q13",
      "label": "Quanto volume a empresa recebe por mês?",
      "placeholder": "Ex.: número de contatos, atendimentos, documentos, chamados ou contratos."
    },
    {
      "id": "q14",
      "label": "O que precisa acontecer mais rápido?",
      "placeholder": "Ex.: atendimento, orçamento, proposta, triagem, cobrança, suporte."
    },
    {
      "id": "q15",
      "label": "Onde falta padrão no jeito de fazer as coisas?",
      "placeholder": "A IA ajuda a manter o mesmo padrão na comunicação, na análise e na execução."
    },
    {
      "id": "q16",
      "label": "Como a equipe se sente em relação a usar IA no dia a dia?",
      "placeholder": "Familiaridade com tecnologia, resistência e necessidade de treinamento."
    },
    {
      "id": "q17",
      "label": "Quem vai cuidar do projeto dentro da empresa?",
      "placeholder": "Sem um responsável, a implantação perde força."
    },
    {
      "id": "q18",
      "label": "Que cuidados a empresa precisa ter ao usar IA?",
      "placeholder": "Ex.: segurança da informação, privacidade, LGPD, erros, impacto na operação."
    },
    {
      "id": "q19",
      "label": "Quanto a empresa pretende investir e que retorno espera?",
      "placeholder": "Isso ajuda a definir prioridade, tamanho e ritmo do projeto."
    },
    {
      "id": "q20",
      "label": "Se a IA desse certo em 90 dias, o que teria mudado na prática?",
      "placeholder": "Descreva uma meta clara, que dê para medir."
    }
  ],
  "en": [
    {
      "id": "q1",
      "label": "What does your company most want to improve with AI?",
      "placeholder": "e.g. sell more, spend less, serve customers better, save time."
    },
    {
      "id": "q2",
      "label": "What is below expectations today and needs to improve soon?",
      "placeholder": "Tell us what worries you most right now."
    },
    {
      "id": "q3",
      "label": "Which tasks repeat the most and take the most time?",
      "placeholder": "These are usually the first to get simpler."
    },
    {
      "id": "q4",
      "label": "Where does work get stuck the most?",
      "placeholder": "e.g. sales, customer service, finance, legal, HR, operations, marketing."
    },
    {
      "id": "q5",
      "label": "Which tasks need someone to review, answer, sort or decide?",
      "placeholder": "AI tends to help a lot here."
    },
    {
      "id": "q6",
      "label": "Where is your company losing money today?",
      "placeholder": "e.g. rework, slow replies, mistakes, few closed deals, customers left without follow-up."
    },
    {
      "id": "q7",
      "label": "Which numbers do you want to see improve?",
      "placeholder": "e.g. revenue, margin, customer satisfaction, response time, closed deals."
    },
    {
      "id": "q8",
      "label": "Is your company's information organized?",
      "placeholder": "AI works better when the data has some order."
    },
    {
      "id": "q9",
      "label": "Where is that information kept today?",
      "placeholder": "e.g. CRM, ERP, spreadsheets, WhatsApp, email, finance system."
    },
    {
      "id": "q10",
      "label": "Can you trust that information?",
      "placeholder": "Duplicate, incomplete or outdated data gets in the way."
    },
    {
      "id": "q11",
      "label": "Which systems does your company already use?",
      "placeholder": "e.g. CRM, ERP, customer service platform, automations, database."
    },
    {
      "id": "q12",
      "label": "Which decisions are made more on gut feeling than on information?",
      "placeholder": "AI can help with analysis, forecasts and suggestions."
    },
    {
      "id": "q13",
      "label": "How much volume does your company handle per month?",
      "placeholder": "e.g. number of leads, conversations, documents, tickets or contracts."
    },
    {
      "id": "q14",
      "label": "What needs to happen faster?",
      "placeholder": "e.g. customer service, quotes, proposals, screening, billing, support."
    },
    {
      "id": "q15",
      "label": "Where is there no standard way of doing things?",
      "placeholder": "AI helps keep the same standard in communication, analysis and execution."
    },
    {
      "id": "q16",
      "label": "How does your team feel about using AI day to day?",
      "placeholder": "Comfort with technology, resistance and training needs."
    },
    {
      "id": "q17",
      "label": "Who will own the project inside your company?",
      "placeholder": "Without an owner, the rollout tends to lose steam."
    },
    {
      "id": "q18",
      "label": "What does your company need to be careful about when using AI?",
      "placeholder": "e.g. information security, privacy, data protection law (LGPD), errors, impact on operations."
    },
    {
      "id": "q19",
      "label": "How much do you plan to invest, and what return do you expect?",
      "placeholder": "This helps set the priority, size and pace of the project."
    },
    {
      "id": "q20",
      "label": "If AI worked out in 90 days, what would have changed in practice?",
      "placeholder": "Describe a clear goal you could measure."
    }
  ]
}
