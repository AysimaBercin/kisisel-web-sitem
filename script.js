const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Bring short slogans in like a small terminal readout.
const typedLine = document.querySelector('#typed-line');
const mantras = ['Merakını canlı tut.', 'Sinyali bul. Gürültüyü bırak.', 'Kaosa gül, odağını koru.'];
let mantraIndex = 0;

if (typedLine && !prefersReducedMotion) {
  let charIndex = mantras[0].length;
  let deleting = true;

  const typeNext = () => {
    const phrase = mantras[mantraIndex];
    charIndex += deleting ? -1 : 1;
    typedLine.textContent = phrase.slice(0, charIndex);

    if (deleting && charIndex <= 0) {
      deleting = false;
      mantraIndex = (mantraIndex + 1) % mantras.length;
      window.setTimeout(typeNext, 260);
      return;
    }
    if (!deleting && charIndex >= mantras[mantraIndex].length) {
      deleting = true;
      window.setTimeout(typeNext, 1900);
      return;
    }
    window.setTimeout(typeNext, deleting ? 38 : 64);
  };
  window.setTimeout(typeNext, 2200);
}

// Reveal content as it enters the viewport.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -24px 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Touch friendly navigation that closes after selection.
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

function setMenu(open) {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  mobileMenu.classList.toggle('is-open', open);
  mobileMenu.inert = !open;
  document.body.classList.toggle('menu-open', open);
}

menuToggle?.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});
mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

// Original, modern Stoic notes (no historical attribution).
const quoteLines = [
  'Dışarıdaki gürültü senin değil. Tepkin ise tamamen senin.',
  'Her şeyi kontrol edemezsin. Bir sonraki adımını edebilirsin.',
  'Plan değişebilir. Odağın yerinde kalabilir.',
  'Günün sürprizlerine değil, verdiğin cevaba hükmet.'
];
const quoteElement = document.querySelector('#stoic-quote');
const quoteButton = document.querySelector('#quote-button');
let quoteIndex = 0;
quoteButton?.addEventListener('click', () => {
  quoteIndex = (quoteIndex + 1) % quoteLines.length;
  if (!quoteElement) return;
  quoteElement.classList.add('is-changing');
  window.setTimeout(() => {
    quoteElement.textContent = quoteLines[quoteIndex];
    quoteElement.classList.remove('is-changing');
  }, prefersReducedMotion ? 0 : 160);
});

// A brief, optional 8-second breathing pause.
const breathButton = document.querySelector('#breath-button');
const breathButtonLabel = document.querySelector('#breath-button-label');
const breathHint = document.querySelector('#breath-hint');
const breathCount = document.querySelector('#breath-count');
const breathVisual = document.querySelector('.breath-visual');
let breathTimer;

breathButton?.addEventListener('click', () => {
  if (breathButton.disabled) return;
  breathButton.disabled = true;
  breathVisual?.classList.add('is-breathing');
  breathButtonLabel.textContent = 'Mola sürüyor';
  let secondsLeft = 8;
  if (breathHint) breathHint.textContent = 'Yavaşça nefes al…';
  if (breathCount) breathCount.textContent = '08';

  breathTimer = window.setInterval(() => {
    secondsLeft -= 1;
    if (breathCount) breathCount.textContent = String(secondsLeft).padStart(2, '0');
    if (secondsLeft === 4 && breathHint) breathHint.textContent = 'Şimdi yavaşça nefes ver…';
    if (secondsLeft <= 0) {
      window.clearInterval(breathTimer);
      breathVisual?.classList.remove('is-breathing');
      breathButton.disabled = false;
      breathButtonLabel.textContent = 'Bir mola daha';
      if (breathHint) breathHint.textContent = 'Tamam. Kendi ritminde devam.';
      if (breathCount) breathCount.textContent = '08';
    }
  }, 1000);
});

// Japanese glyphs appear briefly on interactive elements.
const glyphs = ['和', '心', '火', '道', '夢', '静', '波', '風'];
const sparkLayer = document.querySelector('.spark-layer');
document.querySelectorAll('.js-spark').forEach((element) => {
  element.addEventListener('pointerenter', (event) => {
    if (prefersReducedMotion || !sparkLayer || event.pointerType === 'touch') return;
    const rect = element.getBoundingClientRect();
    const spark = document.createElement('span');
    spark.className = 'jp-spark';
    spark.setAttribute('aria-hidden', 'true');
    spark.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    spark.style.left = `${Math.min(window.innerWidth - 16, Math.max(16, rect.left + rect.width * (0.25 + Math.random() * 0.5)))}px`;
    spark.style.top = `${Math.min(window.innerHeight - 20, Math.max(20, rect.top + rect.height * 0.45))}px`;
    sparkLayer.append(spark);
    spark.addEventListener('animationend', () => spark.remove(), { once: true });
  });
});
