// contact.js — dynamic builders for contact actions (mailto, Gmail, Outlook Web, WhatsApp)

document.addEventListener('DOMContentLoaded', () => {
  const messageBox = document.getElementById('messageBox');
  const btnMailto = document.getElementById('btnMailto');
  const btnGmail = document.getElementById('btnGmail');
  const btnOutlook = document.getElementById('btnOutlook');
  const btnWhats = document.getElementById('btnWhats');

  const EMAIL_TO = 'laitartlucas@gmail.com';
  const SUBJECT = 'Contato via Portfólio';
  const WHATS_NUMBER = '5554999258389'; 

  function getMessage() {
    const raw = (messageBox?.value || '').trim();
    return raw || 'Ola, visitei seu site e gostaria de conversar.';
  }

  function enc(v) {
    return encodeURIComponent(v);
  }

  function buildMailto() {
    const body = getMessage();
    return `mailto:${EMAIL_TO}?subject=${enc(SUBJECT)}&body=${enc(body)}`;
  }

  function buildGmail() {
    const body = getMessage();
    return `https://mail.google.com/mail/?view=cm&to=${enc(EMAIL_TO)}&su=${enc(SUBJECT)}&body=${enc(body)}`;
  }

  function buildOutlook() {
    const body = getMessage();
    return `https://outlook.live.com/owa/?path=/mail/action/compose&to=${enc(EMAIL_TO)}&subject=${enc(SUBJECT)}&body=${enc(body)}`;
  }

  function buildWhats() {
    const text = getMessage();
    return `https://wa.me/${WHATS_NUMBER}?text=${enc(text)}`;
  }

  function safeAssign(anchor, href) {
    if (!anchor) return;
    // use setAttribute to avoid immediate navigation
    anchor.setAttribute('href', href);
  }

  // Update links on each interaction
  [messageBox].forEach(el => {
    if (!el) return;
    el.addEventListener('input', () => {
      safeAssign(btnMailto, buildMailto());
      safeAssign(btnGmail, buildGmail());
      safeAssign(btnOutlook, buildOutlook());
      safeAssign(btnWhats, buildWhats());
    });
  });

  // Also update on button hover/click to ensure latest value
  [btnMailto, btnGmail, btnOutlook, btnWhats].forEach(btn => {
    if (!btn) return;
    ['mouseenter','click','focus'].forEach(evt => {
      btn.addEventListener(evt, () => {
        safeAssign(btnMailto, buildMailto());
        safeAssign(btnGmail, buildGmail());
        safeAssign(btnOutlook, buildOutlook());
        safeAssign(btnWhats, buildWhats());
      });
    });
  });

  // Initial set
  safeAssign(btnMailto, buildMailto());
  safeAssign(btnGmail, buildGmail());
  safeAssign(btnOutlook, buildOutlook());
  safeAssign(btnWhats, buildWhats());
});
