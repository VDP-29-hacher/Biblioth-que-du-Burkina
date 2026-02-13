
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  Library, 
  Search, 
  Bookmark, 
  Crown, 
  User as UserIcon, 
  Clock, 
  ChevronRight, 
  BookOpen, 
  AlertCircle,
  Menu,
  X,
  Languages,
  ArrowLeft
} from 'lucide-react';
import { Category, Book, User, Language } from './types';
import { MOCK_BOOKS, TRANSLATIONS, CATEGORIES } from './constants';
import { enhanceSearch, summarizeBook } from './geminiService';

// --- Context/State Helper ---
const INITIAL_USER: User = {
  id: 'user_1',
  name: 'Invité Faso',
  isPremium: false,
  readingTimeToday: 0,
  favorites: []
};

// --- Components ---

const Navbar = ({ user, setLanguage, currentLang }: { user: User, setLanguage: (l: Language) => void, currentLang: Language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-burkina-red rounded-lg flex items-center justify-center text-white font-bold">BF</div>
            <span className="text-xl font-bold tracking-tight hidden md:block">BIBLIO BURKINA</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-2">
              <button onClick={() => setLanguage('fr')} className={`px-2 py-1 text-xs rounded ${currentLang === 'fr' ? 'bg-burkina-green text-white' : 'bg-gray-100'}`}>FR</button>
              <button onClick={() => setLanguage('mo')} className={`px-2 py-1 text-xs rounded ${currentLang === 'mo' ? 'bg-burkina-green text-white' : 'bg-gray-100'}`}>MO</button>
            </div>
            
            <Link to="/search" className="text-gray-600 hover:text-burkina-green flex items-center gap-1">
              <Search size={20} />
              <span>Explorer</span>
            </Link>

            {!user.isPremium && (
              <Link to="/premium" className="flex items-center gap-1 bg-burkina-gold/20 text-yellow-800 px-3 py-1 rounded-full font-semibold border border-burkina-gold">
                <Crown size={18} />
                <span>Premium</span>
              </Link>
            )}

            <div className="flex items-center space-x-2 border-l pl-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon size={18} className="text-gray-500" />
              </div>
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-4 shadow-lg">
          <Link to="/search" className="block py-2 font-semibold">Explorer</Link>
          <Link to="/premium" className="block py-2 text-burkina-red font-bold">Devenir Premium</Link>
          <div className="flex gap-4">
             <button onClick={() => {setLanguage('fr'); setIsOpen(false)}} className="underline">Français</button>
             <button onClick={() => {setLanguage('mo'); setIsOpen(false)}} className="underline">Mooré</button>
          </div>
        </div>
      )}
    </nav>
  );
};

