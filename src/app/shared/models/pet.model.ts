import { Category } from './category.model';

export interface Pet {
  id?: number;
  name: string;
  category?: Category;
  photoUrls: string[];
  status?: 'available' | 'pending' | 'sold';
}
