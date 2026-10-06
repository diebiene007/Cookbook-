import React, { useState, useEffect, useRef } from 'react';
import { RecipePageData, Season, Category } from './types/recipe';
import { BackgroundCategory, CustomBackground } from './types/backgrounds';
import { DEFAULT_RECIPES } from './data/defaultRecipes';
import { DEFAULT_BACKGROUND_CATEGORIES, DEFAULT_BACKGROUNDS, getDefaultBackgroundForSeason } from './data/defaultBackgrounds';
import { getPageBackgroundById, getDefaultPageBackgroundForSeason } from './data/recipePageBackgrounds';
import { runQualityAudit } from './utils/qualityCheck';
import { MasterRecipePage } from './components/MasterRecipePage';
import { DetailEditor } from './components/DetailEditor';
import { AssistantInputModal } from './components/AssistantInputModal';
import { QualityAuditDrawer } from './components/QualityAuditDrawer';
import { BackgroundManagerModal } from './components/BackgroundManagerModal';
import { PageMotifSelectorModal } from './components/PageMotifSelectorModal';
import { SeasonalPreviewLibrary } from './components/SeasonalPreviewLibrary';
import { ViewControls } from './components/ViewControls';
import {
  BookOpen,
  Plus,
  Copy,
  Trash2,
  ChevronDown,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Tablet,
  Printer,
  Edit3,
  Sliders,
  ShieldCheck,
  FileText,
  Palette,
} from 'lucide-react';

const STORAGE_KEY = 'rezepte_durchs_jahr_data_v1';
const BG_STORAGE_KEY = 'rezepte_durchs_jahr_backgrounds_v1';
const CAT_STORAGE_KEY = 'rezepte_durchs_jahr_categories_v1';

