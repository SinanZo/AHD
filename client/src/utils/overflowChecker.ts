// Small DOM overflow checker helpers used by unit tests and runtime diagnostics
// Keep this intentionally small and deterministic for jsdom-based tests.
export function findOverflowElements(root: ParentNode = document): Element[] {
  const doc = root as Document;
  const candidates = Array.from(doc.querySelectorAll<HTMLElement>('*'));

  // Heuristic checks that are deterministic in a jsdom environment:
  // - inline width using viewport units like "100vw"
  // - inline transform that may translate content horizontally (translateX)
  // - explicit inline style causing negative margins in vw units
  const offenders = candidates.filter((el) => {
    try {
      const s = (el as HTMLElement).style;
      if (!s) return false;
      const width = s.width || '';
      const transform = s.transform || '';
      const marginLeft = s.marginLeft || '';

      if (/100vw/.test(width)) return true;
      if (/translate[XY3d]?\(.*(vw|px)/.test(transform)) return true;
      if (/-?\d+(?:\.\d+)?vw/.test(marginLeft)) return true;

      return false;
    } catch (e) {
      return false;
    }
  });

  return offenders;
}

export function fixOverflowElement(el: HTMLElement): void {
  // Conservative fix that prevents horizontal overflow while preserving layout
  el.style.maxInlineSize = '100%';
  el.style.overflowX = 'hidden';
}

export function fixOverflowElements(root: ParentNode = document): void {
  const offenders = findOverflowElements(root);
  offenders.forEach((o) => {
    fixOverflowElement(o as HTMLElement);
  });
}

export default {
  findOverflowElements,
  fixOverflowElement,
  fixOverflowElements,
};