const BookCard = ({ book, onClick }: { book: Book, onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {book.isPremium && (
          <div className="absolute top-2 right-2 bg-burkina-gold text-white p-1 rounded-full shadow-lg">
            <Crown size={14} />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
           <button className="w-full bg-burkina-green text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2">
             <BookOpen size={16} /> Lire
           </button>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-sm line-clamp-1 text-gray-800">{book.title}</h3>
        <p className="text-xs text-gray-500 mb-1">{book.author}</p>
        <span className="inline-block px-2 py-0.5 bg-gray-100 text-[10px] rounded-full text-gray-600">
          {book.category}
        </span>
      </div>
    </div>
  );
};

// --- Pages ---

const HomePage = ({ user, currentLang }: { user: User, currentLang: Language }) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="relative overflow-hidden bg-burkina-green rounded-3xl p-8 md:p-12 mb-12 text-white">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {t.welcome}
          </h1>
          <p className="text-xl opacity-90 mb-8">{t.tagline}</p>
          <div className="flex flex-col sm:flex-row gap-4">
             <Link to="/search" className="bg-burkina-red hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all">
                Commencer à lire <ChevronRight />
             </Link>
             {!user.isPremium && (
               <Link to="/premium" className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-8 py-4 rounded-xl font-bold border border-white/50 flex items-center justify-center gap-2">
                 Explorer le Premium
               </Link>
             )}
          </div>
        </div>
        <div className="absolute top-0 right-0 h-full w-1/3 opacity-20 hidden md:block">
           <Library className="w-full h-full p-8" />
        </div>
      </div>

      {/* Metrics for Context */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Ouvrages', val: '150k+', color: 'text-burkina-green' },
          { label: 'Pôles', val: '11', color: 'text-burkina-red' },
          { label: 'Utilisateurs', val: '80k+', color: 'text-blue-600' },
          { label: 'Langues', val: '4', color: 'text-burkina-gold' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.val}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Featured Sections */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold">Nouveautés</h2>
            <p className="text-sm text-gray-500">Derniers ajouts à notre catalogue national</p>
          </div>
          <Link to="/search" className="text-burkina-green font-bold text-sm flex items-center hover:underline">
            Voir tout <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {MOCK_BOOKS.map(book => (
            <BookCard key={book.id} book={book} onClick={() => navigate(`/book/${book.id}`)} />
          ))}
        </div>
      </section>

      {/* Category Icons */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Explorez par Pôle</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <div 
              key={i} 
              onClick={() => navigate(`/search?cat=${encodeURIComponent(cat)}`)}
              className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-burkina-green hover:shadow-md cursor-pointer transition-all text-center"
            >
              <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-burkina-green">
                <Library size={24} />
              </div>
              <span className="text-xs font-semibold text-gray-700 leading-tight block">{cat}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const SearchPage = ({ user }: { user: User }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(MOCK_BOOKS);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (!val) {
      setResults(MOCK_BOOKS);
      return;
    }
    const filtered = MOCK_BOOKS.filter(b => 
      b.title.toLowerCase().includes(val.toLowerCase()) || 
      b.author.toLowerCase().includes(val.toLowerCase()) ||
      b.category.toLowerCase().includes(val.toLowerCase())
    );
    setResults(filtered);
  };

  const handleSmartSearch = async () => {
    if (!query) return;
    setIsEnhancing(true);
    const keywords = await enhanceSearch(query);
    setIsEnhancing(false);
    // Basic implementation: just toast keywords or filter by them
    console.log("Suggestions AI:", keywords);
    // In a real app, we'd query a backend with these
    handleSearch(keywords[0]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Moteur de Recherche Sémantique</h1>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Ex: 'dolo' ou 'agriculture sahel'..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-burkina-green focus:border-transparent outline-none shadow-sm"
            />
          </div>
          <button 
            onClick={handleSmartSearch}
            disabled={isEnhancing}
            className="bg-burkina-gold hover:bg-yellow-600 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isEnhancing ? "Analyse..." : "Optimiser (IA)"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {results.map(book => (
          <BookCard key={book.id} book={book} onClick={() => navigate(`/book/${book.id}`)} />
        ))}
      </div>
      {results.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-400" size={32} />
          </div>
          <p className="text-gray-500">Aucun document trouvé pour cette recherche.</p>
        </div>
      )}
    </div>
  );
};

