import React, { useState } from 'react';
import { RecipePageData, Season } from '../types/recipe';
import { CustomBackground, BackgroundCategory } from '../types/backgrounds';
import { getSeasonTagStyle } from '../utils/seasonTagTheme';
import {
  Grid,
  List,
  CheckCircle2,
  AlertCircle,
  Palette,
  Sparkles,
  ArrowRight,
  Sliders,
  Check,
} from 'lucide-react';

interface SeasonalPreviewLibraryProps {
  recipes: RecipePageData[];
  currentRecipeId: string;
  onSelectRecipe: (id: string) => void;
  backgrounds: CustomBackground[];
  backgroundCategories: BackgroundCategory[];
  onApplyBackgroundToSeason: (season: Season, backgroundId: string) => void;
  onOpenBackgroundManager?: () => void;
}

const SEASONS: Season[] = ['Frühling', 'Sommer', 'Herbst', 'Winter', 'Zeitlos'];

export const SeasonalPreviewLibrary: React.FC<SeasonalPreviewLibraryProps> = ({
  recipes,
  currentRecipeId,
  onSelectRecipe,
  backgrounds,
  backgroundCategories,
  onApplyBackgroundToSeason,
  onOpenBackgroundManager,
}) => {
  const [libraryMode, setLibraryMode] = useState<'seasonal-preview' | 'list'>('seasonal-preview');
  const [selectedSeasonFilter, setSelectedSeasonFilter] = useState<string>('Alle');

  const getBackgroundForRecipe = (recipe: RecipePageData): CustomBackground => {
    return (
      backgrounds.find(b => b.id === recipe.customBackgroundId) ||
      backgrounds.find(b => b.isNeutralDefault) ||
      backgrounds[0]
    );
  };

  const getSeasonCategory = (season: Season): BackgroundCategory | undefined => {
    const key = season.toLowerCase().replace('ü', 'ue');
    return backgroundCategories.find(c => c.id.toLowerCase().includes(key) || c.label.includes(season));
  };

  const getAvailableBackgroundsForSeason = (season: Season): CustomBackground[] => {
    const cat = getSeasonCategory(season);
    if (!cat) return backgrounds;
    const seasonBgs = backgrounds.filter(b => b.categoryId === cat.id);
    return seasonBgs.length > 0 ? seasonBgs : backgrounds;
  };

  return (
    <div className="space-y-3.5 text-xs">
      {/* Mode Switcher: Seasonal Preview vs Classic List */}
      <div className="bg-[#211d19] p-1 rounded-xl border border-[#342b23] flex items-center gap-1">
        <button
          onClick={() => setLibraryMode('seasonal-preview')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5 font-semibold text-[11px] transition-all cursor-pointer ${
            libraryMode === 'seasonal-preview'
              ? 'bg-[#c46637] text-white shadow-xs'
              : 'text-[#9c8e82] hover:text-[#f5eee6]'
          }`}
          title="Saisonaler Vorschau-Modus: Gruppierung nach Jahreszeit & Hintergrund-Stil"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Saisonale Vorschau</span>
        </button>

        <button
          onClick={() => setLibraryMode('list')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5 font-semibold text-[11px] transition-all cursor-pointer ${
            libraryMode === 'list'
              ? 'bg-[#c46637] text-white shadow-xs'
              : 'text-[#9c8e82] hover:text-[#f5eee6]'
          }`}
          title="Kompakte Listenansicht"
        >
          <List className="w-3.5 h-3.5" />
          <span>Listenansicht</span>
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────
          MODE 1: SAISONALER VORSCHAU-MODUS (VISUELLER ZUSAMMENHALT)
          ──────────────────────────────────────────────────────── */}
      {libraryMode === 'seasonal-preview' ? (
        <div className="space-y-4">
          <div className="px-1 text-[11px] text-[#9c8e82] flex items-center justify-between">
            <span>Visueller Zusammenhalt & Kulissen-Abstimmung</span>
            {onOpenBackgroundManager && (
              <button
                onClick={onOpenBackgroundManager}
                className="text-[#c46637] hover:underline flex items-center gap-1 text-[10.5px]"
              >
                <Palette className="w-3 h-3" />
                Stile anpassen
              </button>
            )}
          </div>

          {SEASONS.map(season => {
            const seasonRecipes = recipes.filter(r => r.season === season);
            if (seasonRecipes.length === 0) return null;

            const categoryInfo = getSeasonCategory(season);
            const seasonBgs = getAvailableBackgroundsForSeason(season);

            // Cohesion check: check if all recipes in this season share the same background style
            const usedBgIds = Array.from(
              new Set(seasonRecipes.map(r => r.customBackgroundId || 'neutral-default'))
            );
            const isUniform = usedBgIds.length === 1 && usedBgIds[0] !== 'neutral-default';
            const isAllNeutral = usedBgIds.length === 1 && usedBgIds[0] === 'neutral-default';

            return (
              <div
                key={season}
                className="bg-[#1f1b18] border border-[#362e26] rounded-2xl p-3.5 space-y-3 shadow-md"
              >
                {/* Season Section Header */}
                <div className="flex items-center justify-between border-b border-[#2d261f] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: categoryInfo?.accentColor || '#c46637' }}
                    />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#f5eee6] font-editorial-sans">
                      {season}
                    </h3>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#2a241f] text-[#cfc0b2] font-semibold">
                      {seasonRecipes.length} {seasonRecipes.length === 1 ? 'Rezept' : 'Rezepte'}
                    </span>
                  </div>

                  {/* Harmony status badge */}
                  <div className="flex items-center gap-1 text-[10px]">
                    {isUniform ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> 100% Harmonisch
                      </span>
                    ) : isAllNeutral ? (
                      <span className="text-[#a89789] bg-[#2a231d] px-2 py-0.5 rounded-full border border-[#3b3229]">
                        Neutraler Standard
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        <AlertCircle className="w-3 h-3" /> {usedBgIds.length} verschiedene Stile
                      </span>
                    )}
                  </div>
                </div>

                {/* Season Background Quick Harmonization */}
                {seasonBgs.length > 0 && (
                  <div className="bg-[#171412] p-2.5 rounded-xl border border-[#2b241d] flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[10px] text-[#8e8074]">
                      <span>Kulissen-Stil für Kapitel {season}:</span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                      {seasonBgs.map(bg => (
                        <button
                          key={bg.id}
                          onClick={() => onApplyBackgroundToSeason(season, bg.id)}
                          className="px-2 py-1 rounded-md bg-[#221e1a] hover:bg-[#2f2720] border border-[#382f26] text-[10px] text-[#ded3c8] hover:text-[#f5eee6] flex items-center gap-1.5 shrink-0 transition-colors"
                          title={`Allen ${seasonRecipes.length} ${season}-Rezepten den Hintergrund „${bg.name}“ zuweisen`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-sm shrink-0 border"
                            style={{
                              backgroundColor: bg.previewColor,
                              borderColor: bg.previewBorderColor || '#D5C4B4',
                            }}
                          />
                          <span className="truncate max-w-[120px]">{bg.name}</span>
                          <span className="text-[9px] text-[#c46637] font-semibold">Alle</span>
                        </button>
                      ))}

                      {/* Reset all to neutral button */}
                      <button
                        onClick={() => onApplyBackgroundToSeason(season, 'bg-neutral-standard')}
                        className="px-2 py-1 rounded-md bg-[#221e1a] hover:bg-[#2f2720] border border-[#382f26] text-[10px] text-[#8e8074] hover:text-[#ded3c8] shrink-0 transition-colors"
                        title={`Alle ${season}-Rezepte auf neutralen Standard setzen`}
                      >
                        Neutraler Standard
                      </button>
                    </div>
                  </div>
                )}

                {/* Visual Recipe Mini-Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {seasonRecipes.map(recipe => {
                    const isSelected = recipe.id === currentRecipeId;
                    const bg = getBackgroundForRecipe(recipe);

                    return (
                      <div
                        key={recipe.id}
                        onClick={() => onSelectRecipe(recipe.id)}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#2b231c] border-[#c46637] shadow-lg ring-1 ring-[#c46637]'
                            : 'bg-[#181513] border-[#312921] hover:border-[#4d3e32]'
                        }`}
                      >
                        <div>
                          {/* 1:1 Thumbnail Frame with styled border and background */}
                          <div
                            className="aspect-square w-full rounded-lg overflow-hidden shadow-inner mb-2 border relative"
                            style={{
                              backgroundColor: bg.previewColor || '#F0E5D9',
                              borderColor: bg.previewBorderColor || '#E5D7CA',
                            }}
                          >
                            {recipe.photoUrl ? (
                              <img
                                src={recipe.photoUrl}
                                alt={recipe.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-[#8C7A6D]">
                                Kein Foto
                              </div>
                            )}

                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-[#c46637] text-white text-[9px] font-bold shadow-xs">
                                Aktiv
                              </div>
                            )}
                          </div>

                          {/* Recipe Title & Variant */}
                          <div className="font-editorial-serif font-bold uppercase text-[12px] text-[#f5eee6] leading-tight mb-1 truncate">
                            {recipe.title}
                          </div>

                          <div className="text-[10px] text-[#9c8e82] flex items-center justify-between mb-1.5">
                            <span>{recipe.category}</span>
                            <span className="text-[#c46637] font-semibold">{recipe.masterVariant}er Vorlage</span>
                          </div>

                          {/* Seasonal Left-to-Right Gradient Tags */}
                          <div className="flex flex-wrap gap-1 mb-1.5 overflow-hidden">
                            {recipe.tags.slice(0, 2).map((t, tIdx) => (
                              <span
                                key={tIdx}
                                style={getSeasonTagStyle(recipe.season)}
                                className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full border truncate max-w-[85px]"
                              >
                                {t}
                              </span>
                            ))}
                            {recipe.tags.length > 2 && (
                              <span className="text-[8px] text-[#8e8074] self-center">
                                +{recipe.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Background Identity Badge */}
                        <div
                          className="pt-1.5 border-t border-[#26201a] flex items-center gap-1.5 text-[9.5px] truncate"
                          title={`Hintergrund: ${bg.name}`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-xs shrink-0 border"
                            style={{
                              backgroundColor: bg.previewColor,
                              borderColor: bg.previewBorderColor || '#D5C4B4',
                            }}
                          />
                          <span className="text-[#baa99b] truncate">{bg.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ────────────────────────────────────────────────────────
            MODE 2: KLASSISCHE LISTENANSICHT
            ──────────────────────────────────────────────────────── */
        <div className="space-y-3">
          {/* Season Filter chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {['Alle', 'Frühling', 'Sommer', 'Herbst', 'Winter', 'Zeitlos'].map(s => (
              <button
                key={s}
                onClick={() => setSelectedSeasonFilter(s)}
                className={`px-2 py-1 rounded-lg text-[10.5px] font-semibold uppercase tracking-wider shrink-0 transition-colors ${
                  selectedSeasonFilter === s
                    ? 'bg-[#c46637] text-white'
                    : 'bg-[#211d1a] text-[#8e8074] hover:text-[#f5eee6]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* List Cards */}
          <div className="space-y-2">
            {recipes
              .filter(r => (selectedSeasonFilter === 'Alle' ? true : r.season === selectedSeasonFilter))
              .map(r => {
                const isSelected = r.id === currentRecipeId;
                const bg = getBackgroundForRecipe(r);

                return (
                  <div
                    key={r.id}
                    onClick={() => onSelectRecipe(r.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#2d251e] border-[#c46637] shadow-md'
                        : 'bg-[#1e1b18] border-[#342b23] hover:border-[#4d3f33]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-editorial-serif font-bold uppercase text-sm text-[#f5eee6] truncate">
                        {r.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#171412] text-[#c46637] font-semibold uppercase shrink-0">
                        {r.masterVariant}er Vorlage
                      </span>
                    </div>

                    <div className="text-[11px] text-[#9c8e82] flex items-center gap-1.5 mb-1.5">
                      <span className="font-semibold text-[#cfc0b2]">{r.season}</span>
                      <span>·</span>
                      <span>{r.category}</span>
                      <span>·</span>
                      <span>{r.quickFacts.totalTimeMin} Min</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-[#29221c]">
                      <div className="flex items-center gap-1.5 text-[#baa99b] truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-xs shrink-0 border"
                          style={{
                            backgroundColor: bg.previewColor,
                            borderColor: bg.previewBorderColor || '#D5C4B4',
                          }}
                        />
                        <span className="truncate max-w-[200px]">{bg.name}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {r.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#171412] text-[#8c7e73]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
