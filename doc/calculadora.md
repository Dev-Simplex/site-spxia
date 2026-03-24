<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Agora vamos criar o prompt para criar uma calculadora para uma software house

Crie uma calculadora avançada de precificação para software houses, focada em projetos de desenvolvimento sob medida (web, sistemas internos, SaaS, integrações).
🎯 OBJETIVO
A calculadora deve permitir precificar projetos com alta precisão, garantindo:
margem saudável (50% a 70%)
cobertura de todos os custos reais
inclusão de risco técnico e de escopo
visão clara de esforço vs lucro
📥 INPUTS
🧑‍💻 Desenvolvimento
horas_backend
horas_frontend
horas_qa (testes)
valor_hora_dev
🧠 Gestão e Produto
percentual_gestao (ex: 0.15 a 0.25)
(inclui reuniões, alinhamentos, retrabalho, comunicação)
⚙️ Infraestrutura
custo_cloud
custo_apis
custo_ferramentas
⚠️ Risco
percentual_risco (0.2 a 0.4)
Fatores de risco incluem:
escopo aberto
cliente indeciso
integrações complexas
dependência de terceiros
💰 Financeiro
percentual_imposto (ex: 0.1)
margem_desejada (0.5 a 0.7)
🧮 PROCESSAMENTO

1. Cálculo de horas totais
horas_totais =
horas_backend + horas_frontend + horas_qa
2. Custo de desenvolvimento
custo_dev =
horas_totais * valor_hora_dev
3. Custo de gestão
custo_gestao =
custo_dev * percentual_gestao
4. Custo de infraestrutura
custo_infra =
custo_cloud + custo_apis + custo_ferramentas
5. Subtotal
subtotal =
custo_dev + custo_gestao + custo_infra
6. Impostos
imposto =
subtotal * percentual_imposto
7. Risco
risco =
subtotal * percentual_risco
8. Custo total
custo_total =
subtotal + imposto + risco
9. Preço final
preco_final =
custo_total / (1 - margem_desejada)
10. Lucro e margem
lucro =
preco_final - custo_total
margem_real =
lucro / preco_final
📊 CLASSIFICAÇÃO DO PROJETO
Baseado em horas_totais:
até 40h → Projeto Pequeno
41h a 120h → Projeto Médio
121h a 300h → Projeto Grande
acima de 300h → Projeto Enterprise
🧠 COMPLEXIDADE TÉCNICA
Adicionar um multiplicador opcional:
Baixa → x1.0
Média → x1.2
Alta → x1.5
Aplicar no custo_dev
🔌 INTEGRAÇÕES
Adicionar input:
numero_integracoes
Regra:
cada integração adiciona 5h a 15h automaticamente
🧱 MÓDULOS (SISTEMA DINÂMICO)
Permitir adicionar módulos ao projeto:
Cada módulo contém:
nome
horas_estimadas
complexidade
tipo (core ou extra)
Exemplos:
Autenticação
Dashboard
Pagamentos
Integração API externa
Painel admin
Notificações
🧮 CÁLCULO DOS MÓDULOS
Para cada módulo:
custo_modulo =
(horas_estimadas * valor_hora_dev)
multiplicador_complexidade
Somar ao custo total
🧠 LÓGICAS INTELIGENTES
11. Alertas
margem < 50% → alerta crítico
risco < 20% → alerta (subestimado)
gestão < 15% → alerta (subprecificado)
12. Insights automáticos
"Projeto com alto risco — considerar contrato mais rígido"
"Muitas integrações — revisar escopo"
"Margem baixa — aumentar preço ou reduzir escopo"
"Projeto grande — considerar dividir em fases"
13. Sugestão de preço
Baseado no tipo:
Pequeno → R\$5k – R\$20k
Médio → R\$20k – R\$80k
Grande → R\$80k – R\$250k+
Enterprise → R\$250k+
🔁 SISTEMA DINÂMICO
Permitir:
adicionar/remover módulos
editar horas por módulo
salvar templates de projeto
reutilizar estruturas
🎨 INTERFACE
estilo dashboard SaaS
inputs editáveis
breakdown completo:
dev
gestão
infra
risco
impostos
lucro
🎯 OBJETIVO FINAL
A ferramenta deve transformar a forma como software houses precificam, ajudando a:
parar de cobrar barato
evitar prejuízo oculto
justificar preços altos
profissionalizar a operação

