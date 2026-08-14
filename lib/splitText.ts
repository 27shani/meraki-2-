/**
 * Character / Word Split Utility
 * -------------------------------------------------
 * Dual-layer structure (.ch-top + .ch-bot) for lukebaffait-style
 * hover clip-path effect. Also provides word split for scrub reveals.
 */

import gsap from 'gsap';

export interface CharElement {
  top: HTMLElement;
  bot: HTMLElement;
  wrapper: HTMLElement;
}

/**
 * Split text content of an element into individual characters.
 * Each character becomes:
 *   <span class="char">
 *     <span class="ch-top">A</span>
 *     <span class="ch-bot">A</span>
 *   </span>
 */
export function splitIntoChars(
  el: HTMLElement,
  options: { preserveSpaces?: boolean } = {}
): CharElement[] {
  const { preserveSpaces = true } = options;
  const text = el.textContent || '';
  el.innerHTML = '';
  el.classList.add('split-chars');

  const chars: CharElement[] = [];

  text.split('').forEach((char) => {
    if (char === ' ' && preserveSpaces) {
      const space = document.createElement('span');
      space.className = 'char-space';
      space.innerHTML = '&nbsp;';
      el.appendChild(space);
      return;
    }

    if (char === ' ') return;

    const wrapper = document.createElement('span');
    wrapper.className = 'char';
    wrapper.setAttribute('aria-hidden', 'true');

    const top = document.createElement('span');
    top.className = 'ch-top';
    top.textContent = char;

    const bot = document.createElement('span');
    bot.className = 'ch-bot';
    bot.textContent = char;

    wrapper.appendChild(top);
    wrapper.appendChild(bot);
    el.appendChild(wrapper);

    chars.push({ top, bot, wrapper });
  });

  el.setAttribute('aria-label', text);
  return chars;
}

/**
 * Split text content into words (each word wrapped in a span).
 */
export function splitIntoWords(el: HTMLElement): HTMLElement[] {
  const text = el.textContent || '';
  el.innerHTML = '';
  el.classList.add('split-words');

  const words: HTMLElement[] = [];
  const parts = text.split(/(\s+)/);

  parts.forEach((part) => {
    if (/^\s+$/.test(part)) {
      el.appendChild(document.createTextNode(part));
      return;
    }
    if (!part) return;

    const span = document.createElement('span');
    span.className = 'word';
    span.style.display = 'inline-block';
    span.textContent = part;
    el.appendChild(span);
    words.push(span);
  });

  return words;
}

/**
 * Apply dual-layer hover (clip-path wipe) to char elements.
 * power3.out + staggered timing.
 */
export function applyCharHover(
  chars: CharElement[],
  options: { stagger?: number } = {}
) {
  const { stagger = 0.012 } = options;

  // Parent element drives hover so the whole word/link reacts together
  const parent = chars[0]?.wrapper?.parentElement;
  if (!parent) return;

  const onEnter = () => {
    chars.forEach(({ top, bot }, i) => {
      gsap.to(top, {
        clipPath: 'inset(0 0 0 0)',
        duration: 0.45,
        ease: 'power3.out',
        delay: i * stagger,
        overwrite: true,
      });
      gsap.to(bot, {
        yPercent: -100,
        duration: 0.45,
        ease: 'power3.out',
        delay: i * stagger,
        overwrite: true,
      });
    });
  };

  const onLeave = () => {
    chars.forEach(({ top, bot }, i) => {
      gsap.to(top, {
        clipPath: 'inset(100% 0 0 0)',
        duration: 0.4,
        ease: 'power3.out',
        delay: i * stagger,
        overwrite: true,
      });
      gsap.to(bot, {
        yPercent: 0,
        duration: 0.4,
        ease: 'power3.out',
        delay: i * stagger,
        overwrite: true,
      });
    });
  };

  parent.addEventListener('mouseenter', onEnter);
  parent.addEventListener('mouseleave', onLeave);
}

/**
 * Convenience: split + apply hover on any element matching selector
 * inside a root (or document). Returns cleanup fn.
 */
export function initCharHover(
  root: ParentNode = document,
  selector = '[data-char-hover]'
): () => void {
  const nodes = root.querySelectorAll<HTMLElement>(selector);
  const allChars: CharElement[] = [];

  nodes.forEach((el) => {
    // Skip if already split
    if (el.classList.contains('split-chars')) return;
    const chars = splitIntoChars(el);
    applyCharHover(chars);
    allChars.push(...chars);
  });

  return () => {
    // No-op cleanup; GSAP context/revert in components handles kill
  };
}
