// WhatsApp comercial da SPXia (linha da Simplex no Chat SPX).
const WHATSAPP_NUMBER = '5566996571379'

/** Link que abre a conversa no WhatsApp com a mensagem já escrita. */
export const whatsappHref = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