Perfeito! Aqui está o prompt de engenharia completo e otimizado para o Claude, adaptado para software house:

***

# 🧠 PROMPT DE ENGENHARIA — CALCULADORA ESTRATÉGICA PARA SOFTWARE HOUSE

## CONTEXTO E PAPEL

Você é um arquiteto de software sênior fullstack com especialização em:

- Sistemas SaaS B2B de nível profissional
- Engenharia de precificação para empresas de tecnologia
- Aplicações React/TypeScript modernas com arquitetura escalável
- Modelagem financeira para software houses e consultorias de TI

**Sua missão:** Construir uma aplicação web completa, funcional e autossuficiente — uma **Calculadora Estratégica de Precificação para Software Houses**. O sistema deve funcionar como uma ferramenta de decisão estratégica de negócio, não apenas uma calculadora de horas.

***

## 🎯 OBJETIVO DO SISTEMA

Criar uma aplicação que permita ao usuário:

- Precificar projetos de desenvolvimento sob medida com margem saudável (50%–70%)
- Cobrir todos os custos reais: dev, gestão, infra, risco e impostos
- Compor projetos com módulos dinâmicos (autenticação, dashboard, pagamentos, etc.)
- Calcular impacto de integrações externas automaticamente
- Receber alertas e insights automáticos baseados nos dados inseridos
- Salvar e reutilizar templates de projeto
- Justificar preços com breakdown profissional e visual

***

## ⚙️ STACK TECNOLÓGICA OBRIGATÓRIA

```
Frontend:    React 18 + TypeScript (strict mode)
Estilo:      TailwindCSS + shadcn/ui
Estado:      Zustand (gerenciamento global)
Formulários: React Hook Form + Zod (validação de schema)
Persistência: localStorage com estrutura JSON preparada para migração
Build:       Vite
```

> **Regra absoluta:** Zero dependências de APIs externas. Toda lógica roda localmente no browser.

***

## 🗂️ ARQUITETURA E ESTRUTURA DE PASTAS

```
src/
├── components/
│   ├── calculator/
│   │   ├── DevInputsForm.tsx          # Horas back, front, QA + valor/hora
│   │   ├── ManagementForm.tsx         # % gestão + configurações
│   │   ├── InfraForm.tsx              # Cloud, APIs, ferramentas
│   │   ├── RiskFinancialForm.tsx      # % risco, imposto, margem desejada
│   │   ├── IntegrationsInput.tsx      # Número de integrações + horas auto
│   │   ├── ComplexitySelector.tsx     # Seletor de complexidade técnica
│   │   ├── PricingBreakdown.tsx       # Breakdown visual completo
│   │   ├── InsightsPanel.tsx          # Alertas e recomendações
│   │   └── MarginGauge.tsx            # Visualizador de margem (arco colorido)
│   ├── modules/
│   │   ├── ModuleCard.tsx             # Card individual de módulo
│   │   ├── ModuleForm.tsx             # Formulário criar/editar módulo
│   │   └── ModuleList.tsx             # Lista de módulos com totais
│   ├── templates/
│   │   ├── TemplateCard.tsx           # Card de template salvo
│   │   └── TemplateSaveModal.tsx      # Modal salvar/carregar template
│   └── ui/                            # Componentes base (shadcn/ui)
│
├── store/
│   ├── calculatorStore.ts             # Estado global da calculadora
│   ├── moduleStore.ts                 # CRUD de módulos + persistência
│   └── templateStore.ts              # Templates salvos
│
├── lib/
│   ├── pricing.ts                     # Toda lógica de cálculo (pura, testável)
│   ├── validators.ts                  # Schemas Zod para todos os inputs
│   ├── insights.ts                    # Motor de insights e alertas
│   └── storage.ts                     # Abstração do localStorage
│
├── types/
│   └── index.ts                       # Interfaces e tipos TypeScript
│
├── data/
│   └── defaultModules.ts              # Módulos pré-cadastrados
│
└── App.tsx                            # Layout principal (dashboard)
```


***

## 📐 MODELAGEM DE TIPOS (TypeScript)

