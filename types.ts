
export enum Category {
  EDUCATION = 'Éducation & Pédagogie',
  SCIENCE = 'Sciences & Technologies',
  IT = 'Informatique & Numérique',
  HEALTH = 'Médecine & Santé',
  LAW = 'Droit & Sciences Politiques',
  ECON = 'Économie & Gestion',
  AGRI = 'Agriculture & Environnement',
  LIT = 'Lettres & Littérature',
  SOCIAL = 'Sciences Sociales',
  ARTS = 'Arts & Culture',
  RELIGION = 'Religion & Philosophie'
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  coverUrl: string;
  description: string;
  isPremium: boolean;
  pages: number;
  language: 'Français' | 'Mooré' | 'Dioula' | 'Fulfuldé';
}

export interface User {
  id: string;
  name: string;
  isPremium: boolean;
  readingTimeToday: number; // in seconds
  favorites: string[];
}

export type Language = 'fr' | 'mo' | 'di' | 'fu';
