import React from 'react';
import { Season } from '../types/recipe';
import {
  getPageBackgroundsForSeason,
  getPageBackgroundById,
  RecipePageBackground,
} from '../data/recipePageBackgrounds';
import { SeasonalBackgroundThumbnail } from './SeasonalBackgroundThumbnail';
import { X, Check, Palette } from 'lucide-react';

interface PageMotifSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  season: Season;
  selectedBackgroundId?: string;
  onSelectMotif: (backgroundId: string) => void;
}

export const PageMotifSelectorModal: React.FC<PageMotifSelectorModalProps> = ({
  isOpen,
  onClose,
  season,
  selectedBackgroundId,
  onSelectMotif,
}) => {
  if (!isOpen) return null;

  const currentActive = getPageBackgroundById(selectedBackgroundId, season);
  const availableMotifs = getPageBackgroundsForSeason(season);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div
        className="bg-[#1f1b18] border border-[#3b332b] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#2d261f] flex items-center justify-between bg-[#191614]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2a221b] border border-[#403429] text-[#c46637]">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#f5eee6] tracking-wide">
                Seitenmotiv wählen · {season}
              </h2>
              <p className="text-[11px] text-[#9c8e82]">
                5 dezente botanische Editorial-Motive für die gesamte A4-Rezeptseite
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9c8e82] hover:text-[#f5eee6] hover:bg-[#2b241e] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Motifs Grid */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {availableMotifs.map((bg: RecipePageBackground) => {
              const isSelected = currentActive.id === bg.id;

              return (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => {
                    onSelectMotif(bg.id);
                    onClose();
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#c46637] bg-[#34271f] ring-2 ring-[#c46637]/50 shadow-md'
                      : 'border-[#382f26] bg-[#171412] hover:border-[#544436] hover:bg-[#221c18]'
                  }`}
                >
                  <SeasonalBackgroundThumbnail
                    pageBackgroundId={bg.id}
                    season={bg.season}
                    className="w-10 h-14"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-semibold text-[#f5eee6] truncate">
                        {bg.name}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#c46637] shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-[#8e8074] leading-tight line-clamp-2">
                      {bg.season === 'Neutral'
                        ? 'Reiner warmer Cremegrund (#FFF7F0) ohne Illustration'
                        : bg.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-[#171412] p-3 rounded-xl border border-[#2d261f] text-[11px] text-[#9c8e82] flex items-center justify-between">
            <span>Aktives Seitenmotiv: <strong className="text-[#f5eee6]">{currentActive.name}</strong></span>
            <span className="text-[10px] text-[#c46637] uppercase tracking-wider font-semibold">
              Sofort auf A4 aktiv
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#2d261f] bg-[#191614] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#2b241e] hover:bg-[#382f27] border border-[#3d3328] text-xs font-medium text-[#f5eee6] transition-colors cursor-pointer"
          >
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
};
