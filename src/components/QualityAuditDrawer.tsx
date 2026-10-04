import React, { useState } from 'react';
import { QualityReport, QualityCheckItem, RecipePageData } from '../types/recipe';
import { CheckCircle2, AlertTriangle, Sparkles, Filter, ChevronDown, ChevronRight, X } from 'lucide-react';
import { autoFixRecipe } from '../utils/qualityCheck';

interface QualityAuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  report: QualityReport;
  currentRecipe: RecipePageData;
  onUpdateRecipe: (updated: RecipePageData) => void;
}

export const QualityAuditDrawer: React.FC<QualityAuditDrawerProps> = ({
  isOpen,
  onClose,
  report,
  currentRecipe,
  onUpdateRecipe,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'failed' | 'passed'>('all');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Masterlayout: true,
    Metadaten: true,
    'Auf einen Blick': true,
    Zutaten: true,
    Zubereitung: true,
    'Nährwerte & Tipps': true,
    'Foto & Finish': true,
  });

  if (!isOpen) return null;

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleAutoFix = (action: string) => {
    const fixed = autoFixRecipe(currentRecipe, action);
    onUpdateRecipe(fixed);
  };

  const handleFixAll = () => {
    let rec = { ...currentRecipe };
    report.items.forEach(item => {
      if (!item.passed && item.canAutoFix && item.autoFixAction) {
        rec = autoFixRecipe(rec, item.autoFixAction);
      }
    });
    onUpdateRecipe(rec);
  };

  const categories = Array.from(new Set(report.items.map(i => i.category)));

  const filteredItems = report.items.filter(item => {
    if (filterMode === 'failed') return !item.passed;
    if (filterMode === 'passed') return item.passed;
    return true;
  });

  const fixableCount = report.items.filter(i => !i.passed && i.canAutoFix).length;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#1d1a17] text-[#e8ded5] border-l border-[#3a322a] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#312a23] bg-[#24201c] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              report.isReadyForPublish
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {report.isReadyForPublish ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f5eee6] font-editorial-sans">
              Qualitätskontrolle (§16)
            </h3>
            <p className="text-[11px] text-[#9c8e82]">
              {report.passedCount} von {report.totalCount} Kriterien erfüllt
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-[#9c8e82] hover:text-[#f5eee6] p-1.5 rounded-lg hover:bg-[#322b24] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress & Fix All Bar */}
      <div className="px-5 py-3 border-b border-[#312a23] bg-[#1a1715] flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="h-1.5 bg-[#2d2620] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                report.isReadyForPublish ? 'bg-emerald-500' : 'bg-[#c46637]'
              }`}
              style={{ width: `${(report.passedCount / report.totalCount) * 100}%` }}
            />
          </div>
          <div className="text-[10px] text-[#8e8074] mt-1 flex justify-between">
            <span>Locked Template Status</span>
            <span className={report.isReadyForPublish ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
              {report.isReadyForPublish ? '100% Druckfertig' : `${Math.round((report.passedCount / report.totalCount) * 100)}%`}
            </span>
          </div>
        </div>

        {fixableCount > 0 && (
          <button
            onClick={handleFixAll}
            className="px-2.5 py-1.5 rounded-lg bg-[#c46637] hover:bg-[#d6723e] text-white text-[11px] font-medium flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            Alle {fixableCount} beheben
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="px-5 py-2 border-b border-[#312a23] flex items-center gap-2 text-xs">
        <Filter className="w-3 h-3 text-[#8e8074]" />
        <button
          onClick={() => setFilterMode('all')}
          className={`px-2 py-0.5 rounded text-[11px] ${
            filterMode === 'all'
              ? 'bg-[#3b3229] text-[#f5eee6] font-semibold'
              : 'text-[#8e8074] hover:text-[#e8ded5]'
          }`}
        >
          Alle ({report.totalCount})
        </button>
        <button
          onClick={() => setFilterMode('failed')}
          className={`px-2 py-0.5 rounded text-[11px] ${
            filterMode === 'failed'
              ? 'bg-amber-500/20 text-amber-300 font-semibold'
              : 'text-[#8e8074] hover:text-[#e8ded5]'
          }`}
        >
          Abweichungen ({report.totalCount - report.passedCount})
        </button>
        <button
          onClick={() => setFilterMode('passed')}
          className={`px-2 py-0.5 rounded text-[11px] ${
            filterMode === 'passed'
              ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
              : 'text-[#8e8074] hover:text-[#e8ded5]'
          }`}
        >
          Erfüllt ({report.passedCount})
        </button>
      </div>

      {/* Checklist items by category */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {categories.map(cat => {
          const itemsInCat = filteredItems.filter(i => i.category === cat);
          if (itemsInCat.length === 0) return null;
          const isExpanded = expandedCategories[cat] !== false;

          return (
            <div key={cat} className="bg-[#24201c] border border-[#362e26] rounded-xl overflow-hidden">
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full px-3.5 py-2.5 bg-[#2a241f] hover:bg-[#312b24] flex items-center justify-between text-xs font-semibold text-[#ded3c8] transition-colors"
              >
                <span>{cat}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#8e8074]">
                    {itemsInCat.filter(i => i.passed).length}/{itemsInCat.length}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[#8e8074]" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[#8e8074]" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="divide-y divide-[#2f2720]">
                  {itemsInCat.map(item => (
                    <div key={item.id} className="p-3 space-y-1 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          {item.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold text-[#f0e7df] block text-[11.5px]">
                              {item.number}. {item.label}
                            </span>
                            <span className="text-[10.5px] text-[#9e8f83] block">
                              {item.message}
                            </span>
                          </div>
                        </div>

                        {!item.passed && item.canAutoFix && item.autoFixAction && (
                          <button
                            onClick={() => handleAutoFix(item.autoFixAction!)}
                            className="px-2 py-1 rounded bg-[#3b3127] hover:bg-[#c46637] text-white text-[10px] font-medium transition-colors shrink-0"
                          >
                            Beheben
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-[#312a23] bg-[#24201c] text-center text-xs text-[#9e8f83]">
        {report.isReadyForPublish ? (
          <span className="text-emerald-400 font-medium">
            ✓ Alle 26 Qualitätskriterien erfüllt. Seite entspricht 100% der Mastervorlage.
          </span>
        ) : (
          <span className="text-amber-400">
            Bitte verbleibende Abweichungen korrigieren, bevor die Seite freigegeben wird.
          </span>
        )}
      </div>
    </div>
  );
};
