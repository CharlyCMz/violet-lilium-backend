import { Attribute } from '../entities/attribute.entity';
import { ProductVariant } from '../entities/product-variant.entity';

// Pin merchandising order here (listed types first); empty = alphabetical.
export const ATTRIBUTE_TYPE_ORDER: string[] = [];

export type SortableAttribute = Pick<Attribute, 'id' | 'type' | 'value'>;

export function compareAttributes(
  a: SortableAttribute,
  b: SortableAttribute,
): number {
  const rankOf = (type: string) => {
    const index = ATTRIBUTE_TYPE_ORDER.indexOf(type);
    return index === -1 ? ATTRIBUTE_TYPE_ORDER.length : index;
  };
  const byRank = rankOf(a.type) - rankOf(b.type);
  if (byRank !== 0) return byRank;
  const byType = a.type.localeCompare(b.type, 'es', { sensitivity: 'base' });
  if (byType !== 0) return byType;
  const byValue = a.value.localeCompare(b.value, 'es', {
    sensitivity: 'base',
  });
  if (byValue !== 0) return byValue;
  return a.id.localeCompare(b.id);
}

export function sortVariantAttributes(
  variants: ProductVariant | ProductVariant[],
): void {
  const list = Array.isArray(variants) ? variants : [variants];
  for (const variant of list) {
    if (variant.attributes?.length) {
      variant.attributes = [...variant.attributes].sort(compareAttributes);
    }
  }
}
