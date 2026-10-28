import { ROUTES, resolveRoutePath } from './voiceRoutes';

export interface AgentAction {
  type: string;
  target?: string;
  query?: Record<string, string>;
  direction?: 'down' | 'up' | 'top' | 'bottom' | 'continuous';
  elementId?: string;
  value?: string;
  submit?: boolean;
}

export interface ActionContext {
  elementMap: Map<string, HTMLElement>;
  router: { push: (path: string) => void; back: () => void };
  speak: (text: string, lang?: string) => void;
  lang: 'en' | 'bn';
  campaignId?: string;
  requestConfirmation: (label: string) => Promise<boolean>;
}

const SENSITIVE_KEYWORDS = [
  'delete', 'remove', 'approve', 'reject', 'withdraw', 'pay', 'donate', 'logout', 'confirm payment',
  'ডিলিট', 'অনুমোদন', 'উইথড্র', 'পেমেন্ট'
];

let continuousScrollRaf: number | null = null;

export function stopContinuousScroll() {
  if (continuousScrollRaf !== null) {
    cancelAnimationFrame(continuousScrollRaf);
    continuousScrollRaf = null;
  }
}

export async function executeActions(actions: AgentAction[], ctx: ActionContext): Promise<void> {
  if (!Array.isArray(actions)) return;

  for (const action of actions) {
    if (!action || !action.type) continue;

    switch (action.type) {
      case 'navigate': {
        const { target, query } = action;
        if (target && ROUTES[target]) {
          const path = resolveRoutePath(target, ctx.campaignId, query);
          if (path) {
            ctx.router.push(path);
          }
        }
        break;
      }
      case 'scroll': {
        stopContinuousScroll();
        const dir = action.direction;
        if (dir === 'down') {
          window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
        } else if (dir === 'up') {
          window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
        } else if (dir === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (dir === 'bottom') {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        } else if (dir === 'continuous') {
          const speed = 1.5;
          const step = () => {
            window.scrollBy({ top: speed, behavior: 'auto' });
            continuousScrollRaf = requestAnimationFrame(step);
          };
          continuousScrollRaf = requestAnimationFrame(step);
        }
        break;
      }
      case 'click': {
        const elId = action.elementId;
        if (!elId || !ctx.elementMap.has(elId)) break;
        const el = ctx.elementMap.get(elId)!;

        const label = el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('placeholder') || '';
        const lowerLabel = label.toLowerCase();
        const isSensitive = SENSITIVE_KEYWORDS.some(kw => lowerLabel.includes(kw));

        if (isSensitive) {
          const msg = ctx.lang === 'bn' 
            ? `সংবেদনশীল কাজ। "${label}" ক্লিক করতে 'কনফার্ম' বা 'হ্যাঁ' বলুন।`
            : `Say confirm to click ${label}`;
          ctx.speak(msg, ctx.lang === 'bn' ? 'bn-BD' : 'en-US');

          const confirmed = await ctx.requestConfirmation(label);
          if (!confirmed) {
            const cancelMsg = ctx.lang === 'bn' ? 'অপারেশন বাতিল করা হয়েছে।' : 'Action cancelled.';
            ctx.speak(cancelMsg, ctx.lang === 'bn' ? 'bn-BD' : 'en-US');
            break;
          }
        }

        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const origOutline = el.style.outline;
        el.style.outline = '3px solid #3b82f6';
        setTimeout(() => {
          el.style.outline = origOutline;
        }, 1200);

        el.click();
        break;
      }
      case 'type': {
        const elId = action.elementId;
        const value = action.value || '';
        if (!elId || !ctx.elementMap.has(elId)) break;
        const el = ctx.elementMap.get(elId) as HTMLInputElement | HTMLTextAreaElement;
        if (!el) break;

        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set || Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          'value'
        )?.set;

        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(el, value);
        } else {
          el.value = value;
        }

        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));

        if (action.submit) {
          const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
          });
          el.dispatchEvent(enterEvent);
          const form = el.closest('form');
          if (form) {
            form.requestSubmit ? form.requestSubmit() : form.submit();
          }
        }
        break;
      }
      case 'back': {
        ctx.router.back();
        break;
      }
      case 'read': {
        const heading = document.querySelector('h1, h2, h3')?.textContent || '';
        const main = document.querySelector('main, article, body')?.textContent || '';
        const cleanedMain = main.replace(/\s+/g, ' ').trim();
        const snippet = cleanedMain.substring(0, 300);
        const textToRead = `${heading}. ${snippet}`.trim();
        if (textToRead) {
          ctx.speak(textToRead, ctx.lang === 'bn' ? 'bn-BD' : 'en-US');
        }
        break;
      }
    }
  }
}
