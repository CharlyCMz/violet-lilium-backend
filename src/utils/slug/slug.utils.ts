import {
  compareAttributes,
  SortableAttribute,
} from '../../products/utils/variant-attributes';

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function generateVariantSlugBase(
  variantName: string,
  brand: string,
  attributes: SortableAttribute[],
): string {
  const ordered = [...attributes].sort(compareAttributes);
  const parts = [variantName, brand, ...ordered.map((a) => a.value)];
  return slugify(parts.filter((p) => p?.trim()).join(' '));
}

export function nextSlugCandidate(base: string, attempt: number): string {
  return attempt <= 1 ? base : `${base}-${attempt}`;
}
