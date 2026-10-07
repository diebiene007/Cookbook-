import React from 'react';
import { AlertTriangle, Save, ArrowRight, X } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  recipeTitle?: string;
  onSaveAndProceed: () => void;
  onDiscardAndProceed: () => void;
  onCancel: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  recipeTitle = 'Aktuelles Rezept',
  onSaveAndProceed,
  onDiscardAndProceed,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div
        className="bg-[#1f1b18] border border-[#3d3227] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#2d251e] flex items-start gap-3 bg-[#191513]">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[#f5eee6] tracking-wide">
              Ungespeicherte Änderungen
            </h3>
            <p className="text-xs text-[#a09083] mt-0.5 truncate">
              „{recipeTitle}“
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-[#8e8074] hover:text-[#f5eee6] hover:bg-[#2b241e] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-2 text-xs text-[#b8a899] leading-relaxed">
          <p>
            Dieses Rezept enthält ungespeicherte Änderungen. Wenn du fortfährst, ohne zu speichern, gehen alle Änderungen seit dem letzten Speicherstand verloren.
          </p>
          <p className="text-[11px] text-[#8e8074]">
            Was möchtest du tun?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#171412] border-t border-[#2d251e] flex flex-col gap-2">
          {/* 1. Save & Proceed */}
          <button
            type="button"
            onClick={onSaveAndProceed}
            className="w-full py-2.5 px-4 rounded-xl bg-[#c46637] hover:bg-[#d6723e] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#c46637]/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Speichern &amp; fortfahren</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {/* 2. Discard & Proceed */}
            <button
              type="button"
              onClick={onDiscardAndProceed}
              className="py-2 px-3 rounded-xl bg-[#26201b] hover:bg-rose-950/40 border border-[#3b3026] hover:border-rose-700/50 text-rose-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Ohne Speichern</span>
            </button>

            {/* 3. Cancel */}
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-3 rounded-xl bg-[#26201b] hover:bg-[#342b23] border border-[#3b3026] text-[#ded3c8] font-medium text-xs flex items-center justify-center transition-colors cursor-pointer"
            >
              <span>Abbrechen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