```typescript
// types/index.ts

type Complexity = 'low' | 'medium' | 'high';
type ModuleType = 'core' | 'extra';
type ProjectSize = 'small' | 'medium' | 'large' | 'enterprise';

interface DevConfig {
  backendHours: number;
  frontendHours: number;
  qaHours: number;
  hourlyRate: number;
  complexity: Complexity;          // multiplicador técnico geral
}

interface ManagementConfig {
  managementRate: number;          // ex: 0.15 a 0.25
}

interface InfraConfig {
  cloudCost: number;
  apisCost: number;
  toolsCost: number;
}

interface RiskFinancialConfig {
  riskRate: number;                // ex: 0.20 a 0.40
  taxRate: number;                 // ex: 0.10
  desiredMargin: number;           // ex: 0.50 a 0.70
}

interface IntegrationConfig {
  count: number;                   // número de integrações externas
  hoursPerIntegration: number;     // padrão: 10h (editável: 5–15h)
}

interface ProjectModule {
  id: string;
  name: string;
  description: string;
  estimatedHours: number;
  complexity: Complexity;
  type: ModuleType;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
}

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  devConfig: DevConfig;
  managementConfig: ManagementConfig;
  infraConfig: InfraConfig;
  riskFinancialConfig: RiskFinancialConfig;
  integrationConfig: IntegrationConfig;
  modules: ProjectModule[];
  createdAt: string;
}

interface ModuleCostItem {
  moduleId: string;
  moduleName: string;
  moduleType: ModuleType;
  hours: number;
  complexityMultiplier: number;
  cost: number;
}

interface PricingResult {
  // Horas
  devHours: number;                // back + front + QA
  integrationHours: number;        // integrações automáticas
  moduleHours: number;             // soma dos módulos ativos
  totalHours: number;

  // Custos detalhados
  devCost: number;                 // horas * valor_hora * complexidade
  managementCost: number;
  infraCost: number;
  subtotal: number;
  taxValue: number;
  riskValue: number;
  modulesCostBreakdown: ModuleCostItem[];
  totalModulesCost: number;

  // Final
  totalCost: number;
  finalPrice: number;
  estimatedProfit: number;
  realMargin: number;

  // Classificação
  projectSize: ProjectSize;
}

interface Insight {
  type: 'critical' | 'warning' | 'success' | 'opportunity';
  message: string;
  action?: string;
}
```


***

## 🧮 LÓGICA DE PRECIFICAÇÃO COMPLETA

```typescript
// lib/pricing.ts

const COMPLEXITY_MULTIPLIER: Record<Complexity, number> = {
  low: 1.0,
  medium: 1.2,
  high: 1.5,
};

function calcPricing(
  dev: DevConfig,
  management: ManagementConfig,
  infra: InfraConfig,
  riskFinancial: RiskFinancialConfig,
  integrations: IntegrationConfig,
  activeModules: ProjectModule[]
): PricingResult {

  // 1. Horas totais de dev
  const devHours = dev.backendHours + dev.frontendHours + dev.qaHours;

  // 2. Horas de integrações (automáticas)
  const integrationHours = integrations.count * integrations.hoursPerIntegration;

  // 3. Horas dos módulos ativos
  const moduleHours = activeModules.reduce((s, m) => s + m.estimatedHours, 0);

  // 4. Total de horas
  const totalHours = devHours + integrationHours + moduleHours;

  // 5. Custo de desenvolvimento (com complexidade técnica)
  const complexityMult = COMPLEXITY_MULTIPLIER[dev.complexity];
  const devCost = (devHours + integrationHours) * dev.hourlyRate * complexityMult;

  // 6. Custo dos módulos (cada um com sua própria complexidade)
  const modulesCostBreakdown: ModuleCostItem[] = activeModules.map(m => {
    const mult = COMPLEXITY_MULTIPLIER[m.complexity];
    const cost = m.estimatedHours * dev.hourlyRate * mult;
    return {
      moduleId: m.id,
      moduleName: m.name,
      moduleType: m.type,
      hours: m.estimatedHours,
      complexityMultiplier: mult,
      cost,
    };
  });
  const totalModulesCost = modulesCostBreakdown.reduce((s, m) => s + m.cost, 0);

  // 7. Custo de gestão (sobre dev + módulos)
  const managementCost = (devCost + totalModulesCost) * management.managementRate;

  // 8. Infraestrutura
  const infraCost = infra.cloudCost + infra.apisCost + infra.toolsCost;

  // 9. Subtotal
  const subtotal = devCost + totalModulesCost + managementCost + infraCost;

  // 10. Impostos e risco
  const taxValue = subtotal * riskFinancial.taxRate;
  const riskValue = subtotal * riskFinancial.riskRate;

  // 11. Custo total
  const totalCost = subtotal + taxValue + riskValue;

  // 12. Preço final com margem (proteção contra divisão inválida)
  const margin = Math.min(Math.max(riskFinancial.desiredMargin, 0.01), 0.99);
  const finalPrice = totalCost / (1 - margin);
  const estimatedProfit = finalPrice - totalCost;
  const realMargin = estimatedProfit / finalPrice;

  // 13. Classificação do projeto por horas totais
  const projectSize: ProjectSize =
    totalHours <= 40 ? 'small' :
    totalHours <= 120 ? 'medium' :
    totalHours <= 300 ? 'large' : 'enterprise';

  return {
    devHours, integrationHours, moduleHours, totalHours,
    devCost, managementCost, infraCost, subtotal,
    taxValue, riskValue,
    modulesCostBreakdown, totalModulesCost,
    totalCost, finalPrice, estimatedProfit, realMargin,
    projectSize,
  };
}
```


