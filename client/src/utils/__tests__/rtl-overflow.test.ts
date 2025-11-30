import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { findOverflowElements, fixOverflowElements } from '../overflowChecker';

describe('RTL overflow checker (heuristic tests)', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    // ensure clean DOM for each test
    document.documentElement.dir = 'ltr';
    container = document.createElement('div');
    container.id = 'test-root';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.dir = 'ltr';
  });

  it('detects an element with inline width:100vw as an overflow offender in RTL', () => {
    document.documentElement.dir = 'rtl';
    const offender = document.createElement('div');
    offender.id = 'offender';
    // inline style that commonly causes RTL mobile "blank right" behaviour
    offender.setAttribute('style', 'width:100vw; background: red;');
    container.appendChild(offender);

    const offenders = findOverflowElements(document);
    expect(offenders.map((e) => e.id)).toContain('offender');

    // apply conservative fix and ensure style updated
    fixOverflowElements(document);
    expect(offender.style.maxInlineSize).toBe('100%');
    expect(offender.style.overflowX).toBe('hidden');
  });

  it('ignores elements sized with 100% (not 100vw)', () => {
    document.documentElement.dir = 'rtl';
    const ok = document.createElement('div');
    ok.id = 'ok';
    ok.setAttribute('style', 'width:100%;');
    container.appendChild(ok);

    const offenders = findOverflowElements(document);
    expect(offenders.map((e) => e.id)).not.toContain('ok');
  });
});
