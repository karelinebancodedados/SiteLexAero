/**
 * tracking.js — Utilitário central de analytics (GTM / dataLayer)
 *
 * Regras:
 * - Nunca enviar PII (nome, telefone, e-mail, CPF, dados jurídicos).
 * - form_lead_gerado SOMENTE após confirmação real de sucesso.
 * - Um envio bem-sucedido = exatamente 1 evento.
 */

/**
 * Envia form_lead_gerado ao dataLayer do GTM.
 *
 * @param {string} formName - Nome técnico do formulário (snake_case).
 *   Exemplos: 'diagnostico_voo', 'falar_com_especialista'
 */
export function pushLeadGerado(formName) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'form_lead_gerado',
    form_name: formName,
    page_path: window.location.pathname,
  });
}