***

## 🧠 MOTOR DE INSIGHTS

```typescript
// lib/insights.ts

function generateInsights(
  result: PricingResult,
  dev: DevConfig,
  management: ManagementConfig,
  risk: RiskFinancialConfig,
  integrations: IntegrationConfig
): Insight[] {
  const insights: Insight[] = [];

  // Margem
  if (result.realMargin < 0.5)
    insights.push({ type: 'critical',
      message: '🚨 Margem abaixo de 50% — prejuízo oculto detectado.',
      action: 'Aumente o valor/hora ou reduza escopo do projeto.' });

  else if (result.realMargin >= 0.5 && result.realMargin <= 0.7)
    insights.push({ type: 'success',
      message: '✅ Margem saudável — precificação equilibrada e sustentável.' });

  else if (result.realMargin > 0.7)
    insights.push({ type: 'warning',
      message: '⚠️ Margem acima de 70% — verifique competitividade.',
      action: 'Considere adicionar mais valor entregue ao cliente.' });

  // Risco subestimado
  if (risk.riskRate < 0.20)
    insights.push({ type: 'warning',
      message: '⚠️ Risco abaixo de 20% — provavelmente subestimado.',
      action: 'Projetos de software raramente têm risco abaixo de 20%.' });

  // Gestão subestimada
  if (management.managementRate < 0.15)
    insights.push({ type: 'warning',
      message: '⚠️ Gestão abaixo de 15% — custo operacional subprecificado.',
      action: 'Inclua reuniões, retrabalho e alinhamentos no cálculo.' });

  // Muitas integrações
  if (integrations.count >= 3)
    insights.push({ type: 'warning',
      message: `🔌 ${integrations.count} integrações detectadas — revisar escopo obrigatório.`,
      action: 'Cada integração externa pode triplicar o tempo estimado.' });

  // Projeto grande
  if (result.projectSize === 'large' || result.projectSize === 'enterprise')
    insights.push({ type: 'opportunity',
      message: '📦 Projeto grande — considere dividir em fases com entregas parciais.',
      action: 'Fases reduzem risco de inadimplência e facilitam aprovação do cliente.' });

  // Faixa de preço ideal
  const ranges: Record<ProjectSize, [number, number, string]> = {
    small:      [5000,   20000,  'Pequeno'],
    medium:     [20000,  80000,  'Médio'],
    large:      [80000,  250000, 'Grande'],
    enterprise: [250000, Infinity, 'Enterprise'],
  };
  const [min, max, label] = ranges[result.projectSize];
  if (result.finalPrice < min)
    insights.push({ type: 'critical',
      message: `💸 Preço abaixo da faixa de mercado para projeto ${label} (R$${min.toLocaleString('pt-BR')}+).`,
      action: 'Reavalie o valor/hora ou o escopo negociado.' });

  // Alto risco técnico
  if (dev.complexity === 'high')
    insights.push({ type: 'opportunity',
      message: '🔥 Alta complexidade técnica — argumento forte para preço premium.',
      action: 'Documente a complexidade na proposta para justificar o valor.' });

  return insights;
}
```


