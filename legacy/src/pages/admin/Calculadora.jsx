import { useState, useMemo, useEffect } from 'react'

// ── Constantes ──
const COMPLEXITY_MULT = { low: 1.0, medium: 1.2, high: 1.5 }
const COMPLEXITY_LABEL = { low: 'Baixa', medium: 'Média', high: 'Alta' }
const SIZE_LABEL = { small: 'Pequeno', medium: 'Médio', large: 'Grande', enterprise: 'Enterprise' }
const SIZE_RANGE = {
  small: [5000, 20000],
  medium: [20000, 80000],
  large: [80000, 250000],
  enterprise: [250000, Infinity],
}
const TYPE_LABEL = { core: 'Core', extra: 'Extra' }

const DEFAULT_MODULES = [
  { id: 'auth', name: 'Autenticação', description: 'Login, registro, recuperação de senha, OAuth', estimatedHours: 16, complexity: 'medium', type: 'core', isActive: false },
  { id: 'dashboard', name: 'Dashboard', description: 'Painel com gráficos, KPIs e widgets', estimatedHours: 24, complexity: 'medium', type: 'core', isActive: false },
  { id: 'payments', name: 'Pagamentos', description: 'Stripe/PagSeguro, assinaturas, webhooks', estimatedHours: 32, complexity: 'high', type: 'extra', isActive: false },
  { id: 'api-integration', name: 'Integração API Externa', description: 'Consumo e sincronização REST/GraphQL', estimatedHours: 20, complexity: 'high', type: 'extra', isActive: false },
  { id: 'admin-panel', name: 'Painel Administrativo', description: 'CRUD, gestão de usuários, permissões', estimatedHours: 40, complexity: 'medium', type: 'core', isActive: false },
  { id: 'notifications', name: 'Notificações', description: 'Push, e-mail transacional, in-app alerts', estimatedHours: 12, complexity: 'medium', type: 'extra', isActive: false },
  { id: 'file-upload', name: 'Upload de Arquivos', description: 'Upload S3/R2, preview, validação', estimatedHours: 10, complexity: 'medium', type: 'extra', isActive: false },
  { id: 'reports', name: 'Relatórios e Exportação', description: 'PDF/Excel, filtros, agendamento', estimatedHours: 20, complexity: 'high', type: 'extra', isActive: false },
  { id: 'multi-tenant', name: 'Multi-tenancy', description: 'Isolamento por organização, white-label', estimatedHours: 40, complexity: 'high', type: 'core', isActive: false },
]

const STORAGE_KEY = 'spxia_calc_templates'

function loadTemplates() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveTemplates(t) { localStorage.setItem(STORAGE_KEY, JSON.stringify(t)) }

// ── Cálculo de precificação ──
function calcPricing(dev, management, infra, risk, integrations, modules) {
  const devHours = dev.backendHours + dev.frontendHours + dev.qaHours
  const integrationHours = integrations.count * integrations.hoursPerIntegration
  const activeModules = modules.filter(m => m.isActive)
  const moduleHours = activeModules.reduce((s, m) => s + m.estimatedHours, 0)
  const totalHours = devHours + integrationHours + moduleHours

  const cMult = COMPLEXITY_MULT[dev.complexity]
  const devCost = (devHours + integrationHours) * dev.hourlyRate * cMult

  const modulesCost = activeModules.map(m => {
    const mult = COMPLEXITY_MULT[m.complexity]
    return { id: m.id, name: m.name, type: m.type, hours: m.estimatedHours, mult, cost: m.estimatedHours * dev.hourlyRate * mult }
  })
  const totalModulesCost = modulesCost.reduce((s, m) => s + m.cost, 0)

  const managementCost = (devCost + totalModulesCost) * management.rate
  const infraCost = infra.cloud + infra.apis + infra.tools
  const subtotal = devCost + totalModulesCost + managementCost + infraCost
  const taxValue = subtotal * risk.taxRate
  const riskValue = subtotal * risk.riskRate
  const totalCost = subtotal + taxValue + riskValue

  const margin = Math.min(Math.max(risk.desiredMargin, 0.01), 0.99)
  const finalPrice = totalCost / (1 - margin)
  const profit = finalPrice - totalCost
  const realMargin = finalPrice > 0 ? profit / finalPrice : 0

  const projectSize = totalHours <= 40 ? 'small' : totalHours <= 120 ? 'medium' : totalHours <= 300 ? 'large' : 'enterprise'

  return { devHours, integrationHours, moduleHours, totalHours, devCost, totalModulesCost, modulesCost, managementCost, infraCost, subtotal, taxValue, riskValue, totalCost, finalPrice, profit, realMargin, projectSize }
}

// ── Insights ──
function generateInsights(r, dev, mgmt, risk, integrations) {
  const ins = []
  if (r.realMargin < 0.5) ins.push({ type: 'critical', msg: 'Margem abaixo de 50% — prejuízo oculto.', action: 'Aumente valor/hora ou reduza escopo.' })
  else if (r.realMargin <= 0.7) ins.push({ type: 'success', msg: 'Margem saudável — precificação equilibrada.' })
  else ins.push({ type: 'warning', msg: 'Margem acima de 70% — verifique competitividade.', action: 'Considere adicionar mais valor ao cliente.' })

  if (risk.riskRate < 0.20) ins.push({ type: 'warning', msg: 'Risco abaixo de 20% — provavelmente subestimado.', action: 'Projetos raramente têm risco abaixo de 20%.' })
  if (mgmt.rate < 0.15) ins.push({ type: 'warning', msg: 'Gestão abaixo de 15% — subprecificado.', action: 'Inclua reuniões, retrabalho e alinhamentos.' })
  if (integrations.count >= 3) ins.push({ type: 'warning', msg: `${integrations.count} integrações — revisar escopo.`, action: 'Cada integração pode triplicar o tempo.' })
  if (r.projectSize === 'large' || r.projectSize === 'enterprise') ins.push({ type: 'opportunity', msg: 'Projeto grande — dividir em fases.', action: 'Fases reduzem risco e facilitam aprovação.' })

  const [min] = SIZE_RANGE[r.projectSize]
  if (r.finalPrice < min) ins.push({ type: 'critical', msg: `Preço abaixo da faixa para ${SIZE_LABEL[r.projectSize]} (R$${min.toLocaleString('pt-BR')}+).`, action: 'Reavalie valor/hora ou escopo.' })
  if (dev.complexity === 'high') ins.push({ type: 'opportunity', msg: 'Alta complexidade — argumento para preço premium.', action: 'Documente na proposta para justificar.' })

  return ins
}

