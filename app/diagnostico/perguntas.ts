// Perguntas opcionais do formulário de diagnóstico. A página mostra; a rota /api/diagnostico usa o texto
// em pt como coluna da planilha. As outras perguntas do diagnóstico ficam para a conversa de 30 minutos
// (doc/planilha-diagnostico/roteiro-conversa.md).

export interface Question {
  id: string
  label: string
  placeholder: string
}

export const questionCopy: Record<'pt' | 'en', Question[]> = {
  pt: [
    { id: 'q1', label: 'O que a empresa mais quer melhorar com IA?', placeholder: 'Ex.: vender mais, gastar menos, atender melhor, ganhar tempo.' },
    { id: 'q3', label: 'Quais tarefas se repetem mais e tomam mais tempo?', placeholder: 'Costumam ser as primeiras a ficar mais simples.' },
    { id: 'q11', label: 'Quais sistemas a empresa já usa?', placeholder: 'Ex.: CRM, ERP, plataforma de atendimento, automações, banco de dados.' },
  ],
  en: [
    { id: 'q1', label: 'What does your company most want to improve with AI?', placeholder: 'e.g. sell more, spend less, serve customers better, save time.' },
    { id: 'q3', label: 'Which tasks repeat the most and take the most time?', placeholder: 'These are usually the first to get simpler.' },
    { id: 'q11', label: 'Which systems does your company already use?', placeholder: 'e.g. CRM, ERP, customer service platform, automations, database.' },
  ],
}
