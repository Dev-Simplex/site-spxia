import type { Metadata } from 'next'
import Link from 'next/link'
import {
  LegalShell,
  LegalSection,
  LegalList,
  LegalItem,
  LegalTerm,
  type TocEntry,
} from '@/components/legal/legal-shell'

export const metadata: Metadata = {
  title: { absolute: 'Política de privacidade | SPXia' },
  description:
    'Como o aplicativo Chat SPX trata dados pessoais: permissões do app, serviços de terceiros, retenção e direitos do titular. Cada empresa cliente mantém as conversas no próprio servidor.',
  alternates: { canonical: '/privacidade' },
}

const EMAIL = 'sup@simplexsolucoes.com.br'

const toc: TocEntry[] = [
  { id: 'controlador-operador', number: '01', title: 'Quem controla e quem opera os dados', titleEn: "Who controls and processes the data" },
  { id: 'dados-tratados', number: '02', title: 'Quais dados são tratados', titleEn: "Which data is processed" },
  { id: 'aplicativo-movel', number: '03', title: 'O aplicativo móvel e suas permissões', titleEn: "The mobile app and its permissions" },
  { id: 'terceiros', number: '04', title: 'Serviços de terceiros', titleEn: "Third-party services" },
  { id: 'diagnostico', number: '05', title: 'Dados de diagnóstico e falhas', titleEn: "Diagnostics and crash data" },
  { id: 'retencao', number: '06', title: 'Por quanto tempo os dados ficam guardados', titleEn: "How long data is kept" },
  { id: 'direitos', number: '07', title: 'Seus direitos e como exercê-los', titleEn: "Your rights and how to exercise them" },
  { id: 'seguranca', number: '08', title: 'Segurança', titleEn: "Security" },
  { id: 'criancas', number: '09', title: 'Dados de crianças e adolescentes', titleEn: "Children and teenagers" },
  { id: 'alteracoes', number: '10', title: 'Alterações desta política', titleEn: "Changes to this policy" },
  { id: 'contato', number: '11', title: 'Contato', titleEn: "Contact" },
]

