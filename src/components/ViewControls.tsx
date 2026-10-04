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
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="no-print bg-[#1a1715]/95 backdrop-blur-md border-b border-[#342d25] px-4 py-2.5 flex items-center justify-between gap-3 text-xs z-30 sticky top-0">
      {/* Left: Quick Actions & Assistant */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAssistantModal}
          className="px-3.5 py-1.5 rounded-lg bg-[#c46637] hover:bg-[#d6723e] text-white font-medium flex items-center gap-2 shadow-md shadow-[#c46637]/20 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Neues Rezept analysieren</span>
        </button>

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
          <span className="hidden md:inline text-[10px] opacity-80">
            {qualityReport.isReadyForPublish ? '· Fertig' : '· Abweichung'}
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
