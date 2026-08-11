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
  title: { absolute: 'Termos de Uso — Chat SPX | SPXIA' },
  description:
    'Condições de uso do aplicativo Chat SPX: licença vinculada ao contrato com a empresa contratante, usos permitidos e proibidos, responsabilidades, disponibilidade e foro.',
  alternates: { canonical: '/termos' },
}

const EMAIL = 'sup@simplexsolucoes.com.br'

const toc: TocEntry[] = [
  { id: 'objeto', number: '01', title: 'Objeto e licença de uso' },
  { id: 'acesso', number: '02', title: 'Como o acesso é concedido' },
  { id: 'uso-permitido', number: '03', title: 'Uso permitido' },
  { id: 'uso-proibido', number: '04', title: 'Uso proibido' },
  { id: 'conteudo', number: '05', title: 'Responsabilidade sobre o conteúdo das conversas' },
  { id: 'disponibilidade', number: '06', title: 'Disponibilidade do serviço' },
  { id: 'limitacao', number: '07', title: 'Limitação de responsabilidade' },
  { id: 'vigencia', number: '08', title: 'Vigência e encerramento do acesso' },
  { id: 'privacidade', number: '09', title: 'Proteção de dados' },
  { id: 'alteracoes', number: '10', title: 'Alterações destes termos' },
  { id: 'lei-foro', number: '11', title: 'Lei aplicável e foro' },
  { id: 'contato', number: '12', title: 'Contato' },
]

export default function TermosDeUsoChatSPX() {
  return (
    <LegalShell
      title="Termos de Uso — Chat SPX"
      intro="Estas são as condições que regem o uso do aplicativo Chat SPX pelos agentes de suporte das empresas contratantes. Ao acessar o aplicativo, você concorda com os termos abaixo."
      updatedAt="10 de agosto de 2026"
      toc={toc}
    >
      <LegalSection id="objeto" number="01" title="Objeto e licença de uso">
        <p>
          O <LegalTerm>Chat SPX</LegalTerm> é um aplicativo móvel de atendimento ao cliente, para
          Android e iOS, desenvolvido e licenciado pela{' '}
          <LegalTerm>SPX Inteligência e Desenvolvimento LTDA</LegalTerm>, CNPJ 68.387.997/0001-18,
          com sede na Avenida das Figueiras, 1646, Sala 8B, Setor Comercial, Sinop – MT, CEP
          78550-150.
        </p>
        <p>
          A SPX concede uma licença de uso <LegalTerm>não exclusiva, intransferível e revogável</LegalTerm>,
          limitada ao prazo e às condições do <LegalTerm>contrato firmado entre a SPX e a empresa
          contratante</LegalTerm>. A licença existe para permitir que os agentes autorizados dessa
          empresa realizem atendimentos — e apenas isso.
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
            <LegalTerm>Transmitir conteúdo ilícito</LegalTerm> ou que viole direitos de terceiros —
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
          obrigações legais aplicáveis à atividade dela — inclusive as regras de proteção de dados e
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
            <LegalTerm>pelo administrador da empresa contratante</LegalTerm>, a qualquer momento —
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
          O tratamento de dados pessoais relacionado ao aplicativo — incluindo as permissões
          solicitadas no aparelho, os serviços de terceiros utilizados e os direitos do titular — está
          descrito na{' '}
          <Link
            href="/privacidade"
            className="text-primary-text underline-offset-4 transition-colors hover:underline"
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
          privilegiado que seja — ressalvadas as hipóteses em que a lei assegure foro diverso.
        </p>
      </LegalSection>

      <LegalSection id="contato" number="12" title="Contato">
        <p>
          <LegalTerm>SPX Inteligência e Desenvolvimento LTDA</LegalTerm>
          <br />
          CNPJ 68.387.997/0001-18
          <br />
          Avenida das Figueiras, 1646, Sala 8B, Setor Comercial — Sinop/MT, CEP 78550-150
          <br />
          <LegalTerm>E-mail:</LegalTerm>{' '}
          <a
            href={`mailto:${EMAIL}`}
            className="text-primary-text underline-offset-4 transition-colors hover:underline"
          >
            {EMAIL}
          </a>
        </p>
      </LegalSection>
    </LegalShell>
  )
}