***

## 📦 MÓDULOS PRÉ-CADASTRADOS (DEFAULT)

```typescript
// data/defaultModules.ts

export const DEFAULT_MODULES: ProjectModule[] = [
  {
    id: 'auth',
    name: 'Autenticação',
    description: 'Login, registro, recuperação de senha, OAuth (Google/GitHub)',
    estimatedHours: 16,
    complexity: 'medium',
    type: 'core',
    isActive: false, isDefault: true, createdAt: new Date().toISOString()
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Painel principal com gráficos, KPIs e widgets configuráveis',
    estimatedHours: 24,
    complexity: 'medium',
    type: 'core',
    isActive: false, isDefault: true, createdAt: new Date().toISOString()
  },
  {
    id: 'payments',
    name: 'Pagamentos',
    description: 'Integração Stripe/PagSeguro, assinaturas, webhooks',
    estimatedHours: 32,
    complexity: 'high',
    type: 'extra',
    isActive: false, isDefault: true, createdAt: new Date().toISOString()
  },
  {
    id: 'api-integration',
    name: 'Integração API Externa',
    description: 'Consumo e sincronização com APIs de terceiros (REST/GraphQL)',
    estimatedHours: 20,
    complexity: 'high',
    type: 'extra',
    isActive: false, isDefault: true, createdAt: new Date().toISOString()
  },
  {
    id: 'admin-panel',
    name: 'Painel Administrativo',
    description: 'CRUD completo, gestão de usuários, permissões e relatórios',
    estimatedHours: 40,
    complexity: 'medium',
    type: 'core',
    isActive: false, isDefault: true, createdAt: new Date().toISOString()
  },
  {
    id: 'notifications',
    name: 'Notificações',
    description: 'Push notifications, e-mail transacional, in-app alerts',
    estimatedHours: 12,
    complexity: 'medium',
    type: 'extra',
    isActive: false, isDefault: true, createdAt: new Date().toISOString()
  },
  {
    id: 'file-upload',
    name: 'Upload de Arquivos',
    description: 'Upload para S3/Cloudflare R2, preview, validação e compressão',
    estimatedHours: 10,
    complexity: 'medium',
    type: 'extra',
    isActive: false, isDefault: true, createdAt: new Date().toISOString()
  },
  {
    id: 'reports',
    name: 'Relatórios e Exportação',
    description: 'Geração de PDF/Excel, filtros avançados e agendamento',
    estimatedHours: 20,
    complexity: 'high',
    type: 'extra',
    isActive: false, isDefault: true, createdAt: new Date().toISOString()
  },
  {
    id: 'multi-tenant',
    name: 'Multi-tenancy',
    description: 'Isolamento de dados por organização, subdomínios, white-label',
    estimatedHours: 40,
    complexity: 'high',
    type: 'core',
    isActive: false, isDefault: true, createdAt: new Date().toISOString()
  },
];
```


***

## 🎨 INTERFACE — LAYOUT DO DASHBOARD

Layout em **abas + painel lateral fixo**, dark mode padrão:

```
┌──────────────────────────────────────────────────────────────────┐
│  🏗️ SOFTWARE HOUSE PRICING          [Salvar Template] [Resetar]  │
├──────────────────────────────────────────────────────────────────┤
│  [Desenvolvimento] [Gestão & Infra] [Risco & Financeiro]         │
│  [Módulos] [Integrações] [Templates]                             │
├─────────────────────────────┬────────────────────────────────────┤
│  ABA ATIVA (inputs)         │  PAINEL DIREITO (fixo, live)       │
│                             │                                     │
│  Ex: Aba Desenvolvimento    │  ⏱️ Horas Totais: 184h             │
│  - Backend: [___] h         │  📦 Classificação: Projeto Médio   │
│  - Frontend: [___] h        │                                     │
│  - QA: [___] h              │  💰 Breakdown de Custos            │
│  - Valor/hora: R$[___]      │  ├─ Dev:        R$ XX.XXX          │
│  - Complexidade: [●●○]      │  ├─ Gestão:     R$ X.XXX           │
│                             │  ├─ Infra:      R$ X.XXX           │
│  Ex: Aba Módulos            │  ├─ Impostos:   R$ X.XXX           │
│  - Lista com checkbox       │  └─ Risco:      R$ X.XXX           │
│  - Badge core/extra         │                                     │
│  - Badge complexidade       │  📊 Total Custo:  R$ XX.XXX        │
│  - Editar horas inline      │  🏷️ Preço Final:  R$ XX.XXX        │
│  - [+ Criar Módulo]         │  💚 Lucro:        R$ XX.XXX        │
│                             │  📈 Margem Real:  [GAUGE 63%]      │
│  Ex: Aba Templates          │                                     │
│  - Cards de templates       │  🧠 Insights (3)                   │
│  - [Carregar] [Deletar]     │  [card crítico] [card warning]     │
│  - [Salvar atual]           │  [card oportunidade]               │
└─────────────────────────────┴────────────────────────────────────┘
```


