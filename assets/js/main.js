/* ============================================================
   MÉTODO LEVE 28 — comportamento da página
   ------------------------------------------------------------
   TUDO que depende da oferta real está em CONFIG. Edite aqui e
   a página inteira se atualiza (preço, parcelas, garantia,
   checkout, e-mail de suporte, depoimentos).
   ============================================================ */

const CONFIG = {
  /* INTEGRAÇÃO · CHECKOUT
     Cole aqui o link de pagamento da plataforma (Hotmart, Kiwify,
     Eduzz, Cakto, Stripe…). Enquanto estiver vazio, os botões de
     compra rolam até a FAQ em vez de fingir que compram algo. */
  checkoutUrl: "",

  /* OFERTA — confirme na plataforma antes de publicar */
  price: "97",                              // valor à vista, sem "R$"
  installments: "ou em até 12x no cartão",  // ex.: "ou 12x de R$ 9,74"
  guaranteeDays: 7,                         // garantia (Hotmart/Kiwify: 7 dias é o padrão)

  /* SUPORTE */
  supportEmail: "contato@SEU-DOMINIO.com.br",

  /* PROVA SOCIAL — só ative quando houver depoimentos REAIS no HTML */
  showTestimonials: false,
};

/* ------------------------------------------------------------ */

(function init() {
  applyConfig();
  setupCheckoutLinks();
  setupAccordion();
  setupSticky();
  setupReveal();
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();

/* Preenche todos os pontos da página que dependem de CONFIG */
function applyConfig() {
  const set = (selector, value) =>
    document.querySelectorAll(selector).forEach((el) => (el.textContent = value));

  set("[data-price]", CONFIG.price);
  set("[data-installments]", CONFIG.installments);
  set("[data-guarantee]", String(CONFIG.guaranteeDays));

  document.querySelectorAll("[data-support-email]").forEach((el) => {
    el.href = `mailto:${CONFIG.supportEmail}`;
    if (!el.closest(".footer__links")) el.textContent = CONFIG.supportEmail;
  });

  const social = document.querySelector("[data-testimonials]");
  if (social) {
    const hasPlaceholders = social.querySelector("[data-placeholder]");
    // Nunca exibe a seção enquanto houver texto de exemplo, mesmo com a flag ligada.
    social.hidden = !(CONFIG.showTestimonials && !hasPlaceholders);
    if (CONFIG.showTestimonials && hasPlaceholders) {
      console.warn("[Método Leve 28] Depoimentos ocultos: substitua os placeholders por depoimentos reais.");
    }
  }
}

/* Botões de compra: usam o checkout real quando houver; senão, levam à FAQ */
function setupCheckoutLinks() {
  const hasCheckout = /^https?:\/\//.test(CONFIG.checkoutUrl);
  document.querySelectorAll("[data-checkout]").forEach((a) => {
    if (hasCheckout) {
      a.href = CONFIG.checkoutUrl;
      a.target = "_blank";
      a.rel = "noopener";
      a.addEventListener("click", () => track("begin_checkout"));
    } else {
      a.href = "#faq";
      a.title = "Checkout ainda não configurado";
    }
  });
  if (!hasCheckout) {
    console.info("[Método Leve 28] CONFIG.checkoutUrl vazio — botões de compra apontam para a FAQ.");
  }
}

/* Acordeão da FAQ: abre um por vez e anima a altura */
function setupAccordion() {
  const root = document.querySelector("[data-accordion]");
  if (!root) return;
  const items = Array.from(root.querySelectorAll("details"));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  items.forEach((d) => {
    const summary = d.querySelector("summary");
    const body = d.querySelector(".accordion__body");
    if (!summary || !body) return;

    summary.addEventListener("click", (e) => {
      e.preventDefault();
      const willOpen = !d.open;
      items.forEach((other) => other !== d && other.open && close(other));
      willOpen ? open(d) : close(d);
    });
  });

  function open(d) {
    const body = d.querySelector(".accordion__body");
    d.open = true;
    if (reduce) return;
    const h = body.scrollHeight;
    body.animate([{ height: "0px", opacity: 0 }, { height: `${h}px`, opacity: 1 }], {
      duration: 360, easing: "cubic-bezier(.22,1,.36,1)",
    });
  }
  function close(d) {
    const body = d.querySelector(".accordion__body");
    if (reduce) { d.open = false; return; }
    const h = body.scrollHeight;
    const anim = body.animate([{ height: `${h}px`, opacity: 1 }, { height: "0px", opacity: 0 }], {
      duration: 260, easing: "cubic-bezier(.22,1,.36,1)",
    });
    anim.onfinish = () => (d.open = false);
  }
}

/* Barra fixa de CTA no mobile: aparece após a primeira dobra, some na oferta e no rodapé */
function setupSticky() {
  const bar = document.querySelector("[data-sticky]");
  const hero = document.querySelector(".hero");
  const offer = document.querySelector("#oferta");
  const footer = document.querySelector(".footer");
  if (!bar || !hero || !("IntersectionObserver" in window)) return;

  const state = { pastHero: false, onOffer: false, onFooter: false };
  const update = () => {
    const show = state.pastHero && !state.onOffer && !state.onFooter;
    bar.classList.toggle("is-visible", show);
    bar.setAttribute("aria-hidden", String(!show));
    document.body.classList.toggle("has-sticky", show);
  };

  new IntersectionObserver(([e]) => { state.pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; update(); }, { threshold: 0 }).observe(hero);
  if (offer) new IntersectionObserver(([e]) => { state.onOffer = e.isIntersecting; update(); }, { threshold: 0.25 }).observe(offer);
  if (footer) new IntersectionObserver(([e]) => { state.onFooter = e.isIntersecting; update(); }, { threshold: 0 }).observe(footer);
}

/* Revelação discreta das seções (só opacidade) */
function setupReveal() {
  const targets = document.querySelectorAll("main > section .wrap");
  if (!("IntersectionObserver" in window)) return;
  targets.forEach((t) => t.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  targets.forEach((t) => io.observe(t));
}

/* INTEGRAÇÃO · ANALYTICS
   Substitua pelo seu pixel/tag (Meta Pixel, GA4, GTM). Ex.:
   window.fbq && fbq("track", "InitiateCheckout"); */
function track(eventName) {
  if (window.dataLayer) window.dataLayer.push({ event: eventName });
}
