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
  title: { absolute: 'Termos de uso | SPXia' },
  description:
    'Condições de uso do aplicativo Chat SPX: licença vinculada ao contrato com a empresa contratante, usos permitidos e proibidos, responsabilidades, disponibilidade e foro.',
  alternates: { canonical: '/termos' },
}

const EMAIL = 'sup@simplexsolucoes.com.br'

const toc: TocEntry[] = [
  { id: 'objeto', number: '01', title: 'Objeto e licença de uso', titleEn: "Purpose and software license" },
  { id: 'acesso', number: '02', title: 'Como o acesso é concedido', titleEn: "How access is granted" },
  { id: 'uso-permitido', number: '03', title: 'Uso permitido', titleEn: "Permitted use" },
  { id: 'uso-proibido', number: '04', title: 'Uso proibido', titleEn: "Prohibited use" },
  { id: 'conteudo', number: '05', title: 'Responsabilidade sobre o conteúdo das conversas', titleEn: "Responsibility for conversation content" },
  { id: 'disponibilidade', number: '06', title: 'Disponibilidade do serviço', titleEn: "Service availability" },
  { id: 'limitacao', number: '07', title: 'Limitação de responsabilidade', titleEn: "Limitation of liability" },
  { id: 'vigencia', number: '08', title: 'Vigência e encerramento do acesso', titleEn: "Duration and termination of access" },
  { id: 'privacidade', number: '09', title: 'Proteção de dados', titleEn: "Data protection" },
  { id: 'alteracoes', number: '10', title: 'Alterações destes termos', titleEn: "Changes to these terms" },
  { id: 'lei-foro', number: '11', title: 'Lei aplicável e foro', titleEn: "Applicable law and jurisdiction" },
  { id: 'contato', number: '12', title: 'Contato', titleEn: "Contact" },
]

