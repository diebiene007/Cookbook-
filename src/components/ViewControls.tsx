import React from 'react';
import {
  Printer,
  Tablet,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Download,
  Upload,
  Layers,
  Palette,
  Save,
  BookOpen,
  Check,
} from 'lucide-react';
import { QualityReport } from '../types/recipe';

interface ViewControlsProps {
  viewMode: 'fit' | 'ipad' | 'actual';
  onSetViewMode: (mode: 'fit' | 'ipad' | 'actual') => void;
  scale: number;
  onSetScale: (scale: number) => void;
  highlightBoxes: boolean;
  onToggleHighlightBoxes: () => void;
  qualityReport: QualityReport;
  onOpenQualityDrawer: () => void;
  onOpenAssistantModal: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
  onOpenPageMotifSelector?: () => void;
  activeMotifName?: string;
  onOpenLibrary: () => void;
  savedRecipesCount?: number;
  onSaveRecipe: () => void;
  isDirty: boolean;
  savedAt?: string;
  isSaving?: boolean;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  viewMode,
  onSetViewMode,
  scale,
  onSetScale,
  highlightBoxes,
  onToggleHighlightBoxes,
  qualityReport,
  onOpenQualityDrawer,
  onOpenAssistantModal,
  onExportJson,
  onImportJson,
  onOpenPageMotifSelector,
  activeMotifName,
  onOpenLibrary,
  savedRecipesCount = 0,
  onSaveRecipe,
  isDirty,
  savedAt,
  isSaving = false,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedSaveTime = (() => {
    if (!savedAt) return null;
    try {
      const d = new Date(savedAt);
      return `Zuletzt: ${d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return null;
    }
  })();

  return (
    <div className="no-print bg-[#1a1715]/95 backdrop-blur-md border-b border-[#342d25] px-4 py-2.5 flex items-center justify-between gap-3 text-xs z-30 sticky top-0">
      {/* Left: Library, Save, Assistant & Quick Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* 1. Hauptbutton Rezeptbibliothek */}
        <button
          onClick={onOpenLibrary}
          className="px-3.5 py-1.5 rounded-lg bg-[#241e1a] hover:bg-[#342b23] border border-[#3e3328] hover:border-[#c46637] text-[#ded3c8] hover:text-[#f5eee6] flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          title="Gespeicherte Rezeptbibliothek öffnen"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#c46637]" />
          <span className="font-semibold text-xs">Rezeptbibliothek</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#181513] text-[#baa99b] border border-white/5 font-mono">
            {savedRecipesCount}
          </span>
        </button>

        {/* 2. Gut sichtbarer Button: Rezept speichern & Dirty State Indicator */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onSaveRecipe}
            disabled={isSaving}
            className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
              isDirty
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 ring-1 ring-amber-400/50'
                : 'bg-[#27221d] hover:bg-[#342d25] text-[#ded3c8] border border-[#3d342b]'
            }`}
            title="Aktuellen Arbeitsstand in der Bibliothek speichern"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Rezept speichern</span>
          </button>

          {/* Dirty Status Badge */}
          <div
            className={`hidden md:flex items-center gap-1.5 text-[10.5px] px-2 py-1 rounded-lg border ${
              isDirty
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isDirty ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            />
            <span className="font-medium">
              {isDirty ? 'Ungespeicherte Änderungen' : '✓ Gespeichert'}
            </span>
            {!isDirty && formattedSaveTime && (
              <span className="text-[9.5px] text-[#8e8074] hidden xl:inline">
                ({formattedSaveTime})
              </span>
            )}
          </div>
        </div>

        {/* 3. Assistant */}
        <button
          onClick={onOpenAssistantModal}
          className="px-3 py-1.5 rounded-lg bg-[#27221d] hover:bg-[#342d25] border border-[#3d342b] text-[#ded3c8] hover:text-[#f5eee6] font-medium flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c46637]" />
          <span className="hidden lg:inline">Assistent</span>
        </button>

        {/* 4. Seitenmotiv Button */}
        {onOpenPageMotifSelector && (
          <button
            onClick={onOpenPageMotifSelector}
            className="px-3 py-1.5 rounded-lg bg-[#27221d] hover:bg-[#342d25] border border-[#3d342b] text-[#ded3c8] hover:text-[#f5eee6] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Saisonales A4-Seitenmotiv wählen"
          >
            <Palette className="w-3.5 h-3.5 text-[#c46637]" />
            <span className="hidden sm:inline">Seitenmotiv</span>
            {activeMotifName && (
              <span className="text-[10px] text-[#baa99b] hidden lg:inline">
                ({activeMotifName})
              </span>
            )}
          </button>
        )}

        {/* 5. Qualitätsprüfung Drawer */}
        <button
          onClick={onOpenQualityDrawer}
          className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
            qualityReport.isReadyForPublish
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
          }`}
        >
          {qualityReport.isReadyForPublish ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span className="font-semibold text-[11px]">
            {qualityReport.passedCount}/{qualityReport.totalCount} Prüfung
          </span>
        </button>
      </div>

      {/* Center: View Modes & iPad 13" mode */}
      <div className="flex items-center gap-1.5 bg-[#24201c] p-1 rounded-xl border border-[#362e26]">
        <button
          onClick={() => onSetViewMode('fit')}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] font-medium transition-colors ${
            viewMode === 'fit'
              ? 'bg-[#3b3228] text-[#f5eee6] shadow-xs'
              : 'text-[#9c8e82] hover:text-[#f5eee6]'
          }`}
          title="Optimal an den Bildschirm anpassen"
        >
          <Minimize2 className="w-3 h-3" />
          <span>Einpassen</span>
        </button>

        <button
          onClick={() => onSetViewMode('ipad')}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[11px] font-medium transition-colors ${
            viewMode === 'ipad'
              ? 'bg-[#c46637] text-white shadow-xs'
              : 'text-[#9c8e82] hover:text-[#f5eee6]'
          }`}
          title="Optimale Lesbarkeit auf dem 13-Zoll iPad Pro im Hochformat prüfen (§2)"
        >
          <Tablet className="w-3 h-3" />
          <span>13″ iPad Ansicht</span>
        </button>

        <button
          onClick={() => onSetViewMode('actual')}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] font-medium transition-colors ${
            viewMode === 'actual'
              ? 'bg-[#3b3228] text-[#f5eee6] shadow-xs'
              : 'text-[#9c8e82] hover:text-[#f5eee6]'
          }`}
          title="100% Original-Druckmaßstab A4"
        >
          <Maximize2 className="w-3 h-3" />
          <span>100% A4</span>
        </button>

        {/* Zoom adjustment */}
        <div className="flex items-center gap-0.5 border-l border-[#3a3229] pl-1.5 ml-1">
          <button
            onClick={() => onSetScale(Math.max(0.4, scale - 0.05))}
            className="p-1 text-[#8e8074] hover:text-[#f5eee6] rounded"
            title="Verkleinern"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="text-[10px] text-[#baa99b] w-8 text-center font-mono">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => onSetScale(Math.min(1.4, scale + 0.05))}
            className="p-1 text-[#8e8074] hover:text-[#f5eee6] rounded"
            title="Vergrößern"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Right: Layout Debug, Print & Export */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggleHighlightBoxes}
          className={`p-1.5 rounded-lg border text-xs transition-colors ${
            highlightBoxes
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'border-[#362e26] text-[#8e8074] hover:text-[#f5eee6]'
          }`}
          title="Layout-Boxen & Überlauf-Konturen hervorheben"
        >
          <Layers className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onExportJson}
          className="p-1.5 rounded-lg border border-[#362e26] text-[#8e8074] hover:text-[#f5eee6] transition-colors"
          title="Rezeptdaten als JSON exportieren"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onImportJson}
          className="p-1.5 rounded-lg border border-[#362e26] text-[#8e8074] hover:text-[#f5eee6] transition-colors"
          title="Rezeptdaten aus JSON importieren"
        >
          <Upload className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handlePrint}
          className="px-3.5 py-1.5 rounded-lg bg-[#2e2620] hover:bg-[#3d3229] border border-[#4d3f34] text-[#f5eee6] font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          title="1-seitige A4-Rezeptseite drucken oder als PDF speichern"
        >
          <Printer className="w-3.5 h-3.5 text-[#c46637]" />
          <span>A4 Drucken / PDF</span>
        </button>
      </div>
    </div>
  );
};