### Regras de UX Obrigatórias

- Todos os cálculos atualizam em **tempo real** (sem botão "calcular")
- **Gauge visual** de margem: vermelho (<50%) → amarelo (50–60%) → verde (60–70%) → azul (>70%)
- Módulos com **badge colorido** de tipo (core = azul, extra = roxo) e complexidade
- Integrações: slider para ajustar **horas por integração** (5h a 15h, padrão 10h)
- Templates: salvar configuração completa com nome e descrição
- Botão **"Gerar Proposta"** — cria texto formatado copiável com breakdown completo
- Inputs com **validação inline** e mensagens de erro claras
- Breakdown expandível por categoria (accordion)

***

## 🔒 REGRAS DE VALIDAÇÃO (Zod)

```typescript
// lib/validators.ts

const devSchema = z.object({
  backendHours:  z.number().min(0).max(5000),
  frontendHours: z.number().min(0).max(5000),
  qaHours:       z.number().min(0).max(5000),
  hourlyRate:    z.number().min(10).max(5000),
  complexity:    z.enum(['low', 'medium', 'high']),
}).refine(d => d.backendHours + d.frontendHours + d.qaHours > 0, {
  message: 'Informe ao menos horas em uma área de desenvolvimento.',
});

const managementSchema = z.object({
  managementRate: z.number().min(0.05).max(0.50),
});

const infraSchema = z.object({
  cloudCost: z.number().min(0),
  apisCost:  z.number().min(0),
  toolsCost: z.number().min(0),
});

const riskFinancialSchema = z.object({
  riskRate:      z.number().min(0.05).max(0.60),
  taxRate:       z.number().min(0).max(0.50),
  desiredMargin: z.number().min(0.10).max(0.90),
});

const moduleSchema = z.object({
  name:           z.string().min(3).max(60),
  estimatedHours: z.number().min(1).max(2000),
  complexity:     z.enum(['low', 'medium', 'high']),
  type:           z.enum(['core', 'extra']),
});
```


***

## 📤 FORMATO DE ENTREGA ESPERADO DO CLAUDE

Ao receber este prompt, o Claude deve entregar:

1. **Todos os arquivos do projeto** organizados pela estrutura de pastas acima
2. Cada arquivo **completo**, sem omissões ou `// ... resto do código`
3. Componentes React funcionais com TypeScript strict
4. Zustand stores com persistência em localStorage
5. Lógica de pricing 100% em **funções puras** em `lib/pricing.ts`
6. Motor de insights em `lib/insights.ts` com todas as regras implementadas
7. Sistema de templates funcional (salvar/carregar/deletar)
8. Função `gerarProposta()` que retorna texto formatado copiável
9. README com instruções de instalação (`npm install && npm run dev`)
10. Aplicação pronta para rodar com `vite` sem configurações adicionais

> **Instrução final ao Claude:** Entregue o código completo e funcional, arquivo por arquivo. Não resuma, não omita nenhum arquivo. A aplicação deve calcular corretamente, persistir dados no localStorage e exibir insights em tempo real. Priorize lógica correta antes de estética.

***

Esse prompt está pronto para o Claude. Ele segue a mesma estrutura do anterior (marketing), mas com a lógica específica de software house: separação entre horas de back/front/QA, gestão como percentual sobre dev, multiplicador de complexidade técnica global, sistema de integrações com horas automáticas e módulos com tipo **core vs extra**. O sistema de templates é o diferencial principal — permite que a software house salve estruturas de projetos recorrentes e reutilize com agilidade.

