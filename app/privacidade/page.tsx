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
  title: { absolute: 'Política de Privacidade — Chat SPX | SPXIA' },
  description:
    'Como o aplicativo Chat SPX trata dados pessoais: permissões do app, serviços de terceiros, retenção e direitos do titular. Cada empresa cliente mantém as conversas no próprio servidor.',
  alternates: { canonical: '/privacidade' },
}

const EMAIL = 'sup@simplexsolucoes.com.br'

const toc: TocEntry[] = [
  { id: 'controlador-operador', number: '01', title: 'Quem controla e quem opera os dados' },
  { id: 'dados-tratados', number: '02', title: 'Quais dados são tratados' },
  { id: 'aplicativo-movel', number: '03', title: 'O aplicativo móvel e suas permissões' },
  { id: 'terceiros', number: '04', title: 'Serviços de terceiros' },
  { id: 'diagnostico', number: '05', title: 'Dados de diagnóstico e falhas' },
  { id: 'retencao', number: '06', title: 'Por quanto tempo os dados ficam guardados' },
  { id: 'direitos', number: '07', title: 'Seus direitos e como exercê-los' },
  { id: 'seguranca', number: '08', title: 'Segurança' },
  { id: 'criancas', number: '09', title: 'Dados de crianças e adolescentes' },
  { id: 'alteracoes', number: '10', title: 'Alterações desta política' },
  { id: 'contato', number: '11', title: 'Contato' },
]

export default function PoliticaDePrivacidadeChatSPX() {
  return (
    <LegalShell
      title="Política de Privacidade — Chat SPX"
      intro="Esta política explica como o aplicativo Chat SPX trata dados pessoais: o que o app acessa no aparelho, para que serve cada permissão, quais serviços de terceiros são usados e como exercer seus direitos previstos na Lei Geral de Proteção de Dados (Lei nº 13.709/2018)."
      updatedAt="10 de agosto de 2026"
      toc={toc}
    >
      <LegalSection id="controlador-operador" number="01" title="Quem controla e quem opera os dados">
        <p>
          O <LegalTerm>Chat SPX</LegalTerm> é um aplicativo móvel de atendimento ao cliente,
          disponível para Android e iOS, desenvolvido pela{' '}
          <LegalTerm>SPX Inteligência e Desenvolvimento LTDA</LegalTerm>, CNPJ 68.387.997/0001-18,
          com sede na Avenida das Figueiras, 1646, Sala 8B, Setor Comercial, Sinop – MT, CEP
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
            empresa contratante — não em servidores da SPX.
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
          revogá-la depois nas configurações do sistema — nesse caso, apenas o recurso
          correspondente deixa de funcionar.
        </p>
        <LegalList>
          <LegalItem>
            <LegalTerm>Contatos (leitura e gravação)</LegalTerm> — a leitura permite iniciar uma
            conversa escolhendo alguém direto da agenda do aparelho, sem digitar o número. A gravação
            permite salvar na agenda um contato que chegou dentro de uma mensagem.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Microfone</LegalTerm> — gravar mensagens de voz para enviar na conversa.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Câmera</LegalTerm> — tirar uma foto na hora para enviar ao cliente e ler
            códigos QR.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Fotos e mídia</LegalTerm> — anexar arquivos e imagens já existentes no
            aparelho às conversas e salvar na galeria a mídia recebida.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Notificações</LegalTerm> — avisar o agente sobre novas mensagens.
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
            <LegalTerm>Google Firebase Cloud Messaging (FCM)</LegalTerm> — responsável por entregar
            as notificações de novas mensagens ao aparelho. Para isso, armazena um identificador do
            aparelho, chamado token de push. Esse token identifica a instalação do aplicativo, não a
            pessoa, e é usado exclusivamente para rotear a notificação até o dispositivo correto.
          </LegalItem>
          <LegalItem>
            <LegalTerm>Sentry</LegalTerm> — recebe relatórios automáticos de erro e falha do
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
              className="text-primary-text underline-offset-4 transition-colors hover:underline"
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
          ambiente — cópias de segurança, controle de acesso à infraestrutura e retenção — são
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
          Avenida das Figueiras, 1646, Sala 8B, Setor Comercial — Sinop/MT, CEP 78550-150
          <br />
          <LegalTerm>E-mail para assuntos de privacidade:</LegalTerm>{' '}
          <a
            href={`mailto:${EMAIL}`}
            className="text-primary-text underline-offset-4 transition-colors hover:underline"
          >
            {EMAIL}
          </a>
        </p>
        <p>
          As condições de uso do aplicativo estão descritas nos{' '}
          <Link
            href="/termos"
            className="text-primary-text underline-offset-4 transition-colors hover:underline"
          >
            Termos de Uso
          </Link>
          .
        </p>
      </LegalSection>
    </LegalShell>
  )
}
