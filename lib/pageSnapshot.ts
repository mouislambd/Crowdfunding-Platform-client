export interface SnapshotElement {
  id: string;
  tag: string;
  label: string;
}

export interface PageSnapshotResult {
  elements: SnapshotElement[];
  elementMap: Map<string, HTMLElement>;
}

export function takePageSnapshot(): PageSnapshotResult {
  const elementMap = new Map<string, HTMLElement>();
  const elements: SnapshotElement[] = [];

  if (typeof document === 'undefined') {
    return { elements, elementMap };
  }

  const selector = 'a, button, [role="button"], [role="tab"], input, textarea, select';
  const rawNodes = Array.from(document.querySelectorAll(selector)) as HTMLElement[];

  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  const validElements: { el: HTMLElement; inViewport: boolean; rect: DOMRect }[] = [];

  for (const el of rawNodes) {
    if (el.closest('[data-voice-ignore]')) continue;

    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0' || el.offsetParent === null) {
      continue;
    }

    if (el.hasAttribute('disabled') || (el as any).disabled === true || el.getAttribute('aria-disabled') === 'true') {
      continue;
    }

    const tagName = el.tagName.toLowerCase();
    if (tagName === 'input') {
      const type = (el as HTMLInputElement).type?.toLowerCase();
      if (type === 'password' || type === 'hidden') continue;
    }

    const rect = el.getBoundingClientRect();
    const inViewport = rect.top < viewportHeight && rect.bottom > 0 && rect.left < viewportWidth && rect.right > 0;

    validElements.push({ el, inViewport, rect });
  }

  validElements.sort((a, b) => {
    if (a.inViewport && !b.inViewport) return -1;
    if (!a.inViewport && b.inViewport) return 1;
    return 0;
  });

  let counter = 1;
  for (const item of validElements) {
    if (elements.length >= 80) break;
    const el = item.el;
    const tagName = el.tagName.toLowerCase();

    let label = '';
    const ariaLabel = el.getAttribute('aria-label');
    const title = el.getAttribute('title');
    const placeholder = el.getAttribute('placeholder');
    const innerText = el.innerText?.trim();

    if (ariaLabel && ariaLabel.trim()) {
      label = ariaLabel.trim();
    } else if (title && title.trim()) {
      label = title.trim();
    } else if (placeholder && placeholder.trim()) {
      label = placeholder.trim();
    } else if (innerText) {
      label = innerText;
    }

    label = label.replace(/\s+/g, ' ').trim();
    if (label.length > 80) {
      label = label.substring(0, 77) + '...';
    }

    if (!label) {
      label = tagName;
    }

    const id = `e${counter++}`;
    elementMap.set(id, el);
    elements.push({
      id,
      tag: tagName,
      label,
    });
  }

  return { elements, elementMap };
}
