import React, { useState, useEffect, useRef } from 'react';
import { RecipePageData, Season, Category } from './types/recipe';
import { BackgroundCategory, CustomBackground } from './types/backgrounds';
import { DEFAULT_RECIPES } from './data/defaultRecipes';
import { DEFAULT_BACKGROUND_CATEGORIES, DEFAULT_BACKGROUNDS, getDefaultBackgroundForSeason } from './data/defaultBackgrounds';
import { getPageBackgroundById, getDefaultPageBackgroundForSeason } from './data/recipePageBackgrounds';
import { runQualityAudit } from './utils/qualityCheck';
import {
  loadLibraryRecipes,
  persistLibraryRecipes,
  cloneRecipe,
} from './utils/libraryStorage';
import { MasterRecipePage } from './components/MasterRecipePage';
import { DetailEditor } from './components/DetailEditor';
import { AssistantInputModal } from './components/AssistantInputModal';
import { QualityAuditDrawer } from './components/QualityAuditDrawer';
import { BackgroundManagerModal } from './components/BackgroundManagerModal';
import { PageMotifSelectorModal } from './components/PageMotifSelectorModal';
import { SeasonalPreviewLibrary } from './components/SeasonalPreviewLibrary';
import { ViewControls } from './components/ViewControls';
import { RecipeLibraryModal } from './components/RecipeLibraryModal';
import { UnsavedChangesModal } from './components/UnsavedChangesModal';
import { SaveQualityConfirmModal } from './components/SaveQualityConfirmModal';
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
  Maximize2,
  Minimize2,
  Edit3,
  ShieldCheck,
  FileText,
  Palette,
  Save,
} from 'lucide-react';

const BG_STORAGE_KEY = 'rezepte_durchs_jahr_backgrounds_v1';
const CAT_STORAGE_KEY = 'rezepte_durchs_jahr_categories_v1';

