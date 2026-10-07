import React, { useState, useMemo } from 'react';
import { RecipePageData, Season, Category } from '../types/recipe';
import { getSeasonTagStyle } from '../utils/seasonTagTheme';
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  Copy,
  Clock,
  Flame,
  Check,
  X,
  ExternalLink,
  Filter,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface RecipeLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedRecipes: RecipePageData[];
  currentDraftId: string;
  onOpenRecipe: (recipe: RecipePageData) => void;
  onCreateNewRecipe: () => void;
  onDuplicateRecipe: (recipe: RecipePageData) => void;
  onDeleteRecipe: (recipeId: string) => void;
}

const SEASONS: (Season | 'Alle')[] = ['Alle', 'Frühling', 'Sommer', 'Herbst', 'Winter', 'Zeitlos'];

const CATEGORY_ORDER: Category[] = [
  'Frühstück & Bowls',
  'Hauptgerichte',
  'Snacks & Desserts',
  'Saucen & Basics',
  'Drinks',
];

export const RecipeLibraryModal: React.FC<RecipeLibraryModalProps> = ({
  isOpen,
  onClose,
  savedRecipes,
  currentDraftId,
  onOpenRecipe,
  onCreateNewRecipe,
  onDuplicateRecipe,
  onDeleteRecipe,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<Season | 'Alle'>('Alle');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Alle'>('Alle');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recipeToDelete, setRecipeToDelete] = useState<RecipePageData | null>(null);

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return savedRecipes.filter(recipe => {
      // 1. Season filter
      if (selectedSeason !== 'Alle' && recipe.season !== selectedSeason) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'Alle' && recipe.category !== selectedCategory) {
        return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = recipe.title.toLowerCase().includes(q);
        const inCategory = recipe.category.toLowerCase().includes(q);
        const inSeason = recipe.season.toLowerCase().includes(q);
        const inTags = recipe.tags.some(t => t.toLowerCase().includes(q));
        const inIngredientsLeft = recipe.columnLeft?.groups?.some(g =>
          g.items?.some(i => i.name.toLowerCase().includes(q))
        );
        const inIngredientsRight = recipe.columnRight?.groups?.some(g =>
          g.items?.some(i => i.name.toLowerCase().includes(q))
        );

        if (!inTitle && !inCategory && !inSeason && !inTags && !inIngredientsLeft && !inIngredientsRight) {
          return false;
        }
      }

      return true;
    });
  }, [savedRecipes, selectedSeason, selectedCategory, searchQuery]);

  // Group filtered recipes by Season, then Category
  const groupedSections = useMemo(() => {
    const seasonsToDisplay: Season[] =
      selectedSeason === 'Alle'
        ? ['Frühling', 'Sommer', 'Herbst', 'Winter', 'Zeitlos']
        : [selectedSeason];

    const result: {
      season: Season;
      categories: {
        category: Category;
        recipes: RecipePageData[];
      }[];
    }[] = [];

    for (const season of seasonsToDisplay) {
      const seasonRecipes = filteredRecipes.filter(r => r.season === season);
      if (seasonRecipes.length === 0) continue;

      const categoryGroups: { category: Category; recipes: RecipePageData[] }[] = [];

      for (const cat of CATEGORY_ORDER) {
        const catRecipes = seasonRecipes.filter(r => r.category === cat);
        if (catRecipes.length > 0) {
          categoryGroups.push({
            category: cat,
            recipes: catRecipes,
          });
        }
      }

      if (categoryGroups.length > 0) {
        result.push({
          season,
          categories: categoryGroups,
        });
      }
    }

    return result;
  }, [filteredRecipes, selectedSeason]);

  if (!isOpen) return null;

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Unbekannt';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none animate-in fade-in duration-150">
      <div
        className="bg-[#191614] border border-[#3b3228] rounded-2xl w-full max-w-6xl h-[92vh] max-h-[960px] shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#2d251e] bg-[#1d1916] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c46637] text-white flex items-center justify-center shadow-md shadow-[#c46637]/30 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#f5eee6] tracking-wide font-editorial-serif uppercase">
                  Rezeptbibliothek
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2a221b] border border-[#3d3228] text-[#c46637] font-semibold">
                  {savedRecipes.length} {savedRecipes.length === 1 ? 'Rezept' : 'Rezepte'} gespeichert
                </span>
              </div>
              <p className="text-[11px] text-[#9c8e82]">
                Alle fest gespeicherten Buchrezepte · Nach Saison &amp; Kategorie gegliedert
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onCreateNewRecipe();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#c46637] hover:bg-[#d6723e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#c46637]/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Neues Rezept</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#9c8e82] hover:text-[#f5eee6] hover:bg-[#2b241e] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 border-b border-[#2d251e] bg-[#161311] flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Season Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {SEASONS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSeason(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                  selectedSeason === s
                    ? 'bg-[#c46637] text-white shadow-xs'
                    : 'bg-[#221c18] hover:bg-[#2c241e] text-[#9c8e82] hover:text-[#f5eee6]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search Input & Category Filter */}
          <div className="flex items-center gap-2.5 flex-1 min-w-[280px] max-w-lg justify-end">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#8e8074] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rezepte durchsuchen (Titel, Zutaten, Tags)..."
                className="w-full bg-[#201b17] border border-[#3b3227] focus:border-[#c46637] rounded-xl pl-8 pr-7 py-1.5 text-xs text-[#f5eee6] placeholder-[#7d6f64] outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8e8074] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as Category | 'Alle')}
              className="bg-[#201b17] border border-[#3b3227] focus:border-[#c46637] rounded-xl px-2.5 py-1.5 text-xs text-[#ded3c8] outline-hidden cursor-pointer shrink-0"
            >
              <option value="Alle">Alle Kategorien</option>
              {CATEGORY_ORDER.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Library Content Workspace (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#141210]">
          {groupedSections.length === 0 ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#241e1a] border border-[#382e26] flex items-center justify-center text-[#8e8074]">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-[#f5eee6]">Keine Rezepte gefunden</h3>
              <p className="text-xs text-[#8e8074] max-w-sm">
                {searchQuery
                  ? `Kein Rezept entspricht dem Suchbegriff „${searchQuery}“.`
                  : 'In diesem Filterbereich sind aktuell keine Rezepte vorhanden.'}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1.5 rounded-lg bg-[#241e1a] hover:bg-[#32271f] text-xs text-[#c46637] font-semibold transition-colors"
                >
                  Suche zurücksetzen
                </button>
              )}
            </div>
          ) : (
            groupedSections.map(section => (
              <div key={section.season} className="space-y-6">
                {/* Season Title Header */}
                <div className="flex items-center gap-3 border-b border-[#2d251e] pb-2">
                  <span className="w-3 h-3 rounded-full bg-[#c46637]" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#f5eee6] font-editorial-serif">
                    {section.season}
                  </h3>
                  <span className="text-[10px] text-[#8e8074]">
                    ({section.categories.reduce((acc, cat) => acc + cat.recipes.length, 0)} Rezepte)
                  </span>
                </div>

                {/* Categories inside Season */}
                <div className="space-y-6 pl-1 sm:pl-3">
                  {section.categories.map(catGroup => (
                    <div key={catGroup.category} className="space-y-3">
                      {/* Category Label */}
                      <div className="flex items-center justify-between text-xs text-[#baa99b] font-semibold border-b border-[#26201a] pb-1">
                        <span className="uppercase tracking-wider">{catGroup.category}</span>
                        <span className="text-[10px] text-[#8e8074]">
                          {catGroup.recipes.length} {catGroup.recipes.length === 1 ? 'Eintrag' : 'Einträge'}
                        </span>
                      </div>

                      {/* Recipe Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {catGroup.recipes.map(recipe => {
                          const isCurrentActive = recipe.id === currentDraftId;

                          return (
                            <div
                              key={recipe.id}
                              className={`group bg-[#1c1815] border rounded-2xl p-3.5 transition-all flex flex-col justify-between hover:shadow-xl ${
                                isCurrentActive
                                  ? 'border-[#c46637] ring-1 ring-[#c46637]/50 shadow-md'
                                  : 'border-[#332a22] hover:border-[#4d3e31] hover:bg-[#201c18]'
                              }`}
                            >
                              <div>
                                {/* Photo & Badge Row */}
                                <div className="aspect-square w-full rounded-xl overflow-hidden bg-black/40 border border-[#362b22] relative mb-3">
                                  {recipe.photoUrl ? (
                                    <img
                                      src={recipe.photoUrl}
                                      alt={recipe.title}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover transition-transform group-hover:scale-102 duration-300"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-[#8e8074]">
                                      Kein Foto
                                    </div>
                                  )}

                                  {/* Season & Active Badge */}
                                  <div className="absolute top-2 left-2 flex items-center gap-1">
                                    <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-[9px] font-bold uppercase tracking-wider text-[#ded3c8] border border-white/10">
                                      {recipe.season}
                                    </span>
                                    {isCurrentActive && (
                                      <span className="px-2 py-0.5 rounded-md bg-[#c46637] text-white text-[9px] font-bold shadow-xs">
                                        Im Editor
                                      </span>
                                    )}
                                  </div>

                                  {/* Quick facts overlay */}
                                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] bg-black/75 backdrop-blur-xs px-2 py-1 rounded-lg border border-white/10 text-[#ded3c8]">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-[#c46637]" />
                                      {recipe.quickFacts?.totalTimeMin || 30} Min
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Flame className="w-3 h-3 text-amber-400" />
                                      {recipe.nutrition?.calories || 0} kcal
                                    </span>
                                  </div>
                                </div>

                                {/* Title & Category */}
                                <h4 className="font-editorial-serif font-bold uppercase text-sm text-[#f5eee6] leading-snug truncate mb-1" title={recipe.title}>
                                  {recipe.title}
                                </h4>

                                <div className="text-[11px] text-[#9c8e82] mb-2 truncate">
                                  {recipe.category} · {recipe.masterVariant}er Vorlage
                                </div>

                                {/* 4 Saisonal Gestylte Tags */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {recipe.tags?.map((t, idx) => (
                                    <span
                                      key={idx}
                                      style={getSeasonTagStyle(recipe.season)}
                                      className="text-[8.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border truncate max-w-[110px]"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Footer: Date & Actions */}
                              <div className="pt-2.5 border-t border-[#29221c] flex items-center justify-between text-[10px] text-[#8e8074]">
                                <span title={`Zuletzt gespeichert: ${recipe.savedAt || recipe.updatedAt}`}>
                                  {formatDate(recipe.savedAt || recipe.updatedAt)}
                                </span>

                                <div className="flex items-center gap-1.5">
                                  {/* Duplicate */}
                                  <button
                                    type="button"
                                    onClick={() => onDuplicateRecipe(recipe)}
                                    title="Rezept duplizieren"
                                    className="p-1.5 rounded-lg hover:bg-[#2e2620] text-[#9c8e82] hover:text-[#f5eee6] transition-colors cursor-pointer"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    type="button"
                                    onClick={() => setRecipeToDelete(recipe)}
                                    title="Rezept dauerhaft löschen"
                                    className="p-1.5 rounded-lg hover:bg-rose-950/40 text-[#8e8074] hover:text-rose-400 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Open in Editor */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onOpenRecipe(recipe);
                                      onClose();
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-[#2a221b] hover:bg-[#c46637] text-[#ded3c8] hover:text-white font-semibold text-[10.5px] transition-colors flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>Öffnen</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {recipeToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 select-none animate-in fade-in duration-150">
          <div className="bg-[#1f1b18] border border-[#3d3227] rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-800/40 text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[#f5eee6]">Rezept dauerhaft löschen?</h4>
                <p className="text-xs text-[#a09083] mt-1 truncate">
                  „{recipeToDelete.title}“
                </p>
                <p className="text-[11px] text-[#8e8074] mt-1">
                  Dieser Vorgang kann nicht rückgängig gemacht werden.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2d251e]">
              <button
                type="button"
                onClick={() => setRecipeToDelete(null)}
                className="px-3.5 py-1.5 rounded-xl bg-[#28211b] hover:bg-[#342b23] text-xs font-semibold text-[#ded3c8] transition-colors cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteRecipe(recipeToDelete.id);
                  setRecipeToDelete(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Endgültig löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
