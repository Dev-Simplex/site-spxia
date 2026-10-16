// Recebe as respostas do questionário do site (rota /api/diagnostico) e grava uma linha por envio.
//
// Instalação, uma vez só:
// 1. Na planilha: Extensões > Apps Script. Apague o que estiver lá, cole este arquivo e salve.
// 2. Implantar > Nova implantação > tipo "App da Web".
//    Executar como: Eu. Quem pode acessar: Qualquer pessoa. Autorize quando o Google pedir.
// 3. Copie a URL que termina em /exec. Ela vai na variável DIAGNOSTICO_PLANILHA_URL do site.
// Se mudar este código depois: Implantar > Gerenciar implantações > editar > Nova versão (a URL continua a mesma).

const AVISAR = 'contato@simplexsolucoes.com.br'; // recebe um e-mail a cada diagnóstico novo ('' desliga)

// Texto que começa com = + - @ viraria fórmula na planilha; o apóstrofo guarda como texto.
const comoTexto = (valor) => (/^[=+\-@]/.test(valor) ? "'" + valor : valor);

function doPost(e) {
  const linha = JSON.parse(e.postData.contents).linha;
  const aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const trava = LockService.getScriptLock();
  trava.waitLock(10000);
  try {
    // O cabeçalho cresce sozinho: pergunta nova no site vira coluna nova aqui.
    let cabecalho = aba.getLastColumn() ? aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0] : [];
    const novas = Object.keys(linha).filter((coluna) => !cabecalho.includes(coluna));
    if (novas.length) {
      aba.getRange(1, cabecalho.length + 1, 1, novas.length).setValues([novas]).setFontWeight('bold');
      aba.setFrozenRows(1);
      cabecalho = cabecalho.concat(novas);
    }
    aba.appendRow(cabecalho.map((coluna) => comoTexto(coluna in linha ? String(linha[coluna]) : '')));
  } finally {
    trava.releaseLock();
  }

  // O aviso por e-mail não pode derrubar o envio: a linha já está salva.
  if (AVISAR) {
    try {
      const corpo = Object.keys(linha).map((coluna) => coluna + '\n' + (linha[coluna] || '-')).join('\n\n');
      MailApp.sendEmail(AVISAR, 'Novo diagnóstico pelo site: ' + (linha['Empresa'] || linha['Nome']), corpo);
    } catch (erro) {
      console.error('Aviso por e-mail falhou', erro);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