export default function App() {
  // ─── 1. GESPEICHERTE BIBLIOTHEK (Dauerhafter Speicher) ─────
  const [savedRecipes, setSavedRecipes] = useState<RecipePageData[]>(() => {
    return loadLibraryRecipes();
  });

  // ─── 2. AKTUELLER ARBEITSSTAND (Draft im Editor) ─────────────
  const [draftRecipe, setDraftRecipe] = useState<RecipePageData>(() => {
    const initial = loadLibraryRecipes();
    return cloneRecipe(initial[0] || DEFAULT_RECIPES[0]);
  });

  // ─── 3. DIRTY STATE MANAGEMENT ──────────────────────────────
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Navigation Guard State
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState<boolean>(false);
  const [pendingNavigationAction, setPendingNavigationAction] = useState<(() => void) | null>(null);

  // Quality Warning Save Confirmation Modal State
  const [isSaveQualityConfirmOpen, setIsSaveQualityConfirmOpen] = useState<boolean>(false);

  // ─── BACKGROUNDS & CATEGORIES (Foto-Kulissen) ───────────────
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

  // ─── UI & MODAL STATES ──────────────────────────────────────
  const [viewMode, setViewMode] = useState<'fit' | 'ipad' | 'actual'>('ipad');
  const [scale, setScale] = useState<number>(0.82);
  const [highlightBoxes, setHighlightBoxes] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isQualityDrawerOpen, setIsQualityDrawerOpen] = useState<boolean>(false);
  const [isBackgroundManagerOpen, setIsBackgroundManagerOpen] = useState<boolean>(false);
  const [isPageMotifSelectorOpen, setIsPageMotifSelectorOpen] = useState<boolean>(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [sidebarTab, setSidebarTab] = useState<'editor' | 'library' | 'rules'>('editor');

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Sync backgrounds & categories to localStorage
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

  // Handle auto-fit scale calculation
  useEffect(() => {
    if (viewMode === 'fit') {
      const handleResize = () => {
        if (!canvasContainerRef.current) return;
        const container = canvasContainerRef.current;
        const availableHeight = container.clientHeight - 48;
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
      setScale(0.82);
    }
  }, [viewMode]);

  // Active page background & quality audit for the current draft
  const activePageBackground = getPageBackgroundById(
    draftRecipe.pageBackgroundId,
    draftRecipe.season
  );

  const activeBackground = (() => {
    if (draftRecipe.customBackgroundId) {
      const match = backgrounds.find(b => b.id === draftRecipe.customBackgroundId);
      if (match && (match.season === draftRecipe.season || match.isNeutralDefault)) {
        return match;
      }
    }
    return (
      backgrounds.find(b => b.season === draftRecipe.season && b.isSeasonalDefault) ||
      getDefaultBackgroundForSeason(draftRecipe.season)
    );
  })();

  const qualityReport = runQualityAudit(draftRecipe);

  // ─── DIRTY NAVIGATION GUARD ─────────────────────────────────
  const checkDirtyNavigation = (action: () => void) => {
    if (isDirty) {
      setPendingNavigationAction(() => action);
      setIsUnsavedModalOpen(true);
    } else {
      action();
    }
  };

  const handleSaveAndProceed = async () => {
    const success = await handleTriggerSave();
    if (success) {
      setIsUnsavedModalOpen(false);
      if (pendingNavigationAction) {
        pendingNavigationAction();
        setPendingNavigationAction(null);
      }
    }
  };

  const handleDiscardAndProceed = () => {
    setIsDirty(false);
    setIsUnsavedModalOpen(false);
    if (pendingNavigationAction) {
      pendingNavigationAction();
      setPendingNavigationAction(null);
    }
  };

  const handleCancelUnsavedModal = () => {
    setIsUnsavedModalOpen(false);
    setPendingNavigationAction(null);
  };

  // ─── REZEPT SPEICHERN LOGIK ─────────────────────────────────
  const validateCriticalRecipeData = (recipe: RecipePageData): string | null => {
    if (!recipe.title || !recipe.title.trim()) {
      return 'Bitte gib einen Rezepttitel an.';
    }
    if (!recipe.season) {
      return 'Bitte wähle eine gültige Jahreszeit.';
    }
    if (!recipe.category) {
      return 'Bitte wähle eine gültige Kategorie.';
    }
    if (!recipe.tags || recipe.tags.length !== 4 || recipe.tags.some(t => !t || !t.trim())) {
      return 'Das Rezept muss exakt 4 ausgefüllte Tags enthalten (§5).';
    }
    const leftCount =
      recipe.columnLeft?.groups?.reduce((acc, g) => acc + (g.items?.length || 0), 0) || 0;
    const rightCount =
      recipe.columnRight?.groups?.reduce((acc, g) => acc + (g.items?.length || 0), 0) || 0;
    if (leftCount + rightCount === 0) {
      return 'Das Rezept benötigt mindestens eine Zutat.';
    }
    if (!recipe.steps || recipe.steps.length === 0) {
      return 'Das Rezept benötigt mindestens einen Zubereitungsschritt.';
    }
    return null;
  };

  const executeSaveRecipe = async (recipeToSave: RecipePageData): Promise<boolean> => {
    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      const finalized: RecipePageData = {
        ...cloneRecipe(recipeToSave),
        createdAt: recipeToSave.createdAt || now,
        updatedAt: now,
        savedAt: now,
      };

      let updatedList: RecipePageData[];
      const existingIndex = savedRecipes.findIndex(r => r.id === finalized.id);

      if (existingIndex >= 0) {
        // ID existiert bereits → Aktualisieren (niemals duplizieren)
        updatedList = [...savedRecipes];
        updatedList[existingIndex] = finalized;
      } else {
        // ID neu → Eintrag anfügen
        updatedList = [finalized, ...savedRecipes];
      }

      setSavedRecipes(updatedList);
      await persistLibraryRecipes(updatedList);

      setDraftRecipe(finalized);
      setIsDirty(false);
      return true;
    } catch (err) {
      console.error('Save failed', err);
      alert('Fehler beim Speichern in die Rezeptbibliothek.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleTriggerSave = async (): Promise<boolean> => {
    // 1. Validierung kritischer Pflichtfelder
    const criticalError = validateCriticalRecipeData(draftRecipe);
    if (criticalError) {
      alert(`Speichern nicht möglich:\n${criticalError}`);
      return false;
    }

    // 2. Redaktionelle Qualitätsprüfung
    const audit = runQualityAudit(draftRecipe);
    if (!audit.isReadyForPublish) {
      setIsSaveQualityConfirmOpen(true);
      return false;
    }

    return await executeSaveRecipe(draftRecipe);
  };

  // ─── DRAFT EDITING ──────────────────────────────────────────
  const handleUpdateDraft = (updated: RecipePageData) => {
    setDraftRecipe(updated);
    setIsDirty(true);
  };

  // ─── BIBLIOTHEK-AKTIONEN ────────────────────────────────────
  const handleOpenRecipeFromLibrary = (recipeToOpen: RecipePageData) => {
    checkDirtyNavigation(() => {
      setDraftRecipe(cloneRecipe(recipeToOpen));
      setIsDirty(false);
    });
  };

  const createBlankRecipe = (): RecipePageData => {
    const now = new Date().toISOString();
    return {
      id: `recipe-${Date.now()}`,
      title: 'NEUES SAISONREZEPT',
      season: 'Frühling',
      category: 'Hauptgerichte',
      tags: ['SCHNELL', 'MEAL PREP', 'HIGH PROTEIN', 'HERZHAFT'],
      photoUrl: DEFAULT_RECIPES[0].photoUrl,
      pageBackgroundId: getDefaultPageBackgroundForSeason('Frühling').id,
      createdAt: now,
      updatedAt: now,
      savedAt: undefined, // existiert zunächst nur als Draft
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
      watchOutTip: 'Auf moderate Hitze achten, damit die Aromen optimal erhalten bleiben.',
      footerText: 'AUS DEM BUCH „REZEPTE DURCHS JAHR“',
    };
  };

  const handleCreateNewBlankRecipe = () => {
    checkDirtyNavigation(() => {
      const blank = createBlankRecipe();
      setDraftRecipe(blank);
      setIsDirty(true);
    });
  };

  const handleDuplicateRecipe = (recipeToDuplicate: RecipePageData) => {
    checkDirtyNavigation(() => {
      const now = new Date().toISOString();
      const duplicate: RecipePageData = {
        ...cloneRecipe(recipeToDuplicate),
        id: `recipe-${Date.now()}`,
        title: `${recipeToDuplicate.title} (KOPIE)`,
        createdAt: now,
        updatedAt: now,
        savedAt: undefined, // bis zum bewussten Speichern nur Draft
      };
      setDraftRecipe(duplicate);
      setIsDirty(true);
      setIsLibraryOpen(false);
    });
  };

  const handleDeleteSavedRecipe = async (recipeId: string) => {
    const updated = savedRecipes.filter(r => r.id !== recipeId);
    setSavedRecipes(updated);
    await persistLibraryRecipes(updated);

    if (draftRecipe.id === recipeId) {
      const next = updated[0] || createBlankRecipe();
      setDraftRecipe(cloneRecipe(next));
      setIsDirty(false);
    }
  };

  const handleApplyAssistantRecipe = (newRecipe: RecipePageData) => {
    checkDirtyNavigation(() => {
      setDraftRecipe(cloneRecipe(newRecipe));
      setIsDirty(true);
    });
  };

  const handleApplyBackgroundToSeason = async (season: Season, backgroundId: string) => {
    const updated = savedRecipes.map(r =>
      r.season === season ? { ...r, pageBackgroundId: backgroundId } : r
    );
    setSavedRecipes(updated);
    await persistLibraryRecipes(updated);

    if (draftRecipe.season === season) {
      setDraftRecipe(prev => ({ ...prev, pageBackgroundId: backgroundId }));
    }
  };

  // Background Manager handlers (Food-Foto Kulissen)
  const handleAddCategory = (newCat: BackgroundCategory) => {
    setBackgroundCategories(prev => [...prev, newCat]);
  };

  const handleAddBackground = (newBg: CustomBackground) => {
    setBackgrounds(prev => [...prev, newBg]);
    handleUpdateDraft({ ...draftRecipe, customBackgroundId: newBg.id });
  };

  const handleDeleteBackground = (bgId: string) => {
    setBackgrounds(prev => prev.filter(b => b.id !== bgId));
    if (draftRecipe.customBackgroundId === bgId) {
      handleUpdateDraft({ ...draftRecipe, customBackgroundId: undefined });
    }
  };

  const handleSelectBackground = (bgId: string) => {
    handleUpdateDraft({ ...draftRecipe, customBackgroundId: bgId });
  };

  // Export / Import
  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(savedRecipes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `rezepte-bibliothek-${new Date().toISOString().slice(0, 10)}.json`
    );
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
        reader.onload = async ev => {
          try {
            const parsed = JSON.parse(ev.target?.result as string);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSavedRecipes(parsed);
              await persistLibraryRecipes(parsed);
              setDraftRecipe(cloneRecipe(parsed[0]));
              setIsDirty(false);
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

        {/* Recipe Selector Dropdown & Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Recipe Selector Dropdown */}
          <div className="relative">
            <select
              value={draftRecipe.id}
              onChange={e => {
                const target = savedRecipes.find(r => r.id === e.target.value);
                if (target) {
                  handleOpenRecipeFromLibrary(target);
                }
              }}
              className="bg-[#24201c] hover:bg-[#2b2520] border border-[#3b332a] focus:border-[#c46637] rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-[#f5eee6] uppercase tracking-wider appearance-none cursor-pointer outline-hidden max-w-[280px] truncate"
            >
              {/* Show current draft at the top if it is not yet saved in library */}
              {!savedRecipes.some(r => r.id === draftRecipe.id) && (
                <option value={draftRecipe.id}>
                  ENTWURF · {draftRecipe.title} ({draftRecipe.season.toUpperCase()})
                </option>
              )}
              {savedRecipes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.season.toUpperCase()} · {r.title} ({r.category})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8e8074] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={handleCreateNewBlankRecipe}
            className="p-1.5 rounded-xl bg-[#29221d] hover:bg-[#342b23] border border-[#3b322a] text-[#ded3c8] hover:text-[#f5eee6] transition-colors cursor-pointer"
            title="Neues leeres Rezept anlegen"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleDuplicateRecipe(draftRecipe)}
            className="p-1.5 rounded-xl bg-[#29221d] hover:bg-[#342b23] border border-[#3b322a] text-[#ded3c8] hover:text-[#f5eee6] transition-colors cursor-pointer"
            title="Aktuelles Rezept duplizieren"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (savedRecipes.some(r => r.id === draftRecipe.id)) {
                handleDeleteSavedRecipe(draftRecipe.id);
              } else {
                // Draft was never saved, reset to first library recipe
                const first = savedRecipes[0] || createBlankRecipe();
                setDraftRecipe(cloneRecipe(first));
                setIsDirty(false);
              }
            }}
            className="p-1.5 rounded-xl bg-[#29221d] hover:bg-[#3d2422] border border-[#3b322a] hover:border-rose-800 text-[#ded3c8] hover:text-rose-300 transition-colors cursor-pointer"
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
        onOpenPageMotifSelector={() => setIsPageMotifSelectorOpen(true)}
        activeMotifName={activePageBackground.name}
        onOpenLibrary={() => checkDirtyNavigation(() => setIsLibraryOpen(true))}
        savedRecipesCount={savedRecipes.length}
        onSaveRecipe={handleTriggerSave}
        isDirty={isDirty}
        savedAt={draftRecipe.savedAt}
        isSaving={isSaving}
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
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer ${
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
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer ${
                sidebarTab === 'library'
                  ? 'bg-[#29221c] text-[#f5eee6] shadow-xs border border-[#3b3229]'
                  : 'text-[#8e8074] hover:text-[#e8ded5]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#c46637]" />
              <span>Kapitel ({savedRecipes.length})</span>
            </button>

            <button
              onClick={() => setSidebarTab('rules')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer ${
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
                recipe={draftRecipe}
                onChange={handleUpdateDraft}
                backgrounds={backgrounds}
                categories={backgroundCategories}
                onOpenPageMotifSelector={() => setIsPageMotifSelectorOpen(true)}
                onOpenBackgroundManager={() => setIsBackgroundManagerOpen(true)}
              />
            )}

            {sidebarTab === 'library' && (
              <SeasonalPreviewLibrary
                recipes={savedRecipes}
                currentRecipeId={draftRecipe.id}
                onSelectRecipe={id => {
                  const target = savedRecipes.find(r => r.id === id);
                  if (target) handleOpenRecipeFromLibrary(target);
                }}
                onApplyBackgroundToSeason={handleApplyBackgroundToSeason}
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
                    Foto-Standards (§13 &amp; §14)
                  </h4>
                  <p className="text-[11px] leading-relaxed">
                    1:1 quadratisch. Nur das fertige Gericht im warmen editorialen Licht. Keine Typografie, keine Logos oder Labels im Foto. Zutaten müssen exakt mit dem Rezept übereinstimmen.
                  </p>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right Canvas: Absolute Master A4 Recipe Page (#FFF7F0) */}
        <main
          ref={canvasContainerRef}
          className="flex-1 bg-[#0f0e0d] overflow-auto flex flex-col items-center justify-start p-6 print:p-0 print:m-0 print:bg-white"
        >
          {viewMode === 'ipad' ? (
            /* 13-inch iPad Pro Mockup Frame */
            <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
              <div className="text-[11px] font-semibold text-[#8e8074] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tablet className="w-3.5 h-3.5 text-[#c46637]" />
                <span>13″ iPad Pro Ansicht · Maßstabsgetreue Kochbuch-Lesbarkeit (§2)</span>
              </div>

              <div
                className="rounded-[40px] p-4 bg-[#231e1a] border-4 border-[#3b322a] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative flex flex-col items-center justify-center transition-all duration-300"
                style={{
                  width: `${Math.round(794 * scale + 36)}px`,
                  minHeight: `${Math.round(1123 * scale + 36)}px`,
                }}
              >
                {/* Front camera notch */}
                <div className="w-2.5 h-2.5 rounded-full bg-[#141210] border border-[#332b23] mb-2 self-center shrink-0" />

                <div
                  className="rounded-2xl overflow-hidden shadow-2xl relative"
                  style={{
                    width: `${Math.round(794 * scale)}px`,
                    height: `${Math.round(1123 * scale)}px`,
                  }}
                >
                  <MasterRecipePage
                    recipe={draftRecipe}
                    scale={scale}
                    highlightBoxes={highlightBoxes}
                    background={activeBackground}
                  />
                </div>

                <div className="w-28 h-1 rounded-full bg-[#3b322a] mt-3 self-center shrink-0" />
              </div>
            </div>
          ) : (
            /* Standard / Actual View */
            <div className="flex flex-col items-center">
              <div
                className="relative shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                style={{
                  width: `${Math.round(794 * scale)}px`,
                  height: `${Math.round(1123 * scale)}px`,
                }}
              >
                <MasterRecipePage
                  recipe={draftRecipe}
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
      {/* 1. Große eigenständige Rezeptbibliothek */}
      <RecipeLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        savedRecipes={savedRecipes}
        currentDraftId={draftRecipe.id}
        onOpenRecipe={handleOpenRecipeFromLibrary}
        onCreateNewRecipe={handleCreateNewBlankRecipe}
        onDuplicateRecipe={handleDuplicateRecipe}
        onDeleteRecipe={handleDeleteSavedRecipe}
      />

      {/* 2. Dialog bei ungespeicherten Änderungen */}
      <UnsavedChangesModal
        isOpen={isUnsavedModalOpen}
        recipeTitle={draftRecipe.title}
        onSaveAndProceed={handleSaveAndProceed}
        onDiscardAndProceed={handleDiscardAndProceed}
        onCancel={handleCancelUnsavedModal}
      />

      {/* 3. Qualitätsprüfung-Bestätigung vor dem Speichern */}
      <SaveQualityConfirmModal
        isOpen={isSaveQualityConfirmOpen}
        onClose={() => setIsSaveQualityConfirmOpen(false)}
        report={qualityReport}
        onSaveAnyway={async () => {
          setIsSaveQualityConfirmOpen(false);
          await executeSaveRecipe(draftRecipe);
        }}
        onOpenAuditDrawer={() => setIsQualityDrawerOpen(true)}
      />

      {/* 4. Assistent Input Modal */}
      <AssistantInputModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onApplyRecipe={handleApplyAssistantRecipe}
      />

      {/* 5. Qualitäts-Drawer */}
      <QualityAuditDrawer
        isOpen={isQualityDrawerOpen}
        onClose={() => setIsQualityDrawerOpen(false)}
        report={qualityReport}
        currentRecipe={draftRecipe}
        onUpdateRecipe={handleUpdateDraft}
      />

      {/* 6. Food-Foto Kulissen Manager Modal */}
      <BackgroundManagerModal
        isOpen={isBackgroundManagerOpen}
        onClose={() => setIsBackgroundManagerOpen(false)}
        categories={backgroundCategories}
        backgrounds={backgrounds}
        currentBackgroundId={draftRecipe.customBackgroundId}
        onSelectBackground={handleSelectBackground}
        onAddCategory={handleAddCategory}
        onAddBackground={handleAddBackground}
        onDeleteBackground={handleDeleteBackground}
      />

      {/* 7. Zentrales Seitenmotiv-Auswahlmodal */}
      <PageMotifSelectorModal
        isOpen={isPageMotifSelectorOpen}
        onClose={() => setIsPageMotifSelectorOpen(false)}
        season={draftRecipe.season}
        selectedBackgroundId={draftRecipe.pageBackgroundId}
        onSelectMotif={bgId => handleUpdateDraft({ ...draftRecipe, pageBackgroundId: bgId })}
      />
    </div>
  );
}
