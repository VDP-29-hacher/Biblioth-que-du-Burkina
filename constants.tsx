
import { Category, Book } from './types';

export const CATEGORIES = Object.values(Category);

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Les Soleils des Indépendances',
    author: 'Ahmadou Kourouma',
    category: Category.LIT,
    coverUrl: 'https://picsum.photos/seed/lit1/400/600',
    description: 'Un chef-d\'œuvre de la littérature africaine explorant les désillusions post-coloniales.',
    isPremium: false,
    pages: 250,
    language: 'Français'
  },
  {
    id: '2',
    title: 'Guide Pratique de l\'Agriculture au Sahel',
    author: 'Inoussa Kafando',
    category: Category.AGRI,
    coverUrl: 'https://picsum.photos/seed/agri1/400/600',
    description: 'Stratégies de culture du sésame et gestion de l\'eau en zone aride.',
    isPremium: true,
    pages: 120,
    language: 'Français'
  },
  {
    id: '3',
    title: 'Histoire du Burkina Faso',
    author: 'Roger Bila Kaboré',
    category: Category.ARTS,
    coverUrl: 'https://picsum.photos/seed/hist1/400/600',
    description: 'De l\'empire Mossi à la révolution de Thomas Sankara.',
    isPremium: false,
    pages: 350,
    language: 'Français'
  },
  {
    id: '4',
    title: 'Introduction à la Cybersécurité',
    author: 'Abdoulaye Traoré',
    category: Category.IT,
    coverUrl: 'https://picsum.photos/seed/it1/400/600',
    description: 'Protéger les infrastructures critiques en Afrique de l\'Ouest.',
    isPremium: true,
    pages: 280,
    language: 'Français'
  },
  {
    id: '5',
    title: 'Code Civil du Burkina Faso',
    author: 'Ministère de la Justice',
    category: Category.LAW,
    coverUrl: 'https://picsum.photos/seed/law1/400/600',
    description: 'Texte intégral révisé en 2024.',
    isPremium: false,
    pages: 500,
    language: 'Français'
  },
  {
    id: '6',
    title: 'Manier le Mooré au quotidien',
    author: 'Lassané Sawadogo',
    category: Category.EDUCATION,
    coverUrl: 'https://picsum.photos/seed/edu1/400/600',
    description: 'Méthode d\'apprentissage rapide de la langue mooré.',
    isPremium: false,
    pages: 150,
    language: 'Mooré'
  }
];

export const TRANSLATIONS = {
  fr: {
    welcome: "Bienvenue à la Bibliothèque Nationale",
    tagline: "Le savoir burkinabè à portée de clic.",
    searchPlaceholder: "Rechercher un livre, un auteur, un pôle...",
    premium: "Passer au Premium",
    free: "Espace Gratuit",
    myBooks: "Ma Bibliothèque",
    readingTime: "Temps de lecture restant",
    category: "Catégories",
  },
  mo: {
    welcome: "Kibare n be sebr-vẽenega zĩigẽ",
    tagline: "Burkĩna bãngrã tõnd nugẽ.",
    searchPlaceholder: "Bao sebre, sebr-gʋlsda...",
    premium: "Premium",
    free: "Gratuit",
    myBooks: "Mam sebr-zĩiga",
    readingTime: "Karem tẽem m lʋɩ",
    category: "Sull",
  }
};