const englishSections = [
  {
    "id": "objeto",
    "title": "Purpose and software license",
    "paragraphs": [
      "Chat SPX is a mobile customer service app for Android and iOS, developed and licensed by SPX Inteligência e Desenvolvimento LTDA, CNPJ 68.387.997/0001-18, based at Avenida das Figueiras, 1646, Sala 8B, Setor Comercial, Sinop / MT, CEP 78550-150, Brazil.",
      "SPX grants a non-exclusive, non-transferable and revocable license, limited to the duration and conditions of the contract between SPX and the client company. Its sole purpose is to allow that company’s authorized support agents to serve customers.",
      "The license does not transfer ownership of the software. Chat SPX code, brand, design and documentation remain SPX property. When the client company’s contract ends, its agents’ right to use the app also ends."
    ]
  },
  {
    "id": "acesso",
    "title": "How access is granted",
    "paragraphs": [
      "SPX does not create agent accounts or distribute individual access. The client company’s administrator creates, changes and closes each agent account in the company’s own environment. There is no self-registration in the app.",
      "Requests for new access, permission changes, password resets or account closure must go to your company administrator. Agents are responsible for keeping their credentials confidential and immediately informing the administrator of any suspected misuse.",
      "Each client company operates Chat SPX on its own server, where customer conversations and data are stored."
    ]
  },
  {
    "id": "uso-permitido",
    "title": "Permitted use",
    "paragraphs": [
      "The app may be used exclusively to serve, respond to and follow up with the client company’s customers in the role of support agent; send and receive messages, audio, images and files related to those conversations; and record and consult conversation history within the permissions assigned by the company administrator."
    ]
  },
  {
    "id": "uso-proibido",
    "title": "Prohibited use",
    "paragraphs": [
      "Users must not, directly or indirectly, send spam or unsolicited bulk messages, including marketing without the recipient’s authorization.",
      "Users must not transmit unlawful content or content infringing third-party rights, including discriminatory, defamatory, fraudulent or obscene material, copyright infringement or criminal content.",
      "Users must not reverse engineer, decompile, disassemble, modify, translate or attempt to obtain the app’s source code, except where expressly permitted by law.",
      "Users must not resell, sublicense, rent, assign or make all or part of the app available to third parties under any arrangement.",
      "Users must not share login credentials, use another agent’s account or allow unauthorized people to use the app.",
      "Users must not attempt to bypass security, authentication or permission controls, overload infrastructure or interfere with the service.",
      "The app must not be used for purposes other than serving the client company’s customers. Breaches may lead to immediate suspension of access, without prejudice to applicable contractual and legal measures."
    ]
  },
  {
    "id": "conteudo",
    "title": "Responsibility for conversation content",
    "paragraphs": [
      "The client company and agents acting on its behalf are solely responsible for conversation content. This includes statements made during service, files exchanged, how customers are approached and compliance with legal obligations applicable to the company’s business, including data protection and consumer protection.",
      "SPX supplies the software and does not moderate, review or control content in advance. Because conversations are stored on the client company’s own server, that company is also responsible for storage, retention and eventual deletion."
    ]
  },
  {
    "id": "disponibilidade",
    "title": "Service availability",
    "paragraphs": [
      "SPX makes reasonable efforts to keep the app stable but does not guarantee uninterrupted or error-free operation. The service may be wholly or partly unavailable because of scheduled or emergency maintenance; failures in the client company’s server or network or the device’s connection; unavailability of third-party dependencies such as notifications; operating system or app store updates; or events beyond reasonable control and force majeure.",
      "SPX may update the app, change functionality or discontinue features, while seeking to preserve the essential functions contracted by the company."
    ]
  },
  {
    "id": "limitacao",
    "title": "Limitation of liability",
    "paragraphs": [
      "To the extent permitted by Brazilian law, SPX is not liable for indirect damage, lost profits, lost business opportunities, loss of data stored on third-party infrastructure or losses arising from the situations below.",
      "These situations include use contrary to these terms or technical instructions; unavailability, misconfiguration or failure of the server maintained by the client company; content sent or received during customer service, which is the client company’s responsibility; and unauthorized access resulting from shared or poorly protected credentials.",
      "Any liability of SPX to the client company is subject to the limits established in the contract between the parties."
    ]
  },
  {
    "id": "vigencia",
    "title": "Duration and termination of access",
    "paragraphs": [
      "These terms remain in effect while the user has app access. The client company’s administrator may end access at any time, for example when an agent leaves or changes roles.",
      "Access also ends when the contract between SPX and the client company ends, closing all associated accounts. SPX may end access if these terms are breached or service security is at risk.",
      "After access ends, users must stop using and uninstall the app. Conversation data remains on the client company’s server under its management."
    ]
  },
  {
    "id": "privacidade",
    "title": "Data protection",
    "paragraphs": [
      "The Privacy policy, which forms part of these terms, describes personal data processing related to the app, including device permissions, third-party services and data subject rights.",
      "For the purposes of Law 13.709/2018 (LGPD), the client company is the controller of data processed during customer service, and SPX is the processor, following the company’s instructions and the limits of the contract."
    ]
  },
  {
    "id": "alteracoes",
    "title": "Changes to these terms",
    "paragraphs": [
      "These terms may be updated to reflect changes to the app or applicable law. The current version is always published on this page, with the update date at the top. Significant changes will be communicated to client companies, and continued app use after publication represents agreement with the new version."
    ]
  },
  {
    "id": "lei-foro",
    "title": "Applicable law and jurisdiction",
    "paragraphs": [
      "These terms are governed by Brazilian law. Courts in Sinop, State of Mato Grosso, are chosen to settle disputes arising from these terms, with waiver of any other jurisdiction, however privileged, except where the law guarantees a different forum."
    ]
  },
  {
    "id": "contato",
    "title": "Contact",
    "paragraphs": [
      "SPX Inteligência e Desenvolvimento LTDA · CNPJ 68.387.997/0001-18 · Avenida das Figueiras, 1646, Sala 8B, Setor Comercial; Sinop/MT, CEP 78550-150, Brazil.",
      "Email: sup@simplexsolucoes.com.br."
    ]
  }
]