const englishSections = [
  {
    "id": "controlador-operador",
    "title": "Who controls and processes the data",
    "paragraphs": [
      "Chat SPX is a mobile customer service app for Android and iOS, developed by SPX Inteligência e Desenvolvimento LTDA, CNPJ 68.387.997/0001-18, based at Avenida das Figueiras, 1646, Sala 8B, Setor Comercial, Sinop / MT, CEP 78550-150, Brazil.",
      "The app is used by support agents at companies that subscribe to the software, rather than by end customers. Each client company has its own server: conversations, contacts and end customer data are stored on that company’s server, not on SPX servers.",
      "The client company is the data controller: it decides what is collected, why, how long it is kept and who has access. SPX is the processor: it supplies and maintains the software, following the client company’s instructions and the limits of its contract.",
      "SPX does not access conversation content for its own purposes. End customers should direct questions about their data to the company serving them, which is the controller. Support agents with questions about the app can use the contact in section 11."
    ]
  },
  {
    "id": "dados-tratados",
    "title": "Which data is processed",
    "paragraphs": [
      "Agent account data includes the name, email or login name, permission profile and association with the client company. This data stays on the company’s server and is used to authenticate the agent and identify who handled each conversation.",
      "Agents do not create an account in the app. The administrator of their company creates it; Chat SPX has no self-registration screen.",
      "Customer service content includes text messages, audio, photos, files and contact details exchanged between the agent and end customer, and records of when messages were sent, received and read. This content travels between the app and the client company’s server, where it is stored. SPX does not keep a copy on its own infrastructure.",
      "Technical device data includes the notification identifier (push token) and diagnostic information when the app fails, as described in sections 04 and 05."
    ]
  },
  {
    "id": "aplicativo-movel",
    "title": "The mobile app and its permissions",
    "paragraphs": [
      "Chat SPX requests only the permissions needed for customer service. None are used in the background to collect information unrelated to a conversation. Each permission is requested when its feature is used; you can refuse it or revoke it later in system settings, in which case only that feature stops working.",
      "Contacts (read and write): reading lets agents start a conversation by selecting someone from the device address book without typing a number; writing lets agents save a contact received in a message.",
      "Microphone: records voice messages for a conversation. Camera: takes a photo to send to a customer and reads QR codes. Photos and media: attaches files and images already on the device and saves received media to the gallery. Notifications: alerts the agent to new messages.",
      "The device address book is not sent to any server or stored in bulk. It is read on the device only to display the list and let the agent choose whom to contact. Only the contact actually selected becomes part of the conversation."
    ]
  },
  {
    "id": "terceiros",
    "title": "Third-party services",
    "paragraphs": [
      "The app uses two third-party services, limited to the following purposes.",
      "Google Firebase Cloud Messaging (FCM) delivers new-message notifications to the device. It stores a device identifier called a push token. This token identifies the app installation, not the person, and is used exclusively to route notifications to the correct device.",
      "Sentry receives automatic app error and crash reports, which the technical team uses to diagnose and fix problems.",
      "Conversation content is not sent to these services. Both may process data outside Brazil; international transfers then take place under article 33 of the LGPD, supported by the contractual clauses and data protection safeguards offered by these providers."
    ]
  },
  {
    "id": "diagnostico",
    "title": "Diagnostics and crash data",
    "paragraphs": [
      "When the app fails, it automatically generates a technical report with details such as the device model, operating system version, app version and error trace (the sequence of instructions that led to the failure).",
      "The report has one purpose: to let the technical team reproduce and fix the problem. It is not used to identify people, create usage profiles or serve advertising."
    ]
  },
  {
    "id": "retencao",
    "title": "How long data is kept",
    "paragraphs": [
      "Conversations and customer service data: the client company, as controller, sets the retention period and keeps the data on its own server. SPX does not set that period.",
      "Agent account: kept while the agent remains associated with the client company and the software contract remains in effect.",
      "Notification token: valid while the app remains installed and authenticated. It is discarded when the app is uninstalled, the account is signed out or the notification service invalidates it.",
      "Crash reports: kept for a limited period, only while useful for investigating the technical problem."
    ]
  },
  {
    "id": "direitos",
    "title": "Your rights and how to exercise them",
    "paragraphs": [
      "The LGPD gives you the right, free of charge, to confirm whether your data is processed, access it, correct incomplete or outdated information, request anonymization, blocking or deletion of unnecessary or unlawfully processed data, request portability to another provider, withdraw consent at any time and object to processing based on legitimate interest.",
      "If you are an end customer served by a company using Chat SPX, direct your request to that company, which controls the customer service data. If SPX receives the request, we will forward it to that company.",
      "If you are a support agent who wants to delete your account, ask your company administrator: they created the account, rather than you registering in the app. You can also email sup@simplexsolucoes.com.br and we will contact the responsible company.",
      "To revoke app permissions (contacts, microphone, camera, media or notifications), use your device settings at any time without contacting us.",
      "We may ask for additional information to verify your identity before fulfilling a request, as a security measure. We respond within 15 calendar days of receiving a complete request. You may also file a complaint directly with Brazil’s National Data Protection Authority (ANPD)."
    ]
  },
  {
    "id": "seguranca",
    "title": "Security",
    "paragraphs": [
      "All communication between the app and the client company’s server is encrypted in transit using HTTPS/TLS. App access requires authentication; each agent’s permissions are defined by the company administrator.",
      "Because conversations are stored on the client company’s server, that company is responsible for infrastructure security, backups, access controls and retention. No system is completely immune to incidents; if a security incident poses a relevant risk, the controller will make the notifications required by article 48 of the LGPD, with our technical support."
    ]
  },
  {
    "id": "criancas",
    "title": "Children and teenagers",
    "paragraphs": [
      "Chat SPX is a professional work tool supplied to companies and used by their support agents. It is not directed at people under 18, and we do not intentionally collect children’s or teenagers’ data for this purpose."
    ]
  },
  {
    "id": "alteracoes",
    "title": "Changes to this policy",
    "paragraphs": [
      "This policy may be updated to reflect changes to the app, third-party services or applicable legislation. The current version is always published on this page with its update date at the top. Significant changes will be communicated to client companies."
    ]
  },
  {
    "id": "contato",
    "title": "Contact",
    "paragraphs": [
      "SPX Inteligência e Desenvolvimento LTDA · CNPJ 68.387.997/0001-18 · Avenida das Figueiras, 1646, Sala 8B, Setor Comercial; Sinop/MT, CEP 78550-150, Brazil.",
      "Privacy contact: sup@simplexsolucoes.com.br. The conditions for using the app are described in the Terms of use."
    ]
  }
]