export default function App() {
  const [recipes, setRecipes] = useState<RecipePageData[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load stored recipes', e);
    }
    return DEFAULT_RECIPES;
  });

  const [backgroundCategories, setBackgroundCategories] = useState<BackgroundCategory[]>(() => {
    try {
      const stored = localStorage.getItem(CAT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load categories', e);
    }
    return DEFAULT_BACKGROUND_CATEGORIES;
  });

  const [backgrounds, setBackgrounds] = useState<CustomBackground[]>(() => {
    try {
      const stored = localStorage.getItem(BG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load backgrounds', e);
    }
    return DEFAULT_BACKGROUNDS;
  });

  const [currentRecipeId, setCurrentRecipeId] = useState<string>(
    DEFAULT_RECIPES[0].id
  );

  const [viewMode, setViewMode] = useState<'fit' | 'ipad' | 'actual'>('ipad');
  const [scale, setScale] = useState<number>(0.82);
  const [highlightBoxes, setHighlightBoxes] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isQualityDrawerOpen, setIsQualityDrawerOpen] = useState<boolean>(false);
  const [isBackgroundManagerOpen, setIsBackgroundManagerOpen] = useState<boolean>(false);
  const [isPageMotifModalOpen, setIsPageMotifModalOpen] = useState<boolean>(false);
  const [sidebarTab, setSidebarTab] = useState<'editor' | 'library' | 'rules'>('editor');

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    } catch (e) {
      console.error('Failed to save recipes to localStorage', e);
    }
  }, [recipes]);

  useEffect(() => {
    try {
      localStorage.setItem(BG_STORAGE_KEY, JSON.stringify(backgrounds));
    } catch (e) {
      console.error('Failed to save backgrounds to localStorage', e);
    }
  }, [backgrounds]);

  useEffect(() => {
    try {
      localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(backgroundCategories));
    } catch (e) {
      console.error('Failed to save categories to localStorage', e);
    }
  }, [backgroundCategories]);

  const currentRecipe =
    recipes.find(r => r.id === currentRecipeId) || recipes[0] || DEFAULT_RECIPES[0];

  const activePageBackground = getPageBackgroundById(
    currentRecipe.pageBackgroundId,
    currentRecipe.season
  );

  const activeBackground = (() => {
    if (currentRecipe.customBackgroundId) {
      const match = backgrounds.find(b => b.id === currentRecipe.customBackgroundId);
      // Valid if it matches the current recipe's season OR is neutral standard
      if (match && (match.season === currentRecipe.season || match.isNeutralDefault)) {
        return match;
      }
    }
    // Fallback: Default motif for the current season
    return (
      backgrounds.find(b => b.season === currentRecipe.season && b.isSeasonalDefault) ||
      getDefaultBackgroundForSeason(currentRecipe.season)
    );
  })();

  const qualityReport = runQualityAudit(currentRecipe);

  const handleAddCategory = (newCat: BackgroundCategory) => {
    setBackgroundCategories(prev => [...prev, newCat]);
  };

  const handleAddBackground = (newBg: CustomBackground) => {
    setBackgrounds(prev => [...prev, newBg]);
  };

  const handleDeleteBackground = (bgId: string) => {
    setBackgrounds(prev => prev.filter(b => b.id !== bgId));
    if (currentRecipe.customBackgroundId === bgId) {
      handleUpdateCurrentRecipe({ ...currentRecipe, customBackgroundId: undefined });
    }
  };

  const handleSelectBackground = (bgId: string) => {
    handleUpdateCurrentRecipe({ ...currentRecipe, customBackgroundId: bgId });
  };

  const handleApplyBackgroundToSeason = (season: Season, backgroundId: string) => {
    setRecipes(prev =>
      prev.map(r => (r.season === season ? { ...r, pageBackgroundId: backgroundId } : r))
    );
  };

  // Handle auto-fit scale calculation
  useEffect(() => {
    if (viewMode === 'fit') {
      const handleResize = () => {
        if (!canvasContainerRef.current) return;
        const container = canvasContainerRef.current;
        const availableHeight = container.clientHeight - 48; // padding
        const availableWidth = container.clientWidth - 48;
        const pageHeight = 1123;
        const pageWidth = 794;

        const scaleH = availableHeight / pageHeight;
        const scaleW = availableWidth / pageWidth;
        const bestScale = Math.min(scaleH, scaleW, 1.1);
        setScale(Math.max(0.4, Number(bestScale.toFixed(2))));
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    } else if (viewMode === 'actual') {
      setScale(1.0);
    } else if (viewMode === 'ipad') {
      setScale(0.82); // Ideal rendering size for 13" iPad visual scale on standard desktop monitors
    }
  }, [viewMode]);

  const handleUpdateCurrentRecipe = (updated: RecipePageData) => {
    setRecipes(prev => prev.map(r => (r.id === updated.id ? updated : r)));
  };

  const handleApplyAssistantRecipe = (newRecipe: RecipePageData) => {
    setRecipes(prev => [newRecipe, ...prev]);
    setCurrentRecipeId(newRecipe.id);
  };

  const handleCreateNewBlankRecipe = () => {
    const newRecipe: RecipePageData = {
      id: `recipe-${Date.now()}`,
      title: 'NEUES SAISONREZEPT',
      season: 'Frühling',
      category: 'Hauptgerichte',
      tags: ['SCHNELL', 'MEAL PREP', 'HIGH PROTEIN', 'HERZHAFT'],
      photoUrl: DEFAULT_RECIPES[0].photoUrl,
      pageBackgroundId: getDefaultPageBackgroundForSeason('Frühling').id,
      quickFacts: {
        portions: '2 Portionen',
        activeTimeMin: 15,
        passiveTimeMin: 15,
        totalTimeMin: 30,
        utensils: 'Pfanne, Schneidebrett, Schüssel',
      },
      columnLeft: {
        groups: [
          {
            id: `g-${Date.now()}-1`,
            header: 'HAUPTKOMPONENTE',
            items: [
              { id: `i-${Date.now()}-1`, amount: '400 g', name: 'Hauptzutat' },
              { id: `i-${Date.now()}-2`, amount: '1 EL', name: 'Olivenöl' },
              { id: `i-${Date.now()}-3`, amount: '1 Prise', name: 'Salz & Pfeffer' },
            ],
          },
        ],
      },
      columnRight: {
        groups: [
          {
            id: `g-${Date.now()}-2`,
            header: 'BEILAGE & FINISH',
            items: [
              { id: `i-${Date.now()}-4`, amount: '200 g', name: 'Gemüse' },
              { id: `i-${Date.now()}-5`, name: 'Frische Kräuter & Zitrone', isGarnishCompact: true },
            ],
          },
        ],
      },
      steps: [
        { id: `s-${Date.now()}-1`, stepNumber: 1, title: 'VORBEREITUNG', text: 'Zutaten waschen und griffbereit schneiden.' },
        { id: `s-${Date.now()}-2`, stepNumber: 2, title: 'WÜRZEN', text: 'Hauptzutat mit Gewürzen und Öl vermengen.' },
        { id: `s-${Date.now()}-3`, stepNumber: 3, title: 'ANBRATEN', text: 'In einer heißen Pfanne rundherum goldbraun anbraten.' },
        { id: `s-${Date.now()}-4`, stepNumber: 4, title: 'GAREN', text: 'Bei reduzierter Hitze bis zum gewünschten Garpunkt ziehen lassen.' },
        { id: `s-${Date.now()}-5`, stepNumber: 5, title: 'ANRICHTEN', text: 'Harmonisch auf Tellern oder in Bowls anrichten.' },
        { id: `s-${Date.now()}-6`, stepNumber: 6, title: 'FINISH', text: 'Mit frischen Kräutern toppen und warm servieren.' },
      ],
      masterVariant: 6,
      nutrition: {
        calories: 460,
        carbs: 38,
        protein: 36,
        fat: 14,
      },
      watchOutTip: 'Garzeit nicht überziehen, um optimale Saftigkeit zu gewährleisten.',
      source: '',
      footerText: 'REZEPTE DURCHS JAHR',
    };

    setRecipes(prev => [newRecipe, ...prev]);
    setCurrentRecipeId(newRecipe.id);
  };

  const handleDuplicateCurrentRecipe = () => {
    const copy: RecipePageData = {
      ...JSON.parse(JSON.stringify(currentRecipe)),
      id: `recipe-copy-${Date.now()}`,
      title: `${currentRecipe.title} (KOPIE)`,
    };
    setRecipes(prev => [copy, ...prev]);
    setCurrentRecipeId(copy.id);
  };

  const handleDeleteCurrentRecipe = () => {
    if (recipes.length <= 1) {
      alert('Das letzte Rezept kann nicht gelöscht werden.');
      return;
    }
    const remaining = recipes.filter(r => r.id !== currentRecipe.id);
    setRecipes(remaining);
    setCurrentRecipeId(remaining[0].id);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(recipes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Rezepte_durchs_Jahr_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
          try {
            const parsed = JSON.parse(ev.target?.result as string);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setRecipes(parsed);
              setCurrentRecipeId(parsed[0].id);
            }
          } catch (err) {
            alert('Ungültige JSON-Datei.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-[#141210] text-[#eae2d8] flex flex-col font-sans select-none antialiased">
      {/* ────────────────────────────────────────────────────────
          TOP APP HEADER
          ──────────────────────────────────────────────────────── */}
      <header className="no-print bg-[#1d1917] border-b border-[#312a23] px-5 py-3 flex items-center justify-between shrink-0 z-40">
        {/* Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#c46637] text-white flex items-center justify-center font-brand font-bold text-lg shadow-md shadow-[#c46637]/30 shrink-0">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-editorial-title font-bold text-base text-[#f5eee6] tracking-wide">
                Rezepte durchs Jahr
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#342a22] border border-[#483a2e] text-[10px] uppercase tracking-wider text-[#d97d4f] font-semibold">
                Produktionsassistent
              </span>
            </div>
            <p className="text-[11px] text-[#9c8e82]">
              Verbindliche A4-Mastervorlage (#FFF7F0) · 4 Tags · Zweispaltig · 100% Locked Template
            </p>
          </div>
        </div>

        {/* Recipe Selector Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={currentRecipe.id}
              onChange={e => setCurrentRecipeId(e.target.value)}
              className="bg-[#24201c] hover:bg-[#2b2520] border border-[#3b332a] focus:border-[#c46637] rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-[#f5eee6] uppercase tracking-wider appearance-none cursor-pointer outline-hidden"
            >
              {recipes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.season.toUpperCase()} · {r.title} ({r.masterVariant}er Vorlage)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8e8074] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={handleCreateNewBlankRecipe}
            className="p-1.5 rounded-xl bg-[#29221d] hover:bg-[#342b23] border border-[#3b322a] text-[#ded3c8] hover:text-[#f5eee6] transition-colors"
            title="Neues leeres Rezept anlegen"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={handleDuplicateCurrentRecipe}
            className="p-1.5 rounded-xl bg-[#29221d] hover:bg-[#342b23] border border-[#3b322a] text-[#ded3c8] hover:text-[#f5eee6] transition-colors"
            title="Aktuelles Rezept duplizieren"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={handleDeleteCurrentRecipe}
            className="p-1.5 rounded-xl bg-[#29221d] hover:bg-[#3d2422] border border-[#3b322a] hover:border-rose-800 text-[#ded3c8] hover:text-rose-300 transition-colors"
            title="Aktuelles Rezept löschen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ────────────────────────────────────────────────────────
          VIEW CONTROLS TOOLBAR
          ──────────────────────────────────────────────────────── */}
      <ViewControls
        viewMode={viewMode}
        onSetViewMode={setViewMode}
        scale={scale}
        onSetScale={setScale}
        highlightBoxes={highlightBoxes}
        onToggleHighlightBoxes={() => setHighlightBoxes(!highlightBoxes)}
        qualityReport={qualityReport}
        onOpenQualityDrawer={() => setIsQualityDrawerOpen(true)}
        onOpenAssistantModal={() => setIsAssistantOpen(true)}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onOpenPageMotifSelector={() => setIsPageMotifModalOpen(true)}
        activeMotifName={activePageBackground.name}
      />

      {/* ────────────────────────────────────────────────────────
          MAIN WORKSPACE (SPLIT: EDITOR / AUDIT LEFT, MASTER A4 RIGHT)
          ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Detail Editor, Library, Rules */}
        <aside className="no-print w-[410px] xl:w-[440px] shrink-0 border-r border-[#312a23] bg-[#171513] flex flex-col z-20 overflow-hidden shadow-xl">
          {/* Sidebar Top Nav Tabs */}
          <div className="flex border-b border-[#2d261f] bg-[#1d1917] p-1.5 gap-1 text-xs">
            <button
              onClick={() => setSidebarTab('editor')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-colors ${
                sidebarTab === 'editor'
                  ? 'bg-[#29221c] text-[#f5eee6] shadow-xs border border-[#3b3229]'
                  : 'text-[#8e8074] hover:text-[#e8ded5]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-[#c46637]" />
              <span>Detail-Editor</span>
            </button>

            <button
              onClick={() => setSidebarTab('library')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-colors ${
                sidebarTab === 'library'
                  ? 'bg-[#29221c] text-[#f5eee6] shadow-xs border border-[#3b3229]'
                  : 'text-[#8e8074] hover:text-[#e8ded5]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#c46637]" />
              <span>Bibliothek ({recipes.length})</span>
            </button>

            <button
              onClick={() => setSidebarTab('rules')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-colors ${
                sidebarTab === 'rules'
                  ? 'bg-[#29221c] text-[#f5eee6] shadow-xs border border-[#3b3229]'
                  : 'text-[#8e8074] hover:text-[#e8ded5]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#c46637]" />
              <span>Richtlinien</span>
            </button>
          </div>

          {/* Sidebar Tab Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {sidebarTab === 'editor' && (
              <DetailEditor
                recipe={currentRecipe}
                onChange={handleUpdateCurrentRecipe}
                backgrounds={backgrounds}
                categories={backgroundCategories}
                onOpenBackgroundManager={() => setIsBackgroundManagerOpen(true)}
              />
            )}

            {sidebarTab === 'library' && (
              <SeasonalPreviewLibrary
                recipes={recipes}
                currentRecipeId={currentRecipe.id}
                onSelectRecipe={id => setCurrentRecipeId(id)}
                backgrounds={backgrounds}
                backgroundCategories={backgroundCategories}
                onApplyBackgroundToSeason={handleApplyBackgroundToSeason}
                onOpenBackgroundManager={() => setIsBackgroundManagerOpen(true)}
              />
            )}

            {sidebarTab === 'rules' && (
              <div className="space-y-3.5 text-xs text-[#baa99b] p-1">
                <div className="bg-[#24201c] p-3 rounded-xl border border-[#362e26] space-y-1.5">
                  <h4 className="font-bold text-[#f5eee6] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#c46637]" />
                    Locked Master-Template (§1)
                  </h4>
                  <p className="text-[11px] leading-relaxed">
                    Format: A4 Hochformat (210 × 297 mm). Grundhintergrund: <strong className="text-[#f5eee6]">#FFF7F0</strong>.
                    Kein neues Layout erfinden. Schriftarten, Boxen, Abstände und Hierarchie bleiben fest verankert.
                  </p>
                </div>

                <div className="bg-[#24201c] p-3 rounded-xl border border-[#362e26] space-y-1.5">
                  <h4 className="font-bold text-[#f5eee6] uppercase tracking-wider text-[11px]">
                    Schrittvarianten (§8)
                  </h4>
                  <ul className="space-y-1 text-[11px] list-disc list-inside">
                    <li>1–6 Schritte → <strong>6er Vorlage</strong></li>
                    <li>7–8 Schritte → <strong>8er Vorlage</strong></li>
                    <li>9–10 Schritte → <strong>10er Vorlage</strong></li>
                    <li>11–12 Schritte → <strong>12er Vorlage</strong></li>
                    <li>Maximal 12 Schritte. Immer kleinste Variante wählen.</li>
                  </ul>
                </div>

                <div className="bg-[#24201c] p-3 rounded-xl border border-[#362e26] space-y-1.5">
                  <h4 className="font-bold text-[#f5eee6] uppercase tracking-wider text-[11px]">
                    Zutaten-Aufteilung (§7)
                  </h4>
                  <p className="text-[11px] leading-relaxed">
                    Niemals unstrukturierter Fließtext. Aufteilung nach logischen Komponenten mit kurzen Versalien-Headern (z.B. CHICKEN GYROS, ZUM FÜLLEN, EXTRAS). Beide Spalten optisch ausgewogen halten.
                  </p>
                </div>

                <div className="bg-[#24201c] p-3 rounded-xl border border-[#362e26] space-y-1.5">
                  <h4 className="font-bold text-[#f5eee6] uppercase tracking-wider text-[11px]">
                    Foto-Standards (§13 & §14)
                  </h4>
                  <p className="text-[11px] leading-relaxed">
                    1:1 quadratisch. Nur das fertige Gericht im warmen editorialen Licht. Keine Typografie, keine Logos oder Labels im Foto. Zutaten müssen exakt mit dem Rezept übereinstimmen.
                  </p>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right Main Stage: Master Recipe Page Canvas */}
        <main
          ref={canvasContainerRef}
          className="flex-1 bg-[#12100e] overflow-auto flex items-start justify-center p-6 md:p-8 relative"
        >
          {/* iPad 13" Device Mockup Frame */}
          {viewMode === 'ipad' ? (
            <div className="flex flex-col items-center">
              {/* Device Frame */}
              <div className="relative rounded-[42px] bg-[#1f1d1b] p-6 shadow-2xl border-4 border-[#2b2724] ring-1 ring-white/10 flex flex-col items-center">
                {/* iPad camera pinhole */}
                <div className="w-2.5 h-2.5 rounded-full bg-[#0d0c0b] mb-4 border border-[#332e2a]"></div>

                {/* Screen bezel */}
                <div className="rounded-[18px] overflow-hidden shadow-inner bg-[#FFF7F0]">
                  <MasterRecipePage
                    recipe={currentRecipe}
                    scale={scale}
                    highlightBoxes={highlightBoxes}
                    background={activeBackground}
                  />
                </div>

                {/* iPad bottom home indicator bar */}
                <div className="w-32 h-1 bg-[#4a423b] rounded-full mt-4"></div>
              </div>

              <div className="text-[11px] text-[#8e8074] mt-3 font-medium flex items-center gap-1.5">
                <Tablet className="w-3.5 h-3.5 text-[#c46637]" />
                <span>Simulation: 13-Zoll iPad Pro Hochformat (Lesbarkeitsprüfung nach §2)</span>
              </div>
            </div>
          ) : (
            /* Direct Print / Scaled A4 Sheet */
            <div className="flex flex-col items-center">
              <div className="rounded-lg shadow-2xl overflow-hidden bg-[#FFF7F0] ring-1 ring-black/30">
                <MasterRecipePage
                  recipe={currentRecipe}
                  scale={scale}
                  highlightBoxes={highlightBoxes}
                  background={activeBackground}
                />
              </div>

              <div className="text-[11px] text-[#8e8074] mt-4 flex items-center gap-2">
                <span>A4 Hochformat (210 × 297 mm)</span>
                <span>·</span>
                <span className="font-mono">Skalierung: {Math.round(scale * 100)}%</span>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ────────────────────────────────────────────────────────
          MODALS & DRAWERS
          ──────────────────────────────────────────────────────── */}
      <AssistantInputModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onApplyRecipe={handleApplyAssistantRecipe}
      />

      <QualityAuditDrawer
        isOpen={isQualityDrawerOpen}
        onClose={() => setIsQualityDrawerOpen(false)}
        report={qualityReport}
        currentRecipe={currentRecipe}
        onUpdateRecipe={handleUpdateCurrentRecipe}
      />

      <BackgroundManagerModal
        isOpen={isBackgroundManagerOpen}
        onClose={() => setIsBackgroundManagerOpen(false)}
        categories={backgroundCategories}
        backgrounds={backgrounds}
        currentBackgroundId={currentRecipe.customBackgroundId}
        onSelectBackground={handleSelectBackground}
        onAddCategory={handleAddCategory}
        onAddBackground={handleAddBackground}
        onDeleteBackground={handleDeleteBackground}
      />

      <PageMotifSelectorModal
        isOpen={isPageMotifModalOpen}
        onClose={() => setIsPageMotifModalOpen(false)}
        season={currentRecipe.season}
        selectedBackgroundId={currentRecipe.pageBackgroundId}
        onSelectMotif={bgId =>
          handleUpdateCurrentRecipe({ ...currentRecipe, pageBackgroundId: bgId })
        }
      />
    </div>
  );
}
