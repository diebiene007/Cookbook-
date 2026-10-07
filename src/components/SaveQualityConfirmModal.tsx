import React from 'react';
import { AlertCircle, CheckCircle2, X, ArrowRight } from 'lucide-react';
import { QualityReport } from '../types/recipe';

interface SaveQualityConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  report: QualityReport;
  onSaveAnyway: () => void;
  onOpenAuditDrawer: () => void;
}

export const SaveQualityConfirmModal: React.FC<SaveQualityConfirmModalProps> = ({
  isOpen,
  onCancel,
  report,
  onSaveAnyway,
  onOpenAuditDrawer,
}) => {
  if (!isOpen) return null;

  const failedItems = report.items.filter(i => !i.passed);
  const failureCount = failedItems.length;

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
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[#f5eee6] tracking-wide">
              Redaktionelle Hinweise vor dem Speichern
            </h3>
            <p className="text-xs text-amber-300/90 mt-0.5">
              Das Rezept enthält noch {failureCount} {failureCount === 1 ? 'Abweichung' : 'Abweichungen'}.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-[#8e8074] hover:text-[#f5eee6] hover:bg-[#2b241e] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Failed items preview */}
        <div className="p-5 space-y-3 max-h-60 overflow-y-auto">
          <p className="text-xs text-[#a09083]">
            Für die perfekte Buchveröffentlichung (§1–§15) sollten folgende Punkte beachtet werden:
          </p>
          <div className="space-y-1.5">
            {failedItems.slice(0, 4).map(item => (
              <div
                key={item.id}
                className="p-2 rounded-lg bg-[#161311] border border-[#2d241d] text-[11px] text-[#ded3c8] flex items-start gap-2"
              >
                <span className="text-amber-400 font-mono text-[10px] mt-0.5">§{item.number}</span>
                <span className="flex-1 leading-snug">{item.message}</span>
              </div>
            ))}
            {failureCount > 4 && (
              <div className="text-[10px] text-[#8e8074] text-center pt-1">
                + {failureCount - 4} weitere redaktionelle Hinweise
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#171412] border-t border-[#2d251e] flex flex-col gap-2">
          {/* Open Audit Drawer */}
          <button
            type="button"
            onClick={onOpenAuditDrawer}
            className="w-full py-2.5 px-4 rounded-xl bg-[#c46637] hover:bg-[#d6723e] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#c46637]/20 transition-all cursor-pointer"
          >
            <span>Qualitätsprüfung öffnen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            {/* Save Anyway */}
            <button
              type="button"
              onClick={onSaveAnyway}
              className="py-2 px-3 rounded-xl bg-[#26201b] hover:bg-[#342b23] border border-[#3b3026] text-[#eae2d8] font-medium text-xs flex items-center justify-center transition-colors cursor-pointer"
            >
              Trotzdem speichern
            </button>

            {/* Cancel */}
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-3 rounded-xl bg-[#26201b] hover:bg-[#342b23] border border-[#3b3026] text-[#8e8074] hover:text-[#ded3c8] font-medium text-xs flex items-center justify-center transition-colors cursor-pointer"
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
