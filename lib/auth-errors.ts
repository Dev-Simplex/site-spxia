/**
 * O Supabase Auth responde sempre em inglês. As telas de acesso são pt-only,
 * então traduzimos os casos conhecidos e caímos na mensagem original no resto.
 */
const messages: { match: RegExp; pt: string }[] = [
  { match: /invalid login credentials/i, pt: 'E-mail ou senha incorretos.' },
  { match: /email not confirmed/i, pt: 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.' },
  { match: /user already registered|already been registered/i, pt: 'Este e-mail já está cadastrado.' },
  { match: /password should be at least/i, pt: 'A senha deve ter no mínimo 6 caracteres.' },
  { match: /unable to validate email address|invalid format/i, pt: 'E-mail inválido.' },
  { match: /for security purposes.*(\d+) seconds/i, pt: 'Aguarde alguns segundos antes de tentar novamente.' },
  { match: /email rate limit exceeded|over_email_send_rate_limit/i, pt: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.' },
  { match: /new password should be different/i, pt: 'A nova senha deve ser diferente da senha atual.' },
  { match: /auth session missing|session_not_found|invalid claim/i, pt: 'Link expirado ou inválido. Solicite a recuperação de senha novamente.' },
  { match: /token has expired|otp_expired/i, pt: 'O link de recuperação expirou. Solicite um novo e-mail.' },
  { match: /failed to fetch|network/i, pt: 'Falha de conexão. Verifique sua internet e tente novamente.' },
]

export function traduzErroAuth(message: string | undefined | null): string {
  if (!message) return 'Não foi possível concluir a operação. Tente novamente.'
  const hit = messages.find((m) => m.match.test(message))
  return hit ? hit.pt : message
}
