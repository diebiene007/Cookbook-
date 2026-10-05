import React, { useState } from 'react';
import { BackgroundCategory, CustomBackground } from '../types/backgrounds';
import { Palette, Plus, Trash2, Check, X, Sparkles, Layers, Sliders, Info } from 'lucide-react';

interface BackgroundManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: BackgroundCategory[];
  backgrounds: CustomBackground[];
  currentBackgroundId?: string;
  onSelectBackground: (bgId: string) => void;
  onAddCategory: (category: BackgroundCategory) => void;
  onAddBackground: (background: CustomBackground) => void;
  onDeleteBackground: (bgId: string) => void;
}

export const BackgroundManagerModal: React.FC<BackgroundManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  backgrounds,
  currentBackgroundId,
  onSelectBackground,
  onAddCategory,
  onAddBackground,
  onDeleteBackground,
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('alle');
  const [isCreatingBg, setIsCreatingBg] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // New Category Form State
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('#c46637');

  // New Background Form State
  const [newBgName, setNewBgName] = useState('');
  const [newBgCategoryId, setNewBgCategoryId] = useState(categories[1]?.id || 'fruehling');
  const [newBgDesc, setNewBgDesc] = useState('');
  const [newBgMood, setNewBgMood] = useState('');
  const [newBgColor, setNewBgColor] = useState('#EFE8E0');
  const [newBgPrompt, setNewBgPrompt] = useState('');

  if (!isOpen) return null;

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatLabel.trim()) return;

    const catId = `cat-${Date.now()}-${newCatLabel.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const newCat: BackgroundCategory = {
      id: catId,
      label: newCatLabel.trim(),
      description: newCatDesc.trim() || 'Benutzerdefinierte Hauptkategorie',
      accentColor: newCatColor,
      isCustom: true,
    };

    onAddCategory(newCat);
    setActiveCategoryId(catId);
    setNewBgCategoryId(catId);
    setNewCatLabel('');
    setNewCatDesc('');
    setIsCreatingCategory(false);
  };

  const handleCreateBackground = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBgName.trim()) return;

    const newBg: CustomBackground = {
      id: `bg-custom-${Date.now()}`,
      name: newBgName.trim(),
      categoryId: newBgCategoryId,
      description: newBgDesc.trim() || 'Eigener saisonaler Hintergrundstil.',
      previewColor: newBgColor,
      previewGradient: `linear-gradient(135deg, ${newBgColor} 0%, #FFFFFF 100%)`,
      previewBorderColor: '#D8C7B5',
      backdropPrompt: newBgPrompt.trim() || `${newBgName.trim()} culinary photography surface, warm natural studio light.`,
      mood: newBgMood.trim() || 'Harmonisch, hochwertig',
      isCustomUserCreated: true,
    };

    onAddBackground(newBg);
    onSelectBackground(newBg.id);
    setNewBgName('');
    setNewBgDesc('');
    setNewBgMood('');
    setNewBgPrompt('');
    setIsCreatingBg(false);
  };

  const filteredBackgrounds = backgrounds.filter(bg => {
    if (activeCategoryId === 'alle') return true;
    return bg.categoryId === activeCategoryId;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1e1b18] text-[#e8ded5] border border-[#3d342c] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#312a23] bg-[#24201c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#c46637]/20 border border-[#c46637]/40 flex items-center justify-center text-[#d97d4f]">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#f5eee6] font-editorial-sans">
                Custom-Hintergründe & Kulissen-Manager
              </h2>
              <p className="text-xs text-[#9c8e82]">
                Saisonspezifische visuelle Identitäten für Food-Fotos & Kulissen definieren
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9c8e82] hover:text-[#f5eee6] p-1.5 rounded-lg hover:bg-[#322b24] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Category tabs & Create Buttons */}
        <div className="px-6 py-3 border-b border-[#312a23] bg-[#1a1715] flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setActiveCategoryId('alle')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors ${
                activeCategoryId === 'alle'
                  ? 'bg-[#c46637] text-white shadow-xs'
                  : 'bg-[#24201c] text-[#9c8e82] hover:text-[#f5eee6] border border-[#342b23]'
              }`}
            >
              Alle ({backgrounds.length})
            </button>

            {categories.map(cat => {
              const count = backgrounds.filter(b => b.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1.5 transition-colors ${
                    activeCategoryId === cat.id
                      ? 'bg-[#c46637] text-white shadow-xs'
                      : 'bg-[#24201c] text-[#9c8e82] hover:text-[#f5eee6] border border-[#342b23]'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.accentColor }}
                  />
                  <span>{cat.label}</span>
                  <span className="opacity-70 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setIsCreatingCategory(true);
                setIsCreatingBg(false);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-[#27221d] hover:bg-[#342d25] border border-[#3d342b] text-[#ded3c8] text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#c46637]" />
              Kategorie hinzufügen
            </button>

            <button
              onClick={() => {
                setIsCreatingBg(true);
                setIsCreatingCategory(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#c46637] hover:bg-[#d6723e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Neuer Hintergrund
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* New Category Form Inline */}
          {isCreatingCategory && (
            <form
              onSubmit={handleCreateCategory}
              className="bg-[#24201c] border border-[#3d3329] rounded-xl p-4.5 space-y-3.5 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#312921]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d97d4f]">
                  Neue Hauptkategorie anlegen
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreatingCategory(false)}
                  className="text-[#9c8e82] hover:text-[#f5eee6]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[#a09083] font-semibold mb-1">
                    Kategoriename:
                  </label>
                  <input
                    type="text"
                    value={newCatLabel}
                    onChange={e => setNewCatLabel(e.target.value)}
                    placeholder="z.B. Grill & BBQ"
                    className="w-full bg-[#151311] border border-[#3b322a] rounded-lg px-3 py-2 text-[#f5eee6] outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#a09083] font-semibold mb-1">
                    Visuelle Beschreibung:
                  </label>
                  <input
                    type="text"
                    value={newCatDesc}
                    onChange={e => setNewCatDesc(e.target.value)}
                    placeholder="z.B. Rauchige Holztexturen, warmer Rost..."
                    className="w-full bg-[#151311] border border-[#3b322a] rounded-lg px-3 py-2 text-[#f5eee6] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#a09083] font-semibold mb-1">
                    Akzentfarbe:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newCatColor}
                      onChange={e => setNewCatColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-[#3b322a] bg-transparent cursor-pointer p-0.5"
                    />
                    <span className="font-mono text-xs text-[#cfc0b2]">{newCatColor}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingCategory(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#9c8e82] hover:text-[#f5eee6]"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#c46637] hover:bg-[#d6723e] text-white font-medium text-xs shadow-sm"
                >
                  Kategorie speichern
                </button>
              </div>
            </form>
          )}

          {/* New Background Form Inline */}
          {isCreatingBg && (
            <form
              onSubmit={handleCreateBackground}
              className="bg-[#24201c] border border-[#3d3329] rounded-xl p-4.5 space-y-3.5 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#312921]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d97d4f]">
                  Neuen Custom-Hintergrund definieren
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreatingBg(false)}
                  className="text-[#9c8e82] hover:text-[#f5eee6]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[#a09083] font-semibold mb-1">
                    Hintergrund-Name:
                  </label>
                  <input
                    type="text"
                    value={newBgName}
                    onChange={e => setNewBgName(e.target.value)}
                    placeholder="z.B. Sonnige Zitronenhaine & Travertin"
                    className="w-full bg-[#151311] border border-[#3b322a] rounded-lg px-3 py-2 text-[#f5eee6] outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#a09083] font-semibold mb-1">
                    Zugeordnete Hauptkategorie:
                  </label>
                  <select
                    value={newBgCategoryId}
                    onChange={e => setNewBgCategoryId(e.target.value)}
                    className="w-full bg-[#151311] border border-[#3b322a] rounded-lg px-3 py-2 text-[#f5eee6] outline-hidden"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[#a09083] font-semibold mb-1">
                    Atmosphäre / Stimmung (Mood):
                  </label>
                  <input
                    type="text"
                    value={newBgMood}
                    onChange={e => setNewBgMood(e.target.value)}
                    placeholder="z.B. Sommerlich, sonnendurchflutet, warme Steine"
                    className="w-full bg-[#151311] border border-[#3b322a] rounded-lg px-3 py-2 text-[#f5eee6] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#a09083] font-semibold mb-1">
                    Dezente Hintergrundfarbe:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newBgColor}
                      onChange={e => setNewBgColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-[#3b322a] bg-transparent cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={newBgColor}
                      onChange={e => setNewBgColor(e.target.value)}
                      className="w-28 bg-[#151311] border border-[#3b322a] rounded-lg px-2.5 py-1.5 font-mono text-xs text-[#cfc0b2]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[#a09083] font-semibold mb-1">
                  Fotografische Kulissen-Beschreibung (Food-Photography Backdrop):
                </label>
                <textarea
                  rows={2}
                  value={newBgPrompt}
                  onChange={e => setNewBgPrompt(e.target.value)}
                  placeholder="z.B. Warm natural light travertine stone surface with gentle shadows, sun-drenched Mediterranean kitchen table."
                  className="w-full bg-[#151311] border border-[#3b322a] rounded-lg p-2.5 text-xs text-[#ded3c8] outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingBg(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#9c8e82] hover:text-[#f5eee6]"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#c46637] hover:bg-[#d6723e] text-white font-medium text-xs shadow-sm"
                >
                  Hintergrund anlegen & auswählen
                </button>
              </div>
            </form>
          )}

          {/* Backgrounds Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBackgrounds.map(bg => {
              const isSelected = currentBackgroundId === bg.id;
              const cat = categories.find(c => c.id === bg.categoryId);

              return (
                <div
                  key={bg.id}
                  onClick={() => onSelectBackground(bg.id)}
                  className={`rounded-xl p-4 border text-left cursor-pointer transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#29221c] border-[#c46637] shadow-lg ring-1 ring-[#c46637]'
                      : 'bg-[#211d19] border-[#362e26] hover:border-[#4d4034]'
                  }`}
                >
                  <div>
                    {/* Header swatch & title */}
                    <div className="flex items-start gap-3 mb-2.5">
                      <div
                        className="w-12 h-12 rounded-xl shrink-0 shadow-inner border flex items-center justify-center"
                        style={{
                          background: bg.previewGradient || bg.previewColor,
                          borderColor: bg.previewBorderColor || '#D5C4B4',
                        }}
                      >
                        {bg.isNeutralDefault && (
                          <span className="text-[9px] font-bold uppercase text-[#735848]">
                            Basis
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-semibold text-xs text-[#f5eee6] truncate">
                            {bg.name}
                          </h4>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1 shrink-0">
                              <Check className="w-3 h-3" /> Aktiv
                            </span>
                          )}
                        </div>

                        {cat && (
                          <div className="flex items-center gap-1.5 text-[10.5px] mt-0.5">
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: cat.accentColor }}
                            />
                            <span className="text-[#a89789] uppercase tracking-wider font-semibold">
                              {cat.label}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-[#9c8e82] leading-snug mb-2">
                      {bg.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#2e261f] flex items-center justify-between text-[10px]">
                    <span className="text-[#bfae9f] italic truncate max-w-[240px]">
                      Stil: {bg.mood}
                    </span>

                    <div className="flex items-center gap-2">
                      {bg.isCustomUserCreated && (
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            if (confirm(`Hintergrund „${bg.name}“ wirklich löschen?`)) {
                              onDeleteBackground(bg.id);
                            }
                          }}
                          className="text-stone-500 hover:text-rose-400 p-1 rounded"
                          title="Benutzerdefinierten Hintergrund löschen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onSelectBackground(bg.id);
                        }}
                        className={`px-2.5 py-1 rounded text-[10.5px] font-medium transition-colors ${
                          isSelected
                            ? 'bg-[#c46637] text-white'
                            : 'bg-[#2e2721] text-[#cfc0b2] hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Ausgewählt' : 'Für Bild wählen'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#312a23] bg-[#24201c] flex items-center justify-between text-xs text-[#9c8e82]">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#c46637]" />
            <span>
              Tipp: Der gewählte Hintergrund definiert die fotografische Kulisse und bleibt innerhalb der Hauptkategorie harmonisch konsistent.
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#c46637] hover:bg-[#d6723e] text-white font-medium text-xs transition-colors"
          >
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
};