const BookDetails = ({ user, updateReadingTime }: { user: User, updateReadingTime: (s: number) => void }) => {
  const navigate = useNavigate();
  const bookId = window.location.hash.split('/').pop();
  const book = MOCK_BOOKS.find(b => b.id === bookId);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    if (book) {
      setIsLoadingSummary(true);
      summarizeBook(book.title, book.author).then(res => {
        setSummary(res);
        setIsLoadingSummary(false);
      });
    }
  }, [book]);

  if (!book) return <div className="p-20 text-center">Livre introuvable</div>;

  const handleRead = () => {
    if (book.isPremium && !user.isPremium) {
      navigate('/premium');
      return;
    }
    navigate(`/reader/${book.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-black mb-8">
        <ArrowLeft size={20} /> Retour
      </button>

      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-gray-50 p-8 flex items-center justify-center">
           <img src={book.coverUrl} className="w-full rounded-lg shadow-2xl max-w-[240px]" alt={book.title} />
        </div>
        <div className="md:w-2/3 p-8 md:p-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-burkina-green/10 text-burkina-green rounded-full text-xs font-bold">{book.category}</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">{book.language}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-lg text-gray-500 mb-6">Par {book.author}</p>
          
          <div className="flex gap-4 mb-8">
            <button 
              onClick={handleRead}
              className="flex-grow bg-burkina-red hover:bg-red-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {book.isPremium && !user.isPremium ? <Crown /> : <BookOpen />}
              {book.isPremium && !user.isPremium ? "Débloquer avec Premium" : "Commencer la lecture"}
            </button>
            <button className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <Bookmark />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 border-b pb-2 mb-3">Résumé de l'œuvre</h3>
              <p className="text-gray-600 leading-relaxed">{book.description}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                 <Search size={18} className="text-burkina-green" /> Aperçu intelligent par IA
              </h3>
              <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 italic text-sm text-green-800 min-h-[60px]">
                {isLoadingSummary ? "L'intelligence artificielle analyse le contenu..." : summary}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 border-t pt-4">
              <div>Pages: <span className="font-semibold text-gray-800">{book.pages}</span></div>
              <div>Format: <span className="font-semibold text-gray-800">EPUB3 / PDF</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Reader = ({ user, updateReadingTime }: { user: User, updateReadingTime: (s: number) => void }) => {
  const navigate = useNavigate();
  const bookId = window.location.hash.split('/').pop();
  const book = MOCK_BOOKS.find(b => b.id === bookId);
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800 - user.readingTimeToday); // 30 min limit

  useEffect(() => {
    if (!user.isPremium) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          updateReadingTime(1);
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [user.isPremium]);

  if (!book) return null;
  if (!user.isPremium && timeLeft <= 0) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <AlertCircle size={64} className="text-burkina-red mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Temps de lecture épuisé</h2>
          <p className="text-gray-600 mb-8">En tant qu'utilisateur gratuit, votre session est limitée à 30 minutes par jour. Pour lire sans limite, passez au Premium pour seulement 2 000 FCFA / mois.</p>
          <div className="flex flex-col gap-3">
            <Link to="/premium" className="bg-burkina-green text-white py-3 rounded-xl font-bold shadow-lg">Devenir Premium</Link>
            <button onClick={() => navigate('/')} className="text-gray-500 hover:underline">Retour à l'accueil</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? 'bg-zinc-900 text-gray-200' : 'bg-white text-gray-900'}`}>
      {/* Reader Header */}
      <header className={`px-4 h-16 flex justify-between items-center border-b ${isDarkMode ? 'border-zinc-800' : 'border-gray-100'}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full"><ArrowLeft /></button>
          <div>
            <h2 className="font-bold text-sm line-clamp-1">{book.title}</h2>
            {!user.isPremium && (
              <div className="flex items-center gap-1 text-[10px] text-burkina-red font-bold uppercase tracking-wider">
                <Clock size={12} /> {Math.floor(timeLeft / 60)}m {timeLeft % 60}s restants
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 border rounded-lg">{isDarkMode ? 'Mode Jour' : 'Mode Nuit'}</button>
          <button onClick={() => setFontSize(f => Math.min(24, f + 2))} className="p-2 border rounded-lg">A+</button>
          <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className="p-2 border rounded-lg">A-</button>
        </div>
      </header>

      {/* Reader Content */}
      <main className="flex-grow overflow-y-auto p-4 md:p-12 relative select-none" style={{ fontSize: `${fontSize}px` }}>
        {/* Anti-copy watermark */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] flex flex-wrap gap-20 overflow-hidden text-2xl font-bold select-none rotate-12">
          {Array(50).fill(user.name).map((n, i) => <span key={i}>{n} - {user.id}</span>)}
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-extrabold text-center mb-12">{book.title}</h1>
          <p>
            Ceci est un environnement de lecture sécurisé. Le téléchargement est désactivé conformément à la stratégie nationale de protection des droits d'auteur (Loi n°034-2023).
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center italic text-gray-400">
            [Illustration du document - Protégée]
          </div>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="py-12 text-center text-gray-400 italic">
            Page {currentPage} de {book.pages}
          </div>
        </div>
      </main>

      {/* Reader Footer */}
      <footer className={`px-4 h-16 flex justify-between items-center border-t ${isDarkMode ? 'border-zinc-800' : 'border-gray-100'}`}>
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="p-2 px-4 bg-gray-100 dark:bg-zinc-800 rounded-lg font-bold">Précédent</button>
        <div className="text-sm font-medium">Page {currentPage} / {book.pages}</div>
        <button onClick={() => setCurrentPage(p => Math.min(book.pages, p + 1))} className="p-2 px-4 bg-gray-100 dark:bg-zinc-800 rounded-lg font-bold">Suivant</button>
      </footer>
    </div>
  );
};

const PremiumPage = ({ user, upgrade }: { user: User, upgrade: () => void }) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    // Mock payment flow
    alert("Redirection vers le portail de paiement sécurisé (Orange Money / Moov Money / Carte)...");
    upgrade();
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-burkina-gold rounded-full text-white mb-6 shadow-xl">
           <Crown size={40} />
        </div>
        <h1 className="text-4xl font-extrabold mb-4">Bibliothèque Premium</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Soutenez la culture nationale et accédez à l'intégralité du savoir sans limites.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm opacity-60">
           <h3 className="text-2xl font-bold mb-4">Espace Gratuit</h3>
           <ul className="space-y-4 mb-8">
             <li className="flex gap-2">❌ 30 min / jour seulement</li>
             <li className="flex gap-2">❌ Catalogue restreint (40%)</li>
             <li className="flex gap-2">❌ Publicités discrètes</li>
             <li className="flex gap-2">❌ Pas de mode hors ligne</li>
           </ul>
           <button disabled className="w-full py-4 bg-gray-200 text-gray-500 rounded-xl font-bold">Actuel</button>
        </div>

        <div className="bg-white p-8 rounded-3xl border-2 border-burkina-green shadow-xl relative scale-105">
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-burkina-green text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Recommandé</div>
           <h3 className="text-2xl font-bold mb-4">Premium Illimité</h3>
           <ul className="space-y-4 mb-8">
             <li className="flex gap-2">✅ Temps de lecture ILLIMITÉ</li>
             <li className="flex gap-2">✅ Catalogue complet (150k+ docs)</li>
             <li className="flex gap-2">✅ ZÉRO Publicité</li>
             <li className="flex gap-2">✅ Mode hors ligne (50 pages cache)</li>
             <li className="flex gap-2">✅ Annotations synchronisées</li>
           </ul>
           <div className="mb-8">
             <div className="text-4xl font-extrabold text-burkina-green">2 000 FCFA <span className="text-lg font-normal text-gray-500">/ mois</span></div>
             <div className="text-sm text-gray-400">ou 20 000 FCFA / an (-16%)</div>
           </div>
           <button onClick={handleUpgrade} className="w-full py-4 bg-burkina-green hover:bg-green-700 text-white rounded-xl font-bold shadow-lg transition-all">S'abonner maintenant</button>
        </div>
      </div>

      <div className="bg-gray-100 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
         <div className="flex-grow">
           <h4 className="text-lg font-bold mb-2">Partenariats Institutionnels</h4>
           <p className="text-sm text-gray-600">Vous êtes une université ou un lycée ? Accès groupé via l'ENT de l'UVS, UNB, etc.</p>
         </div>
         <button className="whitespace-nowrap bg-white text-gray-900 px-6 py-3 rounded-xl border border-gray-200 font-bold hover:shadow-md transition-all">Contacter le support</button>
      </div>
    </div>
  );
};

// --- App Shell ---

function App() {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [lang, setLang] = useState<Language>('fr');

  const updateReadingTime = (seconds: number) => {
    setUser(prev => ({ ...prev, readingTimeToday: prev.readingTimeToday + seconds }));
  };

  const upgradeToPremium = () => {
    setUser(prev => ({ ...prev, isPremium: true }));
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar user={user} setLanguage={setLang} currentLang={lang} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage user={user} currentLang={lang} />} />
            <Route path="/search" element={<SearchPage user={user} />} />
            <Route path="/book/:id" element={<BookDetails user={user} updateReadingTime={updateReadingTime} />} />
            <Route path="/reader/:id" element={<Reader user={user} updateReadingTime={updateReadingTime} />} />
            <Route path="/premium" element={<PremiumPage user={user} upgrade={upgradeToPremium} />} />
          </Routes>
        </main>

        <footer className="bg-white border-t py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-burkina-red rounded-lg flex items-center justify-center text-white font-bold">BF</div>
                <span className="text-lg font-bold">Biblio Burkina</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Plateforme Numérique Nationale Centralisée.<br/>
                Propulsé par le Ministère de l'Enseignement Supérieur, de la Recherche et de l'Innovation.<br/>
                &copy; 2026 Tous droits réservés.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-sm uppercase">Navigation</h5>
              <ul className="text-sm text-gray-500 space-y-2">
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/search">Explorer</Link></li>
                <li><Link to="/premium">Premium</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-sm uppercase">Juridique</h5>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>Propriété Intellectuelle</li>
                <li>Protection des Données (RGPD)</li>
                <li>Conditions d'Utilisation</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-sm uppercase">Partenaires</h5>
              <div className="grid grid-cols-2 gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                <div className="h-10 bg-gray-200 rounded flex items-center justify-center text-[10px]">MESRI</div>
                <div className="h-10 bg-gray-200 rounded flex items-center justify-center text-[10px]">UVS</div>
                <div className="h-10 bg-gray-200 rounded flex items-center justify-center text-[10px]">AUF</div>
                <div className="h-10 bg-gray-200 rounded flex items-center justify-center text-[10px]">World Bank</div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
