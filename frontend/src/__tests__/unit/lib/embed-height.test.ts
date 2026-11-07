import { describe, expect, it } from 'vitest';
import {
  isReportableEmbedHeight,
  measureEmbedContentHeight,
  resolveEmbedContentElement,
} from '@/shared/lib/embed-height';
import { EMBED_MIN_REPORT_PX } from '@/shared/constants/embed';

describe('resolveEmbedContentElement', () => {
  it('取到带内容锚点属性的元素', () => {
    const root = document.createElement('div');
    const anchor = document.createElement('div');
    anchor.setAttribute('data-embed-content', '');
    root.appendChild(anchor);

    expect(resolveEmbedContentElement(root)).toBe(anchor);
  });

  it('锚点不存在时返回 null', () => {
    const root = document.createElement('div');

    expect(resolveEmbedContentElement(root)).toBeNull();
  });
});

describe('measureEmbedContentHeight', () => {
  function elementWithBottom(bottom: number): HTMLElement {
    const element = document.createElement('div');
    element.getBoundingClientRect = () =>
      ({ bottom, top: 0, height: bottom, width: 0, left: 0, right: 0 }) as DOMRect;
    return element;
  }

  it('取锚点在文档坐标下的底边(视口坐标 + scrollY)', () => {
    expect(measureEmbedContentHeight(elementWithBottom(600), 0)).toBe(600);
    expect(measureEmbedContentHeight(elementWithBottom(400), 200)).toBe(600);
  });

  it('向上取整,避免亚像素抖动导致反复上报', () => {
    expect(measureEmbedContentHeight(elementWithBottom(600.2), 0)).toBe(601);
  });
});

describe('isReportableEmbedHeight', () => {
  it('低于下限的值不上报', () => {
    expect(isReportableEmbedHeight(EMBED_MIN_REPORT_PX - 1)).toBe(false);
    expect(isReportableEmbedHeight(0)).toBe(false);
  });

  it('不低于下限的有限数可上报', () => {
    expect(isReportableEmbedHeight(EMBED_MIN_REPORT_PX)).toBe(true);
    expect(isReportableEmbedHeight(1234)).toBe(true);
  });

  it('非有限数不上报', () => {
    expect(isReportableEmbedHeight(Number.NaN)).toBe(false);
    expect(isReportableEmbedHeight(Number.POSITIVE_INFINITY)).toBe(false);
  });
});
