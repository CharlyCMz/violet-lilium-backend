import { Category } from '../entities/category.entity';
//import { Label } from '../entities/label.entity';
import { Product } from '../entities/product.entity';
import { SubCategory } from '../entities/sub-category.entity';

export class SearchBarResponseDTO {
  category: Category;
  subCategory: SubCategory;
  //labels: Label;
  products: Product[];
}
