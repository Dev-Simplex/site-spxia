import type { Dictionary } from './pt'

const en: Dictionary = {
  lang: 'en',

  nav: {
    sobre: 'About',
    servicos: 'Solutions',
    comoFunciona: 'How it works',
    cases: 'Projects',
    mentoria: 'Training',
    cta: 'Contact',
    diagnostico: "Let's talk",
    entrar: 'Sign in',
    inicio: 'SPXia, home page',
    abrirMenu: 'Open menu',
    fecharMenu: 'Close menu',
  },

  hero: {
    badge: 'CONSULTING · AUTOMATION · AI FOR BUSINESS',
    title1: 'Your business needs',
    titleEm1: 'AI that works.',
    title2: 'Not promises.',
    sub: 'Consulting, system development, automation and custom AI projects. From strategy to production, with measurable results.',
    cta1: 'Our Services',
    cta2: 'Book a Diagnosis',
    stats: [
      { value: '50+', label: 'PROJECTS DELIVERED' },
      { value: '40+', label: 'AUTOMATIONS IN PRODUCTION' },
      { value: '100%', label: 'CLIENTS WITH POSITIVE ROI' },
    ],
  },

  sobre: {
    number: '01',
    label: 'ABOUT US',
    title: 'SPXIA transforms businesses with',
    titleEm: 'applied artificial intelligence.',
    p1: 'We are the intelligence and automation division of Simplex Soluções. We act as strategic partners for companies that want to use AI to solve real problems, not to follow trends.',
    p2: 'From consulting to development, from automation to training: we deliver complete projects with our own methodology, tested in production and focused on financial return.',
    values: [
      { title: 'Strategy + Execution', desc: "We don't deliver slides. We deliver running systems, working automations and trained teams." },
      { title: 'Engineering Rigor', desc: 'Every project with architecture, testing and monitoring. Zero improvisation.' },
      { title: 'Fast Results', desc: 'First automations live within weeks. Measurable ROI from the first month.' },
      { title: 'Long-Term Partnership', desc: 'Ongoing advisory, not build-and-leave. We grow alongside your business.' },
    ],
  },

  problema: {
    calloutTitle: 'Most companies are',
    calloutTitleEm: 'losing money',
    calloutTitle2: 'with AI.',
    calloutDesc: 'They invest in tools, hire shallow courses and try to implement alone. The result: abandoned projects, frustrated teams and zero return. SPXIA exists to change that.',
    semLabel: 'WITHOUT SPXIA',
    comLabel: 'WITH SPXIA',
    sem: [
      'Team lost among dozens of AI tools',
      'Automations that break and no one can fix',
      'Tech investment with no clear return',
      'AI projects that never leave PowerPoint',
      'Vendors that deliver and disappear',
    ],
    com: [
      'Clear strategy: which AI to use, where and why',
      'Monitored automations with fallback and alerts',
      'Documented ROI from the first month',
      'Projects in production with real data',
      'Continuous advisory and constant evolution',
    ],
  },

  servicos: {
    number: '02',
    label: 'SERVICES',
    title: 'Everything your business needs to',
    titleEm: 'profit with AI.',
    desc: 'From strategy to code. From training to monitoring. Complete solutions.',
    items: [
      { tag: 'STRATEGY', title: 'AI Consulting', desc: 'Business diagnosis, opportunity identification and AI implementation roadmap with projected ROI.' },
      { tag: 'DEVELOPMENT', title: 'System Development', desc: 'Custom-built systems: SaaS, web platforms, internal apps, APIs and integrations with embedded AI.' },
      { tag: 'AUTOMATION', title: 'Intelligent Automations', desc: 'Automated workflows with n8n, WhatsApp, CRM, finance, email and any API. Monitored 24/7.' },
      { tag: 'ARTIFICIAL INTELLIGENCE', title: 'AI Projects', desc: 'Design and implementation of projects with AI agents, chatbots, data analysis, content generation and virtual assistants.' },
      { tag: 'EDUCATION', title: 'Mentoring & Training', desc: 'Training programs for teams and leaders: how to use AI daily, practical tools, strategy and implementation.' },
      { tag: 'PARTNERSHIP', title: 'Ongoing Advisory', desc: 'Monthly follow-up on your business: project evolution, new AI opportunities, technical and strategic support.' },
    ],
  },

  comoFunciona: {
    number: '03',
    label: 'HOW IT WORKS',
    title: 'From diagnosis to',
    titleEm: 'results.',
    desc: 'Clear process, no surprises. You follow every step.',
    steps: [
      { num: '01', title: 'Diagnosis', desc: 'We analyze your business, processes and opportunities. We identify where AI generates the most financial impact.', detail: 'Initial meeting + report with projected ROI' },
      { num: '02', title: 'Strategy', desc: 'We design the roadmap: which projects, in what order, with which tools and what investment.', detail: 'Action plan with timeline and deliverables' },
      { num: '03', title: 'Execution', desc: 'We develop systems, automations and integrations. Everything with architecture, tests and documentation.', detail: 'Weekly deliveries with client validation' },
      { num: '04', title: 'Evolution', desc: 'We monitor, optimize and expand. Ongoing advisory to ensure results keep growing.', detail: 'Monthly follow-up + new opportunities' },
    ],
  },

  cases: {
    number: '04',
    label: 'CASES',
    title: 'Projects',
    titleEm: 'in production.',
    desc: "These aren't prototypes. These are systems running with real data and paying clients. All built through AI-powered development.",
    aiBadge: 'BUILT WITH AI',
    items: [
      {
        sector: 'AUTOMATION & AI AGENTS',
        title: 'CopilotAB',
        desc: 'Complete automation platform with AI agents and WhatsApp. Intelligent customer service, lead qualification and conversation management, all automated and monitored in real time.',
        metrics: ['Autonomous AI agents', 'Native WhatsApp integration', 'Real-time conversation management', 'Automatic lead qualification'],
        link: null,
      },
      {
        sector: 'VIRTUAL ASSISTANT',
        title: 'ChatSPX',
        desc: 'Intelligent virtual assistant with advanced conversational AI. Modern interface, contextual responses and integration with custom knowledge bases for each client.',
        metrics: ['Advanced conversational AI', 'Custom knowledge base', 'Modern responsive interface', 'Real-time contextual responses'],
        link: 'https://www.chatspx.com.br/',
      },
      {
        sector: 'SOLAR ENERGY',
        title: 'Financing & Funding Management',
        desc: 'Complete management system for financing and funding of solar energy projects. Proposal control, financial simulations, approval tracking and management reports.',
        metrics: ['Automated financial simulation', 'Proposal and approval control', 'Complete management reports', 'Integrated financing pipeline'],
        link: null,
      },
      {
        sector: 'TECHNICAL SUPPORT',
        title: 'Service Order System',
        desc: 'Complete service order management with financial control, inventory, clients and reports. 60% reduction in service time.',
        metrics: ['Full OS management', 'Integrated financial control', 'Inventory and client management', '-60% service time'],
        link: null,
      },
      {
        sector: 'B2B PROSPECTING',
        title: 'Smart Lead Capture',
        desc: 'AI-powered prospecting platform that identifies, qualifies and organizes leads automatically. WhatsApp and CRM integration.',
        metrics: ['Automatic lead capture', 'AI-powered qualification', 'WhatsApp and CRM integration', 'Integrated sales pipeline'],
        link: null,
      },
      {
        sector: 'CUSTOMER SERVICE',
        title: 'AI Agents on WhatsApp',
        desc: 'Intelligent chatbots that serve, qualify and route customers 24/7. 80% reduction in response time.',
        metrics: ['24/7 support', 'Automatic qualification', 'Smart routing', '-80% response time'],
        link: null,
      },
    ],
  },

  mentoria: {
    number: '06',
    label: 'MENTORING & TRAINING',
    title: 'Knowledge that',
    titleEm: 'drives results.',
    desc: 'Practical programs for leaders and teams. No empty theory: everything applied to your context.',
    programs: [
      {
        audience: 'CEOs, directors, managers',
        title: 'AI for Business Leaders',
        desc: "Understand what AI can (and can't) do for your business. Learn to identify opportunities, calculate ROI and make technology investment decisions.",
        topics: ['Real AI landscape in 2026', 'Where AI generates revenue vs burns cash', 'How to evaluate vendors and projects', 'Practical roadmap for your company'],
      },
      {
        audience: 'Developers, tech leads, analysts',
        title: 'AI for Technical Teams',
        desc: 'Hands-on training with AI tools on real projects. Claude Code, agents, automations, integration with existing systems.',
        topics: ['Claude Code and agents in practice', 'Automations with n8n and APIs', 'AI integration into existing systems', 'Best practices and pitfalls'],
      },
      {
        audience: 'Entrepreneurs and professionals',
        title: 'Individual Mentoring',
        desc: 'Personalized guidance for those who want to implement AI in their business or career. Weekly sessions with action plan.',
        topics: ['Personalized diagnosis', 'Custom implementation plan', 'Weekly follow-up', 'Direct access to SPXIA team'],
      },
    ],
  },

  contato: {
    title: 'What could be',
    titleEm: 'simpler at your company?',
    desc: "Book a free diagnosis. In 30 minutes, we'll show you where AI can help your routine first.",
    cta: 'Book a free diagnosis',
    emailCta: 'Email us',
    email: 'contato@simplexsolucoes.com.br',
    location: 'Sinop · Mato Grosso, Brazil',
    booking: {
      title: 'Free diagnosis',
      meta: '30 minutes · online or in person',
      days: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      confirm: 'Confirm time',
    },
  },

  footer: {
    copy: '© 2026 SPXia',
    tagline: 'AI and automation that make running a business simpler. SPX comes from Simplex.',
    navigation: 'Navigation',
    solutions: 'Solutions',
    solutionItems: ['Chat SPX', 'VoxIA', 'Automations', 'AI consulting'],
    contact: 'Contact',
    faq: 'Questions',
    schedule: 'Book a diagnosis',
    clientArea: 'Client area',
    legal: 'Legal',
    privacy: 'Privacy',
    terms: 'Terms',
  },
}

export default en