function fmt(v) { return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function pct(v) { return (v * 100).toFixed(1) + '%' }

// ── Componente principal ──
export default function Calculadora() {
  const [tab, setTab] = useState('dev')

  // Dev
  const [backendHours, setBackendHours] = useState(40)
  const [frontendHours, setFrontendHours] = useState(40)
  const [qaHours, setQaHours] = useState(10)
  const [hourlyRate, setHourlyRate] = useState(150)
  const [complexity, setComplexity] = useState('medium')

  // Gestão
  const [mgmtRate, setMgmtRate] = useState(0.20)

  // Infra
  const [cloud, setCloud] = useState(0)
  const [apis, setApis] = useState(0)
  const [tools, setTools] = useState(0)

  // Risco / Financeiro
  const [riskRate, setRiskRate] = useState(0.25)
  const [taxRate, setTaxRate] = useState(0.10)
  const [desiredMargin, setDesiredMargin] = useState(0.60)

  // Integrações
  const [intCount, setIntCount] = useState(0)
  const [intHours, setIntHours] = useState(10)

  // Módulos
  const [modules, setModules] = useState(DEFAULT_MODULES)
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [newMod, setNewMod] = useState({ name: '', estimatedHours: 10, complexity: 'medium', type: 'extra' })

  // Proposta
  const [clientName, setClientName] = useState('')
  const [projectName, setProjectName] = useState('')
  const [projectDesc, setProjectDesc] = useState('')
  const [deadline, setDeadline] = useState(21)

  // Templates
  const [templates, setTemplates] = useState(loadTemplates)
  const [tplName, setTplName] = useState('')

  useEffect(() => { saveTemplates(templates) }, [templates])

  function toggleModule(id) {
    setModules(modules.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m))
  }

  function updateModuleHours(id, hours) {
    setModules(modules.map(m => m.id === id ? { ...m, estimatedHours: Math.max(1, hours) } : m))
  }

  function addModule() {
    if (!newMod.name.trim()) return
    setModules([...modules, { ...newMod, id: 'custom-' + Date.now(), isActive: true }])
    setNewMod({ name: '', estimatedHours: 10, complexity: 'medium', type: 'extra' })
    setShowModuleForm(false)
  }

  function removeModule(id) {
    setModules(modules.filter(m => m.id !== id))
  }

  // Montar configs
  const dev = { backendHours, frontendHours, qaHours, hourlyRate, complexity }
  const mgmt = { rate: mgmtRate }
  const infra = { cloud, apis, tools }
  const risk = { riskRate, taxRate, desiredMargin }
  const integrations = { count: intCount, hoursPerIntegration: intHours }

  const result = useMemo(() => calcPricing(dev, mgmt, infra, risk, integrations, modules), [backendHours, frontendHours, qaHours, hourlyRate, complexity, mgmtRate, cloud, apis, tools, riskRate, taxRate, desiredMargin, intCount, intHours, modules])
  const insights = useMemo(() => generateInsights(result, dev, mgmt, risk, integrations), [result])

  // Templates
  function saveTemplate() {
    if (!tplName.trim()) return
    const tpl = { id: Date.now(), name: tplName, dev, mgmt, infra, risk, integrations, modules, createdAt: new Date().toISOString() }
    setTemplates([tpl, ...templates])
    setTplName('')
  }

  function loadTemplate(tpl) {
    setBackendHours(tpl.dev.backendHours); setFrontendHours(tpl.dev.frontendHours); setQaHours(tpl.dev.qaHours)
    setHourlyRate(tpl.dev.hourlyRate); setComplexity(tpl.dev.complexity)
    setMgmtRate(tpl.mgmt.rate)
    setCloud(tpl.infra.cloud); setApis(tpl.infra.apis); setTools(tpl.infra.tools)
    setRiskRate(tpl.risk.riskRate); setTaxRate(tpl.risk.taxRate); setDesiredMargin(tpl.risk.desiredMargin)
    setIntCount(tpl.integrations.count); setIntHours(tpl.integrations.hoursPerIntegration)
    setModules(tpl.modules)
    setTab('dev')
  }

  function deleteTemplate(id) { setTemplates(templates.filter(t => t.id !== id)) }

  function copyProposal() {
    const activeModules = modules.filter(m => m.isActive)
    let text = `PROPOSTA DE PROJETO — ${SIZE_LABEL[result.projectSize].toUpperCase()}\n`
    text += `${'='.repeat(50)}\n\n`
    text += `Horas totais: ${result.totalHours}h\n`
    text += `  - Desenvolvimento: ${result.devHours}h\n`
    text += `  - Integrações: ${result.integrationHours}h\n`
    text += `  - Módulos: ${result.moduleHours}h\n`
    text += `Complexidade técnica: ${COMPLEXITY_LABEL[complexity]}\n\n`
    text += `BREAKDOWN DE CUSTOS\n${'-'.repeat(30)}\n`
    text += `Desenvolvimento:  ${fmt(result.devCost)}\n`
    if (activeModules.length) {
      text += `Módulos:          ${fmt(result.totalModulesCost)}\n`
      result.modulesCost.forEach(m => { text += `  └ ${m.name}: ${m.hours}h × ${fmt(dev.hourlyRate)} × ${m.mult} = ${fmt(m.cost)}\n` })
    }
    text += `Gestão (${pct(mgmtRate)}):    ${fmt(result.managementCost)}\n`
    text += `Infraestrutura:   ${fmt(result.infraCost)}\n`
    text += `Impostos (${pct(taxRate)}):   ${fmt(result.taxValue)}\n`
    text += `Risco (${pct(riskRate)}):     ${fmt(result.riskValue)}\n\n`
    text += `CUSTO TOTAL:      ${fmt(result.totalCost)}\n`
    text += `PREÇO FINAL:      ${fmt(result.finalPrice)}\n`
    text += `LUCRO ESTIMADO:   ${fmt(result.profit)}\n`
    text += `MARGEM REAL:      ${pct(result.realMargin)}\n`
    navigator.clipboard.writeText(text)
  }

  function exportPDF() {
    const activeModules = modules.filter(m => m.isActive)
    const today = new Date()
    const dateStr = today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
    const code = `PC-${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}-${String(Math.floor(Math.random()*999)+1).padStart(3,'0')}`
    const client = clientName || 'Cliente'
    const project = projectName || 'Projeto de Software'
    const desc = projectDesc || `Desenvolvimento de ${project.toLowerCase()} sob medida com ${result.totalHours} horas de desenvolvimento.`

    const LOGO = `<svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="28" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="28" fill="#FEFEFE">SPX</text><text x="62" y="28" font-family="Arial,sans-serif" font-weight="700" font-size="28" fill="#ED3237">(IA)</text></svg>`
    const LOGO_SM = `<svg width="80" height="28" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="28" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="28" fill="#FEFEFE">SPX</text><text x="62" y="28" font-family="Arial,sans-serif" font-weight="700" font-size="28" fill="#ED3237">(IA)</text></svg>`
    const LOGO_XS = `<svg width="60" height="20" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="28" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="28" fill="#FEFEFE">SPX</text><text x="62" y="28" font-family="Arial,sans-serif" font-weight="700" font-size="28" fill="#ED3237">(IA)</text></svg>`

    // Gerar linhas da tabela de módulos ativos
    const moduleRows = activeModules.map((m, i) => {
      const bg = i % 2 === 0 ? 'background:#2D2D2D;' : ''
      return `<div style="display:flex;padding:9px 18px;${bg}">
        <div style="flex:2;font-size:10px;font-weight:700;color:#ED3237;">${m.name}</div>
        <div style="flex:1;font-size:10px;color:#FEFEFE;text-align:center;">${m.estimatedHours}h</div>
        <div style="flex:1;font-size:10px;color:#888888;text-align:center;">${COMPLEXITY_LABEL[m.complexity]}</div>
        <div style="flex:1;font-size:10px;color:#FEFEFE;text-align:right;">${fmt(m.estimatedHours * hourlyRate * COMPLEXITY_MULT[m.complexity])}</div>
      </div>`
    }).join('')

    // Breakdown rows para a tabela de custos
    const breakdownRows = [
      { name: 'Desenvolvimento', desc: `${result.devHours}h + ${result.integrationHours}h integrações × ${fmt(hourlyRate)}/h × ${COMPLEXITY_MULT[complexity]}`, value: result.devCost },
      ...(result.totalModulesCost > 0 ? [{ name: 'Módulos', desc: `${activeModules.length} módulo(s) ativo(s)`, value: result.totalModulesCost }] : []),
      { name: `Gestão (${pct(mgmtRate)})`, desc: 'Reuniões, alinhamentos, retrabalho', value: result.managementCost },
      { name: 'Infraestrutura', desc: 'Cloud, APIs e ferramentas', value: result.infraCost },
      { name: `Impostos (${pct(taxRate)})`, desc: 'Tributação sobre subtotal', value: result.taxValue },
      { name: `Risco (${pct(riskRate)})`, desc: 'Buffer para imprevistos', value: result.riskValue },
    ]

    const breakdownHTML = breakdownRows.map((r, i) => {
      const bg = i % 2 === 0 ? 'background:#2D2D2D;' : ''
      return `<div style="display:flex;padding:9px 18px;${bg}">
        <div style="flex:2;font-size:10px;font-weight:700;color:#ED3237;">${r.name}</div>
        <div style="flex:3;font-size:10px;color:#888888;">${r.desc}</div>
        <div style="flex:1;font-size:10px;color:#FEFEFE;text-align:right;font-weight:600;">${fmt(r.value)}</div>
      </div>`
    }).join('')

    // Gerar deliverables dos módulos ativos
    const deliverableItems = activeModules.map((m, i) => {
      const isRed = i % 2 === 0
      const borderColor = isRed ? '#ED3237' : '#FEFEFE'
      const borderOpacity = isRed ? '' : 'opacity:0.3;'
      const bgCard = isRed ? 'background:#2D2D2D;' : ''
      const iconBg = isRed ? '#1A1A1A' : '#2D2D2D'
      const strokeColor = isRed ? '#ED3237' : '#FEFEFE'
      return `<div style="display:flex;align-items:stretch;border-radius:6px;overflow:hidden;border:1px solid #3D3D3D;">
        <div style="width:4px;background:${borderColor};flex-shrink:0;${borderOpacity}"></div>
        <div style="flex:1;padding:10px 14px;${bgCard}display:flex;gap:10px;align-items:flex-start;">
          <div style="width:22px;height:22px;background:${iconBg};border-radius:5px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </div>
          <div>
            <div style="font-size:10px;font-weight:700;color:#FEFEFE;margin-bottom:1px;">${m.name}</div>
            <div style="font-size:9px;color:#888888;line-height:1.5;">${m.description || `${m.estimatedHours}h · Complexidade ${COMPLEXITY_LABEL[m.complexity]}`}</div>
          </div>
        </div>
      </div>`
    }).join('')

    const totalPages = activeModules.length > 0 ? 3 : 2

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Proposta - ${client}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Outfit', 'Inter', Arial, sans-serif; color: #FEFEFE; font-size: 11px; line-height: 1.6; }
  .page { width: 210mm; height: 297mm; position: relative; overflow: hidden; page-break-after: always; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  .page:last-child { page-break-after: auto; }
  h1, h2 { font-family: 'DM Serif Display', Georgia, serif; }
  em, .red { color: #ED3237; }
  .header { background:#111111;padding:22px 56px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #2D2D2D; }
  .footer { position:absolute;bottom:0;left:0;right:0;padding:14px 56px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #2D2D2D; }
  .footer span { font-size:8px;color:#888888;letter-spacing:2px;text-transform:uppercase; }
  .section-num { width:36px;height:36px;background:#2D2D2D;border-left:3px solid #ED3237;border-radius:0 8px 8px 0;display:flex;align-items:center;justify-content:center; }
  .section-num span { font-size:13px;font-weight:800;color:#FEFEFE;font-family:Inter; }
</style>
</head>
<body>

<!-- ===== PAGE 1 - CAPA ===== -->
<div class="page" style="background:#1A1A1A;">
  <div style="position:absolute;top:0;left:0;width:100%;height:4px;background:#ED3237;"></div>
  <div style="position:absolute;top:-120px;right:-80px;width:320px;height:320px;border-radius:50%;border:1px solid rgba(237,50,55,0.06);"></div>
  <div style="position:absolute;bottom:-150px;left:-100px;width:400px;height:400px;border-radius:50%;border:1px solid rgba(237,50,55,0.04);"></div>

  <div style="padding:40px 56px 0;display:flex;justify-content:space-between;align-items:center;">
    ${LOGO}
    <div style="text-align:right;">
      <div style="font-size:8px;font-weight:700;color:#888888;letter-spacing:3px;text-transform:uppercase;">Proposta Comercial</div>
      <div style="font-size:8px;color:#888888;margin-top:2px;">${code}</div>
    </div>
  </div>

  <div style="padding:80px 56px 0;">
    <div style="font-size:9px;font-weight:700;color:#ED3237;letter-spacing:4px;text-transform:uppercase;margin-bottom:16px;">Proposta de Projeto</div>
    <h1 style="font-size:46px;font-weight:400;color:#FEFEFE;line-height:1.05;margin-bottom:4px;">${project.split(' ').slice(0, Math.ceil(project.split(' ').length/2)).join(' ')}</h1>
    <h1 style="font-size:46px;font-weight:400;line-height:1.05;"><em style="font-style:italic;color:#ED3237;">${project.split(' ').slice(Math.ceil(project.split(' ').length/2)).join(' ') || 'Software'}</em></h1>
    <div style="width:60px;height:3px;background:#ED3237;margin:32px 0;border-radius:2px;"></div>
    <div style="font-size:14px;color:#888888;line-height:1.7;max-width:420px;font-family:'Outfit',sans-serif;">${desc}</div>
  </div>

  <div style="position:absolute;top:200px;right:56px;text-align:right;">
    <div style="background:#2D2D2D;border:1px solid #3D3D3D;border-radius:10px;padding:20px 24px;display:inline-block;">
      <div style="font-size:8px;font-weight:700;color:#ED3237;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Cliente</div>
      <div style="font-size:18px;font-weight:700;color:#FEFEFE;line-height:1.2;">${client}</div>
      <div style="margin-top:10px;font-size:10px;color:#888888;">${SIZE_LABEL[result.projectSize]} · ${result.totalHours}h</div>
    </div>
  </div>

  <div style="position:absolute;bottom:0;left:0;right:0;padding:0 56px 40px;">
    <div style="display:flex;gap:24px;margin-bottom:32px;">
      <div style="flex:1;">
        <div style="font-size:8px;font-weight:700;color:#888888;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Empresa</div>
        <div style="font-size:14px;font-weight:700;color:#FEFEFE;">${client.toUpperCase()}</div>
      </div>
      <div>
        <div style="font-size:8px;font-weight:700;color:#888888;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Data</div>
        <div style="font-size:14px;font-weight:700;color:#FEFEFE;">${dateStr}</div>
      </div>
      <div>
        <div style="font-size:8px;font-weight:700;color:#888888;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Validade</div>
        <div style="font-size:14px;font-weight:700;color:#ED3237;">15 dias</div>
      </div>
    </div>
    <div style="height:1px;background:#3D3D3D;margin-bottom:16px;"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <div style="font-size:9px;color:#888888;">contato@simplexsolucoes.com.br</div>
      <div style="font-size:9px;color:#888888;">Simplex Soluções · Mato Grosso, Brasil</div>
    </div>
  </div>
</div>

${activeModules.length > 0 ? `
<!-- ===== PAGE 2 - ESCOPO ===== -->
<div class="page" style="background:#1A1A1A;">
  <div class="header">
    ${LOGO_SM}
    <div style="font-size:8px;font-weight:700;color:#888888;letter-spacing:3px;">PROPOSTA COMERCIAL · ${client.toUpperCase()}</div>
  </div>

  <div style="padding:32px 56px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
      <div class="section-num"><span>01</span></div>
      <h2 style="font-size:22px;color:#FEFEFE;">Escopo do <em style="font-style:italic;">Projeto</em></h2>
    </div>

    <p style="font-size:12px;color:#888888;line-height:1.7;margin-bottom:20px;font-family:'Outfit',sans-serif;">
      A <strong style="color:#FEFEFE;">SPXIA</strong> irá desenvolver o projeto <strong style="color:#FEFEFE;">${project}</strong> para
      <strong style="color:#FEFEFE;">${client}</strong>, com complexidade técnica <em>${COMPLEXITY_LABEL[complexity].toLowerCase()}</em>,
      totalizando <strong style="color:#FEFEFE;">${result.totalHours} horas</strong> de desenvolvimento distribuídas entre backend, frontend, QA, módulos e integrações.
    </p>

    <div style="background:#2D2D2D;border-radius:8px;padding:16px 20px;border-left:3px solid #ED3237;margin-bottom:20px;">
      <div style="font-size:9px;font-weight:700;color:#ED3237;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Visão Geral</div>
      <div style="font-size:11px;color:#FEFEFE;line-height:1.7;font-family:'Outfit',sans-serif;">
        Backend: <strong>${backendHours}h</strong> · Frontend: <strong>${frontendHours}h</strong> · QA: <strong>${qaHours}h</strong>
        ${intCount > 0 ? ` · Integrações: <strong>${intCount}</strong> (${result.integrationHours}h)` : ''}
        · Complexidade: <em>${COMPLEXITY_LABEL[complexity]}</em> (×${COMPLEXITY_MULT[complexity]})
      </div>
    </div>

    <div style="font-size:9px;font-weight:700;color:#FEFEFE;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Módulos do Projeto</div>
    <div style="display:flex;flex-direction:column;gap:5px;">
      ${deliverableItems}
    </div>
  </div>

  <div class="footer">
    <span>SPXIA · Proposta Comercial</span>
    <span style="font-size:8px;color:#888888;">02 / ${String(totalPages).padStart(2,'0')}</span>
  </div>
</div>
` : ''}

<!-- ===== PAGE ${totalPages} - INVESTIMENTO ===== -->
<div class="page" style="background:#1A1A1A;">
  <div class="header">
    ${LOGO_SM}
    <div style="font-size:8px;font-weight:700;color:#888888;letter-spacing:3px;">PROPOSTA COMERCIAL · ${client.toUpperCase()}</div>
  </div>

  <div style="padding:28px 56px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">
      <div class="section-num"><span>${activeModules.length > 0 ? '02' : '01'}</span></div>
      <h2 style="font-size:22px;color:#FEFEFE;"><em style="font-style:italic;">Investimento</em></h2>
    </div>

    <!-- Price box -->
    <div style="background:#2D2D2D;border-radius:10px;padding:24px 28px;margin-bottom:18px;position:relative;overflow:hidden;border:1px solid #3D3D3D;">
      <div style="position:absolute;top:-20px;right:-20px;width:120px;height:120px;border-radius:50%;background:rgba(237,50,55,0.05);"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-size:9px;font-weight:700;color:#ED3237;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">Valor do Projeto</div>
          <div style="font-size:42px;font-weight:900;color:#FEFEFE;line-height:1;font-family:Inter;">${fmt(result.finalPrice).replace('R$ ', 'R$ ').replace(/,\d{2}$/, '<span style="font-size:18px;color:#888888;">$&</span>')}</div>
          <div style="font-size:11px;color:#888888;margin-top:6px;">Pagamento em até 3x sem juros</div>
        </div>
        <div style="text-align:center;">
          <div style="background:rgba(237,50,55,0.1);border:1px solid rgba(237,50,55,0.2);border-radius:8px;padding:14px 20px;">
            <div style="font-size:9px;font-weight:700;color:#ED3237;letter-spacing:2px;margin-bottom:4px;">PRAZO</div>
            <div style="font-size:28px;font-weight:900;color:#FEFEFE;font-family:Inter;">${deadline}</div>
            <div style="font-size:10px;color:#888888;">dias úteis</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Breakdown table -->
    <div style="font-size:9px;font-weight:700;color:#FEFEFE;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Composição do Investimento</div>
    <div style="border-radius:8px;overflow:hidden;border:1px solid #3D3D3D;margin-bottom:16px;">
      <div style="display:flex;background:#111111;padding:9px 18px;">
        <div style="flex:2;font-size:9px;font-weight:700;color:#888888;letter-spacing:1px;">ITEM</div>
        <div style="flex:3;font-size:9px;font-weight:700;color:#888888;letter-spacing:1px;">DESCRIÇÃO</div>
        <div style="flex:1;font-size:9px;font-weight:700;color:#888888;letter-spacing:1px;text-align:right;">VALOR</div>
      </div>
      ${breakdownHTML}
      <div style="display:flex;padding:10px 18px;background:#111111;border-top:1px solid #3D3D3D;">
        <div style="flex:5;font-size:11px;font-weight:800;color:#FEFEFE;">CUSTO TOTAL</div>
        <div style="flex:1;font-size:11px;font-weight:800;color:#FEFEFE;text-align:right;">${fmt(result.totalCost)}</div>
      </div>
      <div style="display:flex;padding:10px 18px;background:rgba(237,50,55,0.08);border-top:1px solid rgba(237,50,55,0.2);">
        <div style="flex:5;font-size:11px;font-weight:800;color:#ED3237;">PREÇO FINAL (margem ${pct(result.realMargin)})</div>
        <div style="flex:1;font-size:12px;font-weight:900;color:#ED3237;text-align:right;">${fmt(result.finalPrice)}</div>
      </div>
    </div>

    <!-- Conditions -->
    <div style="display:flex;gap:12px;margin-bottom:14px;">
      <div style="flex:1;background:#2D2D2D;border-radius:8px;padding:14px 18px;border:1px solid #3D3D3D;">
        <div style="font-size:9px;font-weight:700;color:#ED3237;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Forma de Pagamento</div>
        <div style="font-size:10px;color:#FEFEFE;line-height:1.7;font-family:'Outfit',sans-serif;">
          50% na aprovação (${fmt(result.finalPrice / 2)})<br>
          50% na entrega final (${fmt(result.finalPrice / 2)})<br>
          Via PIX, transferência ou boleto.
        </div>
      </div>
      <div style="flex:1;background:#2D2D2D;border-radius:8px;padding:14px 18px;border:1px solid #3D3D3D;">
        <div style="font-size:9px;font-weight:700;color:#ED3237;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Especificação Técnica</div>
        <div style="font-size:10px;color:#FEFEFE;line-height:1.7;font-family:'Outfit',sans-serif;">
          Horas totais: ${result.totalHours}h<br>
          Complexidade: ${COMPLEXITY_LABEL[complexity]} (×${COMPLEXITY_MULT[complexity]})<br>
          Classificação: Projeto ${SIZE_LABEL[result.projectSize]}
        </div>
      </div>
    </div>

    <!-- Observations -->
    <div style="background:#2D2D2D;border-radius:8px;padding:12px 18px;border-left:3px solid #ED3237;margin-bottom:14px;">
      <div style="font-size:9px;font-weight:700;color:#ED3237;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">Observações</div>
      <div style="font-size:10px;color:#888888;line-height:1.7;font-family:'Outfit',sans-serif;">
        • Hospedagem e domínio não inclusos (valor a combinar).<br>
        • Alterações fora do escopo aprovado serão orçadas separadamente.<br>
        • Suporte técnico de 30 dias após entrega incluso.<br>
        • Esta proposta é válida por <strong style="color:#FEFEFE;">15 dias</strong> a partir da data de emissão.
      </div>
    </div>

    <!-- Signatures -->
    <div style="display:flex;gap:40px;margin-top:10px;">
      <div style="flex:1;text-align:center;">
        <div style="border-bottom:1px solid #3D3D3D;padding-bottom:6px;margin-bottom:6px;height:36px;"></div>
        <div style="font-size:11px;font-weight:700;color:#FEFEFE;">Simplex Soluções Tecnológicas</div>
        <div style="font-size:9px;color:#888888;">CNPJ: 27.304.891/0001-26</div>
      </div>
      <div style="flex:1;text-align:center;">
        <div style="border-bottom:1px solid #3D3D3D;padding-bottom:6px;margin-bottom:6px;height:36px;"></div>
        <div style="font-size:11px;font-weight:700;color:#FEFEFE;">${client.toUpperCase()}</div>
        <div style="font-size:9px;color:#888888;">Aceite e Assinatura</div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div style="position:absolute;bottom:0;left:0;right:0;">
    <div class="footer">
      <span>SPXIA · Proposta Comercial</span>
      <span style="font-size:8px;color:#888888;">${String(totalPages).padStart(2,'0')} / ${String(totalPages).padStart(2,'0')}</span>
    </div>
    <div style="background:#111111;padding:14px 56px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #2D2D2D;">
      <div style="display:flex;align-items:center;gap:10px;">
        ${LOGO_XS}
        <div style="font-size:9px;color:#888888;font-style:italic;font-family:'DM Serif Display',serif;">"Pare de apostar. Comece a <em>engenheirar</em>."</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:8px;color:#888888;">Simplex Soluções · Mato Grosso, Brasil</div>
        <div style="font-size:8px;color:#888888;">contato@simplexsolucoes.com.br</div>
      </div>
    </div>
  </div>
</div>

</body>
</html>`

    const w = window.open('', '_blank')
    w.document.write(html)
    w.document.close()
    setTimeout(() => w.print(), 800)
  }

  // ── Gauge da margem ──
  const gaugeColor = result.realMargin < 0.5 ? '#ED3237' : result.realMargin <= 0.6 ? '#fbbf24' : result.realMargin <= 0.7 ? '#4ade80' : '#60a5fa'

  const tabs = [
    { id: 'dev', label: 'Desenvolvimento' },
    { id: 'mgmt', label: 'Gestão & Infra' },
    { id: 'risk', label: 'Risco & Financeiro' },
    { id: 'modules', label: 'Módulos' },
    { id: 'integrations', label: 'Integrações' },
    { id: 'proposal', label: 'Proposta' },
    { id: 'templates', label: 'Templates' },
  ]

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Calculadora de Projetos</h1>
          <p className="admin-page-desc">Precificação estratégica para projetos de software</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={copyProposal}>Copiar Texto</button>
          <button className="btn btn-primary btn-sm" onClick={exportPDF}>Exportar PDF</button>
        </div>
      </div>

      <div className="calc-layout">
        {/* ── PAINEL ESQUERDO (inputs) ── */}
        <div className="calc-left">
          <div className="filter-bar" style={{ flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button key={t.id} className={`filter-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>

          {/* Aba Desenvolvimento */}
          {tab === 'dev' && (
            <div className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Horas Backend</label>
                  <input type="number" min={0} value={backendHours} onChange={e => setBackendHours(+e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Horas Frontend</label>
                  <input type="number" min={0} value={frontendHours} onChange={e => setFrontendHours(+e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Horas QA</label>
                  <input type="number" min={0} value={qaHours} onChange={e => setQaHours(+e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Valor/Hora (R$)</label>
                  <input type="number" min={10} value={hourlyRate} onChange={e => setHourlyRate(+e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Complexidade Técnica</label>
                  <select value={complexity} onChange={e => setComplexity(e.target.value)}>
                    <option value="low">Baixa (x1.0)</option>
                    <option value="medium">Média (x1.2)</option>
                    <option value="high">Alta (x1.5)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Aba Gestão & Infra */}
          {tab === 'mgmt' && (
            <div className="admin-form">
              <div className="form-group">
                <label>Percentual Gestão: {pct(mgmtRate)}</label>
                <input type="range" min={0.05} max={0.50} step={0.01} value={mgmtRate} onChange={e => setMgmtRate(+e.target.value)} />
                <span className="calc-range-hint">Inclui reuniões, alinhamentos, retrabalho</span>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Custo Cloud (R$)</label>
                  <input type="number" min={0} value={cloud} onChange={e => setCloud(+e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Custo APIs (R$)</label>
                  <input type="number" min={0} value={apis} onChange={e => setApis(+e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Custo Ferramentas (R$)</label>
                  <input type="number" min={0} value={tools} onChange={e => setTools(+e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Aba Risco & Financeiro */}
          {tab === 'risk' && (
            <div className="admin-form">
              <div className="form-group">
                <label>Percentual Risco: {pct(riskRate)}</label>
                <input type="range" min={0.05} max={0.60} step={0.01} value={riskRate} onChange={e => setRiskRate(+e.target.value)} />
                <span className="calc-range-hint">Escopo aberto, cliente indeciso, integrações complexas</span>
              </div>
              <div className="form-group">
                <label>Imposto: {pct(taxRate)}</label>
                <input type="range" min={0} max={0.50} step={0.01} value={taxRate} onChange={e => setTaxRate(+e.target.value)} />
              </div>
              <div className="form-group">
                <label>Margem Desejada: {pct(desiredMargin)}</label>
                <input type="range" min={0.10} max={0.90} step={0.01} value={desiredMargin} onChange={e => setDesiredMargin(+e.target.value)} />
                <span className="calc-range-hint">Recomendado: 50% a 70%</span>
              </div>
            </div>
          )}

          {/* Aba Módulos */}
          {tab === 'modules' && (
            <div className="calc-modules">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span className="calc-section-title">{modules.filter(m => m.isActive).length} módulo(s) ativo(s)</span>
                <button className="btn btn-primary btn-sm" onClick={() => setShowModuleForm(!showModuleForm)}>
                  {showModuleForm ? 'Cancelar' : '+ Novo Módulo'}
                </button>
              </div>

              {showModuleForm && (
                <div className="admin-form" style={{ marginBottom: 16 }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nome</label>
                      <input value={newMod.name} onChange={e => setNewMod({ ...newMod, name: e.target.value })} placeholder="Nome do módulo" />
                    </div>
                    <div className="form-group">
                      <label>Horas</label>
                      <input type="number" min={1} value={newMod.estimatedHours} onChange={e => setNewMod({ ...newMod, estimatedHours: +e.target.value })} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Complexidade</label>
                      <select value={newMod.complexity} onChange={e => setNewMod({ ...newMod, complexity: e.target.value })}>
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Tipo</label>
                      <select value={newMod.type} onChange={e => setNewMod({ ...newMod, type: e.target.value })}>
                        <option value="core">Core</option>
                        <option value="extra">Extra</option>
                      </select>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={addModule}>Adicionar</button>
                </div>
              )}

              {modules.map(m => (
                <div key={m.id} className={`calc-module-card${m.isActive ? ' active' : ''}`}>
                  <div className="calc-module-check">
                    <input type="checkbox" checked={m.isActive} onChange={() => toggleModule(m.id)} />
                  </div>
                  <div className="calc-module-info">
                    <div className="calc-module-header">
                      <span className="calc-module-name">{m.name}</span>
                      <div className="calc-module-badges">
                        <span className={`calc-badge calc-badge-${m.type}`}>{TYPE_LABEL[m.type]}</span>
                        <span className={`calc-badge calc-badge-complexity-${m.complexity}`}>{COMPLEXITY_LABEL[m.complexity]}</span>
                      </div>
                    </div>
                    {m.description && <span className="calc-module-desc">{m.description}</span>}
                    <div className="calc-module-hours">
                      <label>Horas:</label>
                      <input type="number" min={1} value={m.estimatedHours} onChange={e => updateModuleHours(m.id, +e.target.value)} />
                      {m.isActive && <span className="calc-module-cost">{fmt(m.estimatedHours * hourlyRate * COMPLEXITY_MULT[m.complexity])}</span>}
                    </div>
                  </div>
                  {m.id.startsWith('custom-') && (
                    <button className="calc-module-remove" onClick={() => removeModule(m.id)} title="Remover">×</button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Aba Integrações */}
          {tab === 'integrations' && (
            <div className="admin-form">
              <div className="form-group">
                <label>Número de Integrações</label>
                <input type="number" min={0} value={intCount} onChange={e => setIntCount(+e.target.value)} />
              </div>
              <div className="form-group">
                <label>Horas por Integração: {intHours}h</label>
                <input type="range" min={5} max={15} step={1} value={intHours} onChange={e => setIntHours(+e.target.value)} />
                <span className="calc-range-hint">Padrão: 10h por integração (5h a 15h)</span>
              </div>
              {intCount > 0 && (
                <div className="calc-int-summary">
                  <span>Total de horas em integrações: <strong>{result.integrationHours}h</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Aba Proposta */}
          {tab === 'proposal' && (
            <div className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nome do Cliente</label>
                  <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Ex: Empresa ABC" />
                </div>
                <div className="form-group">
                  <label>Nome do Projeto</label>
                  <input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Ex: Sistema de Gestão" />
                </div>
              </div>
              <div className="form-group">
                <label>Descrição do Projeto</label>
                <textarea rows={3} value={projectDesc} onChange={e => setProjectDesc(e.target.value)} placeholder="Descrição que aparecerá na capa da proposta (opcional — gerado automaticamente se vazio)" />
              </div>
              <div className="form-group">
                <label>Prazo (dias úteis)</label>
                <input type="number" min={1} value={deadline} onChange={e => setDeadline(+e.target.value)} />
              </div>
              <div style={{ marginTop: 16 }}>
                <button className="btn btn-primary" onClick={exportPDF}>Exportar Proposta em PDF</button>
              </div>
            </div>
          )}

          {/* Aba Templates */}
          {tab === 'templates' && (
            <div>
              <div className="admin-form" style={{ marginBottom: 16 }}>
                <div className="form-group" style={{ marginBottom: 8 }}>
                  <label>Salvar configuração atual</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input value={tplName} onChange={e => setTplName(e.target.value)} placeholder="Nome do template" style={{ flex: 1 }} />
                    <button className="btn btn-primary btn-sm" onClick={saveTemplate} disabled={!tplName.trim()}>Salvar</button>
                  </div>
                </div>
              </div>

              {templates.length === 0 && <p className="admin-empty">Nenhum template salvo.</p>}
              {templates.map(t => (
                <div key={t.id} className="calc-template-card">
                  <div className="calc-template-info">
                    <span className="calc-template-name">{t.name}</span>
                    <span className="calc-template-date">{new Date(t.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => loadTemplate(t)}>Carregar</button>
                    <button className="btn btn-sm" style={{ color: '#ED3237', border: '1px solid #ED3237' }} onClick={() => deleteTemplate(t.id)}>Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── PAINEL DIREITO (resultados live) ── */}
        <div className="calc-right">
          {/* Resumo de horas */}
          <div className="calc-result-section">
            <div className="calc-result-title">Resumo</div>
            <div className="calc-result-row">
              <span>Classificação</span>
              <span className="calc-size-badge" data-size={result.projectSize}>{SIZE_LABEL[result.projectSize]}</span>
            </div>
            <div className="calc-result-row">
              <span>Horas Totais</span>
              <strong>{result.totalHours}h</strong>
            </div>
            <div className="calc-result-sub">
              <span>Dev: {result.devHours}h</span>
              <span>Integrações: {result.integrationHours}h</span>
              <span>Módulos: {result.moduleHours}h</span>
            </div>
          </div>

          {/* Breakdown de custos */}
          <div className="calc-result-section">
            <div className="calc-result-title">Breakdown</div>
            <div className="calc-result-row"><span>Desenvolvimento</span><span>{fmt(result.devCost)}</span></div>
            {result.totalModulesCost > 0 && <div className="calc-result-row"><span>Módulos</span><span>{fmt(result.totalModulesCost)}</span></div>}
            <div className="calc-result-row"><span>Gestão ({pct(mgmtRate)})</span><span>{fmt(result.managementCost)}</span></div>
            <div className="calc-result-row"><span>Infraestrutura</span><span>{fmt(result.infraCost)}</span></div>
            <div className="calc-result-row"><span>Impostos ({pct(taxRate)})</span><span>{fmt(result.taxValue)}</span></div>
            <div className="calc-result-row"><span>Risco ({pct(riskRate)})</span><span>{fmt(result.riskValue)}</span></div>
          </div>

          {/* Totais */}
          <div className="calc-result-section calc-totals">
            <div className="calc-result-row calc-row-big"><span>Custo Total</span><span>{fmt(result.totalCost)}</span></div>
            <div className="calc-result-row calc-row-price"><span>Preço Final</span><span>{fmt(result.finalPrice)}</span></div>
            <div className="calc-result-row calc-row-profit"><span>Lucro</span><span>{fmt(result.profit)}</span></div>
          </div>

          {/* Gauge de margem */}
          <div className="calc-result-section calc-gauge-section">
            <div className="calc-result-title">Margem Real</div>
            <div className="calc-gauge">
              <div className="calc-gauge-bar" style={{ width: `${Math.min(result.realMargin * 100, 100)}%`, background: gaugeColor }} />
            </div>
            <div className="calc-gauge-value" style={{ color: gaugeColor }}>{pct(result.realMargin)}</div>
            <div className="calc-gauge-legend">
              <span style={{ color: '#ED3237' }}>&lt;50%</span>
              <span style={{ color: '#fbbf24' }}>50-60%</span>
              <span style={{ color: '#4ade80' }}>60-70%</span>
              <span style={{ color: '#60a5fa' }}>&gt;70%</span>
            </div>
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <div className="calc-result-section">
              <div className="calc-result-title">Insights ({insights.length})</div>
              {insights.map((ins, i) => (
                <div key={i} className={`calc-insight calc-insight-${ins.type}`}>
                  <span className="calc-insight-msg">{ins.msg}</span>
                  {ins.action && <span className="calc-insight-action">{ins.action}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Faixa de mercado */}
          <div className="calc-result-section">
            <div className="calc-result-title">Faixa de Mercado</div>
            <div className="calc-result-row">
              <span>{SIZE_LABEL[result.projectSize]}</span>
              <span>
                {fmt(SIZE_RANGE[result.projectSize][0])}
                {SIZE_RANGE[result.projectSize][1] < Infinity ? ` – ${fmt(SIZE_RANGE[result.projectSize][1])}` : '+'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
