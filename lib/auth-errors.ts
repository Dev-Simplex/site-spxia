/**
 * O Supabase Auth responde sempre em inglês. Nas telas de acesso,
 * traduzimos os casos conhecidos e caímos na mensagem original no resto.
 */
const messages: { match: RegExp; pt: string; en: string }[] = [
  { match: /invalid login credentials/i, pt: 'E-mail ou senha incorretos.', en: "Incorrect email or password." },
  { match: /email not confirmed/i, pt: 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.', en: "Confirm your email before signing in. Check your inbox." },
  { match: /user already registered|already been registered/i, pt: 'Este e-mail já está cadastrado.', en: "This email is already registered." },
  { match: /password should be at least/i, pt: 'A senha deve ter no mínimo 6 caracteres.', en: "Your password must be at least 6 characters." },
  { match: /unable to validate email address|invalid format/i, pt: 'E-mail inválido.', en: "Invalid email." },
  { match: /for security purposes.*(\d+) seconds/i, pt: 'Aguarde alguns segundos antes de tentar novamente.', en: "Wait a few seconds before trying again." },
  { match: /email rate limit exceeded|over_email_send_rate_limit/i, pt: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.', en: "Too many attempts. Wait a few minutes and try again." },
  { match: /new password should be different/i, pt: 'A nova senha deve ser diferente da senha atual.', en: "Your new password must be different from the current one." },
  { match: /auth session missing|session_not_found|invalid claim/i, pt: 'Link expirado ou inválido. Solicite a recuperação de senha novamente.', en: "This link has expired or is invalid. Request a new password reset." },
  { match: /token has expired|otp_expired/i, pt: 'O link de recuperação expirou. Solicite um novo e-mail.', en: "The reset link has expired. Request a new email." },
  { match: /failed to fetch|network/i, pt: 'Falha de conexão. Verifique sua internet e tente novamente.', en: "Connection failed. Check your internet and try again." },
]

export function traduzErroAuth(message: string | undefined | null, locale: "pt" | "en" = "pt"): string {
  if (!message) return locale === "pt" ? 'Não foi possível concluir a operação. Tente novamente.' : "We couldn't complete that. Please try again."
  const hit = messages.find((m) => m.match.test(message))
  return hit ? hit[locale] : message
}
