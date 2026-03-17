import { Category } from './category.model';
import { Tag } from './tag.model';

export interface Pet {
  id?: number;
  name: string;
  category?: Category;
  tags?: Tag[];
  photoUrls: string[];
  status?: 'available' | 'pending' | 'sold';
}
