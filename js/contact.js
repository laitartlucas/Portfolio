document.addEventListener('DOMContentLoaded', () => {
  const form       = document.getElementById('contactForm');
  const btnEnviar  = document.getElementById('btnEnviar');
  const messageBox = document.getElementById('messageBox');
  const inputNome  = document.getElementById('inputNome');
  const inputEmail = document.getElementById('inputEmail');
  const inputAssunto = document.getElementById('inputAssunto');

  const EMAIL_TO = 'laitartlucas@gmail.com';

  function enc(v) { return encodeURIComponent(v); }

  function buildGmailLink() {
    const nome    = (inputNome?.value || '').trim();
    const email   = (inputEmail?.value || '').trim();
    const assunto = (inputAssunto?.value || 'Contato via Portfólio').trim();
    const msg     = (messageBox?.value || '').trim();

    const subject = assunto || 'Contato via Portfólio';
    const body = [
      nome    ? `Nome: ${nome}`    : '',
      email   ? `E-mail: ${email}` : '',
      '',
      msg || 'Olá Lucas, gostaria de conversar.',
    ].filter(Boolean).join('\n');

    return `https://mail.google.com/mail/?view=cm&to=${enc(EMAIL_TO)}&su=${enc(subject)}&body=${enc(body)}`;
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    window.open(buildGmailLink(), '_blank', 'noopener,noreferrer');
  });
});