export default function TermosDeUsoChatSPX() {
  return (
    <LegalShell
      title="Termos de uso"
      titleEn="Terms of use"
      intro="Condições de uso do Chat SPX pelos agentes das empresas contratantes."
      introEn="Conditions for using Chat SPX as an agent of a client company."
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
        <p><Link href="/privacidade" className="text-primary hover:underline">Privacy policy</Link></p>
      </>}
    >
      <LegalSection id="objeto" number="01" title="Objeto e licença de uso">
        <p>
          O <LegalTerm>Chat SPX</LegalTerm> é um aplicativo móvel de atendimento ao cliente, para
          Android e iOS, desenvolvido e licenciado pela{' '}
          <LegalTerm>SPX Inteligência e Desenvolvimento LTDA</LegalTerm>, CNPJ 68.387.997/0001-18,
          com sede na Avenida das Figueiras, 1646, Sala 8B, Setor Comercial, Sinop / MT, CEP
          78550-150.
        </p>
        <p>
          A SPX concede uma licença de uso <LegalTerm>não exclusiva, intransferível e revogável</LegalTerm>,
          limitada ao prazo e às condições do <LegalTerm>contrato firmado entre a SPX e a empresa
          contratante</LegalTerm>. A licença existe para permitir que os agentes autorizados dessa
          empresa realizem atendimentos; e apenas isso.
        </p>
        <p>
          A licença não transfere a propriedade do software. O código, a marca, o design e a
          documentação do Chat SPX continuam sendo da SPX. Encerrado o contrato com a empresa
          contratante, encerra-se também o direito de uso do aplicativo pelos seus agentes.
        </p>
      </LegalSection>

      <LegalSection id="acesso" number="02" title="Como o acesso é concedido">
        <p>
          <LegalTerm>A SPX não cria contas para agentes e não distribui acessos individuais.</LegalTerm>{' '}
          Quem cria, altera e encerra a conta de cada agente é o administrador da empresa
          contratante, dentro do ambiente dela. Não existe autocadastro no aplicativo.
        </p>
        <p>
          Como consequência: pedidos de novo acesso, mudança de permissão, redefinição de senha ou
          encerramento de conta devem ser dirigidos ao administrador da sua empresa. O agente é
          responsável por manter suas credenciais em sigilo e por comunicar imediatamente ao
          administrador qualquer suspeita de uso indevido.
        </p>
        <p>
          Cada empresa contratante opera o Chat SPX em <LegalTerm>seu próprio servidor</LegalTerm>,
          onde ficam as conversas e os dados dos clientes atendidos.
        </p>
      </LegalSection>

      <LegalSection id="uso-permitido" number="03" title="Uso permitido">
        <p>O aplicativo deve ser usado exclusivamente para:</p>
        <LegalList>
          <LegalItem>
            Atender, responder e acompanhar clientes da empresa contratante, no exercício da função
            de agente de suporte.
          </LegalItem>
          <LegalItem>
            Enviar e receber mensagens, áudios, imagens e arquivos relacionados a esses atendimentos.
          </LegalItem>
          <LegalItem>
            Registrar e consultar o histórico de conversas conforme as permissões atribuídas pelo
            administrador da empresa.
          </LegalItem>
        </LegalList>
      </LegalSection>

      <LegalSection id="uso-proibido" number="04" title="Uso proibido">
        <p>É vedado ao usuário, direta ou indiretamente:</p>
        <LegalList>
          <LegalItem>
            <LegalTerm>Enviar spam</LegalTerm> ou disparar mensagens em massa não solicitadas,
            inclusive comunicações de marketing sem autorização do destinatário.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Transmitir conteúdo ilícito</LegalTerm> ou que viole direitos de terceiros;
            incluindo material discriminatório, difamatório, fraudulento, obsceno, que infrinja
            direitos autorais ou que configure crime.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Fazer engenharia reversa</LegalTerm>, descompilar, desmontar, modificar,
            traduzir ou tentar obter o código-fonte do aplicativo, salvo nas hipóteses expressamente
            autorizadas por lei.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Revender, sublicenciar, alugar, ceder ou disponibilizar</LegalTerm> o
            aplicativo a terceiros, no todo ou em parte, a qualquer título.
          </LegalItem>
          <LegalItem>
            Compartilhar credenciais de acesso, usar a conta de outro agente ou permitir que pessoas
            não autorizadas utilizem o aplicativo.
          </LegalItem>
          <LegalItem>
            Tentar burlar mecanismos de segurança, autenticação ou controle de permissões, sobrecarregar
            a infraestrutura ou interferir no funcionamento do serviço.
          </LegalItem>
          <LegalItem>
            Utilizar o aplicativo para finalidade diversa do atendimento ao cliente da empresa
            contratante.
          </LegalItem>
        </LegalList>
        <p>
          O descumprimento pode levar à suspensão imediata do acesso, sem prejuízo das medidas
          contratuais e legais cabíveis.
        </p>
      </LegalSection>

      <LegalSection id="conteudo" number="05" title="Responsabilidade sobre o conteúdo das conversas">
        <p>
          <LegalTerm>O conteúdo das conversas é de responsabilidade exclusiva da empresa
          contratante</LegalTerm> e dos agentes que atuam em seu nome. Isso inclui o que é dito nos
          atendimentos, os arquivos trocados, a forma de abordagem dos clientes e o cumprimento das
          obrigações legais aplicáveis à atividade dela; inclusive as regras de proteção de dados e
          de defesa do consumidor.
        </p>
        <p>
          A SPX fornece o software e não modera, revisa nem controla previamente o conteúdo trafegado.
          Como as conversas ficam armazenadas no servidor da própria empresa contratante, a guarda,
          a retenção e o eventual descarte desse conteúdo também são responsabilidade dela.
        </p>
      </LegalSection>

      <LegalSection id="disponibilidade" number="06" title="Disponibilidade do serviço">
        <p>
          A SPX empenha esforços razoáveis para manter o aplicativo funcionando de forma estável, mas{' '}
          <LegalTerm>não garante operação ininterrupta ou livre de erros</LegalTerm>. O serviço pode
          ficar indisponível, total ou parcialmente, em razão de:
        </p>
        <LegalList>
          <LegalItem>manutenções programadas ou emergenciais;</LegalItem>
          <LegalItem>
            falhas no servidor da empresa contratante, na rede dela ou na conexão do aparelho;
          </LegalItem>
          <LegalItem>
            indisponibilidade de serviços de terceiros dos quais o aplicativo depende, como o serviço
            de notificações;
          </LegalItem>
          <LegalItem>
            atualizações do sistema operacional do aparelho, das lojas de aplicativos ou casos
            fortuitos e de força maior.
          </LegalItem>
        </LegalList>
        <p>
          A SPX pode atualizar o aplicativo, alterar funcionalidades ou descontinuar recursos, sempre
          buscando preservar as funções essenciais contratadas pela empresa.
        </p>
      </LegalSection>

      <LegalSection id="limitacao" number="07" title="Limitação de responsabilidade">
        <p>
          Nos limites permitidos pela legislação brasileira, a SPX não responde por danos indiretos,
          lucros cessantes, perda de oportunidade de negócio, perda de dados armazenados em
          infraestrutura de terceiros ou prejuízos decorrentes de:
        </p>
        <LegalList>
          <LegalItem>
            uso do aplicativo em desacordo com estes termos ou com as orientações técnicas fornecidas;
          </LegalItem>
          <LegalItem>
            indisponibilidade, configuração inadequada ou falha do servidor mantido pela empresa
            contratante;
          </LegalItem>
          <LegalItem>
            conteúdo enviado ou recebido nos atendimentos, cuja responsabilidade é da empresa
            contratante;
          </LegalItem>
          <LegalItem>
            acesso não autorizado decorrente de compartilhamento ou má guarda de credenciais.
          </LegalItem>
        </LegalList>
        <p>
          Eventual responsabilidade da SPX perante a empresa contratante observará os limites
          estabelecidos no contrato firmado entre as partes.
        </p>
      </LegalSection>

      <LegalSection id="vigencia" number="08" title="Vigência e encerramento do acesso">
        <p>
          Estes termos vigoram enquanto durar o acesso do usuário ao aplicativo. O acesso pode ser
          encerrado:
        </p>
        <LegalList>
          <LegalItem>
            <LegalTerm>pelo administrador da empresa contratante</LegalTerm>, a qualquer momento;
            por exemplo, no desligamento do agente ou na mudança de função;
          </LegalItem>
          <LegalItem>
            <LegalTerm>com o término do contrato</LegalTerm> entre a SPX e a empresa contratante,
            hipótese em que todos os acessos vinculados são encerrados;
          </LegalItem>
          <LegalItem>
            <LegalTerm>pela SPX</LegalTerm>, em caso de violação destes termos ou de risco à
            segurança do serviço.
          </LegalItem>
        </LegalList>
        <p>
          Encerrado o acesso, o usuário deve interromper o uso e desinstalar o aplicativo. Os dados
          das conversas permanecem no servidor da empresa contratante, sob a gestão dela.
        </p>
      </LegalSection>

      <LegalSection id="privacidade" number="09" title="Proteção de dados">
        <p>
          O tratamento de dados pessoais relacionado ao aplicativo; incluindo as permissões
          solicitadas no aparelho, os serviços de terceiros utilizados e os direitos do titular; está
          descrito na{' '}
          <Link
            href="/privacidade"
            className="text-primary underline-offset-4 transition-colors hover:underline"
          >
            Política de Privacidade
          </Link>
          , que integra estes termos.
        </p>
        <p>
          Para fins da Lei nº 13.709/2018 (LGPD), a empresa contratante é a{' '}
          <LegalTerm>controladora</LegalTerm> dos dados tratados no atendimento e a SPX atua como{' '}
          <LegalTerm>operadora</LegalTerm>, seguindo as instruções dela e os limites do contrato.
        </p>
      </LegalSection>

      <LegalSection id="alteracoes" number="10" title="Alterações destes termos">
        <p>
          Estes termos podem ser atualizados para refletir mudanças no aplicativo ou na legislação
          aplicável. A versão vigente é sempre a publicada nesta página, com a data de atualização
          indicada no topo. Alterações relevantes serão comunicadas às empresas contratantes, e o uso
          continuado do aplicativo após a publicação representa concordância com a nova versão.
        </p>
      </LegalSection>

      <LegalSection id="lei-foro" number="11" title="Lei aplicável e foro">
        <p>
          Estes termos são regidos pela <LegalTerm>legislação brasileira</LegalTerm>. Fica eleito o
          foro da <LegalTerm>comarca de Sinop, Estado de Mato Grosso</LegalTerm>, para dirimir
          controvérsias decorrentes destes termos, com renúncia a qualquer outro, por mais
          privilegiado que seja; ressalvadas as hipóteses em que a lei assegure foro diverso.
        </p>
      </LegalSection>

      <LegalSection id="contato" number="12" title="Contato">
        <p>
          <LegalTerm>SPX Inteligência e Desenvolvimento LTDA</LegalTerm>
          <br />
          CNPJ 68.387.997/0001-18
          <br />
          Avenida das Figueiras, 1646, Sala 8B, Setor Comercial; Sinop/MT, CEP 78550-150
          <br />
          <LegalTerm>E-mail:</LegalTerm>{' '}
          <a
            href={`mailto:${EMAIL}`}
            className="text-primary underline-offset-4 transition-colors hover:underline"
          >
            {EMAIL}
          </a>
        </p>
      </LegalSection>
    </LegalShell>
  )
}