export default function PoliticaDePrivacidadeChatSPX() {
  return (
    <LegalShell
      title="Política de privacidade"
      titleEn="Privacy policy"
      intro="Como o Chat SPX trata dados pessoais e como exercer seus direitos."
      introEn="How Chat SPX handles personal data and how to exercise your rights."
      updatedAt="10 de agosto de 2026"
      updatedAtEn="August 10, 2026"
      toc={toc}
      childrenEn={<>
        {englishSections.map((section, index) => (
          <LegalSection key={section.id} id={section.id} number={String(index + 1).padStart(2, "0")} title={section.title}>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.id === "contato" && <p><a href="mailto:sup@simplexsolucoes.com.br" className="text-primary hover:underline">sup@simplexsolucoes.com.br</a></p>}
          </LegalSection>
        ))}
        <p><Link href="/termos" className="text-primary hover:underline">Terms of use</Link></p>
      </>}
    >
      <LegalSection id="controlador-operador" number="01" title="Quem controla e quem opera os dados">
        <p>
          O <LegalTerm>Chat SPX</LegalTerm> é um aplicativo móvel de atendimento ao cliente,
          disponível para Android e iOS, desenvolvido pela{' '}
          <LegalTerm>SPX Inteligência e Desenvolvimento LTDA</LegalTerm>, CNPJ 68.387.997/0001-18,
          com sede na Avenida das Figueiras, 1646, Sala 8B, Setor Comercial, Sinop / MT, CEP
          78550-150.
        </p>
        <p>
          O aplicativo não é destinado ao consumidor final: ele é usado por{' '}
          <LegalTerm>agentes de suporte</LegalTerm> das empresas que contratam o software. Entender
          essa arquitetura é essencial para entender quem responde pelos dados:
        </p>
        <LegalList>
          <LegalItem>
            <LegalTerm>Cada empresa cliente tem o seu próprio servidor.</LegalTerm> As conversas, os
            contatos e os dados dos clientes finais atendidos ficam armazenados no servidor da
            empresa contratante; não em servidores da SPX.
          </LegalItem>
          <LegalItem>
            <LegalTerm>A empresa contratante é a controladora</LegalTerm> desses dados: é ela quem
            decide o que é coletado, com que finalidade, por quanto tempo é guardado e quem tem
            acesso.
          </LegalItem>
          <LegalItem>
            <LegalTerm>A SPX é a operadora</LegalTerm>: fornece e mantém o software, atuando conforme
            as instruções da empresa contratante e nos limites do contrato firmado com ela.
          </LegalItem>
        </LegalList>
        <p>
          Na prática, isso significa que a SPX não acessa o conteúdo das conversas para finalidades
          próprias. Se você é um cliente final atendido por uma empresa que usa o Chat SPX e quer
          saber o que é feito com os seus dados, o pedido deve ser dirigido a essa empresa, que é a
          controladora. Se você é agente de suporte e tem dúvidas sobre o aplicativo em si, use o
          canal indicado no item 11.
        </p>
      </LegalSection>

      <LegalSection id="dados-tratados" number="02" title="Quais dados são tratados">
        <p>Os dados envolvidos no uso do aplicativo se dividem em três grupos:</p>

        <p className="pt-2 font-medium text-foreground">Dados da conta do agente</p>
        <LegalList>
          <LegalItem>
            Nome, e-mail ou usuário de acesso, perfil de permissão e vínculo com a empresa
            contratante. Esses dados ficam no servidor da empresa e são usados para autenticar o
            agente e registrar quem atendeu cada conversa.
          </LegalItem>
          <LegalItem>
            <LegalTerm>O agente não cria conta pelo aplicativo.</LegalTerm> O cadastro é feito pelo
            administrador da empresa em que ele trabalha. Não há tela de autocadastro no Chat SPX.
          </LegalItem>
        </LegalList>

        <p className="pt-2 font-medium text-foreground">Conteúdo do atendimento</p>
        <LegalList>
          <LegalItem>
            Mensagens de texto, áudios, fotos, arquivos e dados de contato trocados entre o agente e
            o cliente final, além dos registros de quando cada mensagem foi enviada, recebida e lida.
          </LegalItem>
          <LegalItem>
            Esse conteúdo trafega entre o aplicativo e o servidor da empresa contratante, onde fica
            armazenado. A SPX não mantém cópia desse conteúdo em infraestrutura própria.
          </LegalItem>
        </LegalList>

        <p className="pt-2 font-medium text-foreground">Dados técnicos do aparelho</p>
        <LegalList>
          <LegalItem>
            Identificador de notificação (token de push) e informações de diagnóstico em caso de
            falha do aplicativo, descritas em detalhe nos itens 04 e 05.
          </LegalItem>
        </LegalList>
      </LegalSection>

      <LegalSection id="aplicativo-movel" number="03" title="O aplicativo móvel e suas permissões">
        <p>
          O Chat SPX pede apenas as permissões necessárias para o atendimento funcionar. Nenhuma
          delas é usada em segundo plano para coletar dados sem relação com a conversa. Cada
          permissão é solicitada no momento em que o recurso é utilizado, e você pode recusá-la ou
          revogá-la depois nas configurações do sistema; nesse caso, apenas o recurso
          correspondente deixa de funcionar.
        </p>
        <LegalList>
          <LegalItem>
            <LegalTerm>Contatos (leitura e gravação)</LegalTerm>; a leitura permite iniciar uma
            conversa escolhendo alguém direto da agenda do aparelho, sem digitar o número. A gravação
            permite salvar na agenda um contato que chegou dentro de uma mensagem.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Microfone</LegalTerm>; gravar mensagens de voz para enviar na conversa.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Câmera</LegalTerm>; tirar uma foto na hora para enviar ao cliente e ler
            códigos QR.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Fotos e mídia</LegalTerm>; anexar arquivos e imagens já existentes no
            aparelho às conversas e salvar na galeria a mídia recebida.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Notificações</LegalTerm>; avisar o agente sobre novas mensagens.
          </LegalItem>
        </LegalList>
        <p>
          <LegalTerm>Sobre a agenda do aparelho, de forma explícita:</LegalTerm> a lista de contatos
          não é enviada para nenhum servidor nem armazenada em massa. Ela é lida no próprio aparelho,
          apenas para exibir a lista na tela e permitir que o agente escolha com quem quer falar.
          Somente o contato efetivamente escolhido entra na conversa.
        </p>
      </LegalSection>

      <LegalSection id="terceiros" number="04" title="Serviços de terceiros">
        <p>
          O aplicativo utiliza dois serviços de terceiros, ambos limitados às finalidades abaixo:
        </p>
        <LegalList>
          <LegalItem>
            <LegalTerm>Google Firebase Cloud Messaging (FCM)</LegalTerm>; responsável por entregar
            as notificações de novas mensagens ao aparelho. Para isso, armazena um identificador do
            aparelho, chamado token de push. Esse token identifica a instalação do aplicativo, não a
            pessoa, e é usado exclusivamente para rotear a notificação até o dispositivo correto.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Sentry</LegalTerm>; recebe relatórios automáticos de erro e falha do
            aplicativo, usados pela equipe técnica para diagnosticar e corrigir problemas.
          </LegalItem>
        </LegalList>
        <p>
          O conteúdo das conversas não é enviado a esses serviços. Ambos podem processar dados fora
          do Brasil; nesse caso, a transferência internacional ocorre nos termos do artigo 33 da
          LGPD, amparada nas cláusulas contratuais e nas garantias de proteção oferecidas por esses
          fornecedores.
        </p>
      </LegalSection>

      <LegalSection id="diagnostico" number="05" title="Dados de diagnóstico e falhas">
        <p>
          Quando o aplicativo apresenta uma falha, é gerado automaticamente um relatório técnico com
          informações como <LegalTerm>modelo do aparelho</LegalTerm>,{' '}
          <LegalTerm>versão do sistema operacional</LegalTerm>,{' '}
          <LegalTerm>versão do aplicativo</LegalTerm> e o{' '}
          <LegalTerm>rastro do erro</LegalTerm> (a sequência de instruções que levou à falha).
        </p>
        <p>
          Esse relatório tem uma única finalidade: permitir que a equipe técnica reproduza e corrija
          o problema. Ele não é usado para identificar pessoas, criar perfis de uso ou qualquer
          finalidade publicitária.
        </p>
      </LegalSection>

      <LegalSection id="retencao" number="06" title="Por quanto tempo os dados ficam guardados">
        <LegalList>
          <LegalItem>
            <LegalTerm>Conversas e dados de atendimento:</LegalTerm> o prazo é definido pela empresa
            contratante, que é a controladora e mantém esses dados no próprio servidor. A SPX não
            determina esse prazo.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Conta do agente:</LegalTerm> mantida enquanto durar o vínculo do agente com a
            empresa contratante e enquanto o contrato de uso do software estiver vigente.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Token de notificação:</LegalTerm> válido enquanto o aplicativo permanecer
            instalado e autenticado. É descartado na desinstalação, na saída da conta ou quando o
            próprio serviço de notificação o invalida.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Relatórios de falha:</LegalTerm> mantidos por período limitado, apenas
            enquanto forem úteis à investigação técnica do problema.
          </LegalItem>
        </LegalList>
      </LegalSection>

      <LegalSection id="direitos" number="07" title="Seus direitos e como exercê-los">
        <p>
          A LGPD garante a você, gratuitamente, o direito de confirmar a existência de tratamento,{' '}
          <LegalTerm>acessar</LegalTerm> seus dados, <LegalTerm>corrigir</LegalTerm> informações
          incompletas ou desatualizadas, solicitar{' '}
          <LegalTerm>anonimização, bloqueio ou exclusão</LegalTerm> de dados desnecessários ou
          tratados fora da lei, pedir a <LegalTerm>portabilidade</LegalTerm> a outro fornecedor,{' '}
          <LegalTerm>revogar o consentimento</LegalTerm> a qualquer momento e{' '}
          <LegalTerm>se opor</LegalTerm> a tratamentos feitos com base em legítimo interesse.
        </p>
        <p className="pt-2 font-medium text-foreground">Como pedir, na prática</p>
        <LegalList>
          <LegalItem>
            <LegalTerm>Se você é cliente final</LegalTerm> atendido por uma empresa que usa o Chat
            SPX: dirija o pedido a essa empresa, que é a controladora dos dados do atendimento. Se o
            pedido chegar à SPX, nós o encaminharemos a ela.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Se você é agente de suporte e quer excluir sua conta:</LegalTerm> como a conta
            foi criada pelo administrador da empresa em que você trabalha, e não por você no
            aplicativo, a exclusão deve ser solicitada a esse administrador. Você também pode
            escrever para{' '}
            <a
              href={`mailto:${EMAIL}`}
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              {EMAIL}
            </a>{' '}
            e nós acionaremos a empresa responsável.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Para revogar permissões do aplicativo</LegalTerm> (contatos, microfone,
            câmera, mídia, notificações): use as configurações do próprio aparelho, a qualquer
            momento, sem precisar falar conosco.
          </LegalItem>
        </LegalList>
        <p>
          Podemos pedir informações adicionais para confirmar a sua identidade antes de atender à
          solicitação, como medida de segurança. Respondemos em até 15 dias corridos contados do
          recebimento do pedido completo. Você também pode apresentar reclamação diretamente à
          Autoridade Nacional de Proteção de Dados (ANPD).
        </p>
      </LegalSection>

      <LegalSection id="seguranca" number="08" title="Segurança">
        <p>
          Toda a comunicação entre o aplicativo e o servidor da empresa contratante é{' '}
          <LegalTerm>criptografada em trânsito</LegalTerm>, por meio de HTTPS/TLS. O acesso ao
          aplicativo depende de autenticação, e o perfil de permissão de cada agente é definido pelo
          administrador da empresa.
        </p>
        <p>
          Como as conversas ficam no servidor da empresa contratante, as medidas de segurança desse
          ambiente; cópias de segurança, controle de acesso à infraestrutura e retenção; são
          responsabilidade dela. Nenhum sistema é totalmente imune a incidentes; havendo incidente de
          segurança com risco relevante, as comunicações previstas no artigo 48 da LGPD serão feitas
          pelo controlador, com o nosso apoio técnico.
        </p>
      </LegalSection>

      <LegalSection id="criancas" number="09" title="Dados de crianças e adolescentes">
        <p>
          O Chat SPX é uma ferramenta profissional de trabalho, fornecida a empresas e utilizada por
          seus agentes de suporte. Não é direcionado a menores de 18 anos e não coletamos
          intencionalmente dados de crianças ou adolescentes para essa finalidade.
        </p>
      </LegalSection>

      <LegalSection id="alteracoes" number="10" title="Alterações desta política">
        <p>
          Esta política pode ser atualizada para refletir mudanças no aplicativo, nos serviços de
          terceiros utilizados ou na legislação aplicável. A versão vigente é sempre a publicada
          nesta página, com a data de atualização indicada no topo. Alterações relevantes serão
          comunicadas às empresas contratantes.
        </p>
      </LegalSection>

      <LegalSection id="contato" number="11" title="Contato">
        <p>
          <LegalTerm>SPX Inteligência e Desenvolvimento LTDA</LegalTerm>
          <br />
          CNPJ 68.387.997/0001-18
          <br />
          Avenida das Figueiras, 1646, Sala 8B, Setor Comercial; Sinop/MT, CEP 78550-150
          <br />
          <LegalTerm>E-mail para assuntos de privacidade:</LegalTerm>{' '}
          <a
            href={`mailto:${EMAIL}`}
            className="text-primary underline-offset-4 transition-colors hover:underline"
          >
            {EMAIL}
          </a>
        </p>
        <p>
          As condições de uso do aplicativo estão descritas nos{' '}
          <Link
            href="/termos"
            className="text-primary underline-offset-4 transition-colors hover:underline"
          >
            Termos de Uso
          </Link>
          .
        </p>
      </LegalSection>
    </LegalShell>
  )
}
