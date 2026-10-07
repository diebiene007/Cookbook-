import React, { useState } from 'react';
import { RecipePageData, Season, Category } from '../types/recipe';
import { Sparkles, Wand2, BookOpen, AlertCircle, CheckCircle2, ArrowRight, Loader2, X } from 'lucide-react';
import { DEFAULT_RECIPES } from '../data/defaultRecipes';
import { normalizeRecipeData } from '../utils/normalizeRecipe';

interface AssistantInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRecipe: (recipe: RecipePageData) => void;
}

export const AssistantInputModal: React.FC<AssistantInputModalProps> = ({
  isOpen,
  onClose,
  onApplyRecipe,
}) => {
  const [rawText, setRawText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<RecipePageData | null>(null);
  const [sourceNote, setSourceNote] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!rawText.trim()) {
      setErrorMsg('Bitte gib zuerst einen Rezepttext, Notizen oder Zutaten ein.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/parse-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });

      if (!res.ok) {
        throw new Error(`Server antwortete mit Status ${res.status}`);
      }

      const data = await res.json();
      if (data.recipe) {
        // Fully normalize recipe data with unique IDs and clean structure
        const completeRecipe = normalizeRecipeData(data.recipe);
        setAnalysisResult(completeRecipe);
        setSourceNote(data.sourceNote || 'Analyse erfolgreich abgeschlossen');
      } else {
        throw new Error('Kein Rezeptdaten-Objekt erhalten.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Fehler bei der Analyse: ${err.message}.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = (sample: RecipePageData) => {
    setAnalysisResult(sample);
    setRawText(
      `${sample.title}\n\nJahreszeit: ${sample.season} | Kategorie: ${sample.category}\nTags: ${sample.tags.join(', ')}\n\nZutaten:\n${sample.columnLeft.groups.map(g => g.header + ':\n' + g.items.map(i => `${i.amount || ''} ${i.name}`).join('\n')).join('\n')}\n\nZubereitung:\n${sample.steps.map(s => `${s.stepNumber}. ${s.title}: ${s.text}`).join('\n')}`
    );
  };

  const handleApply = () => {
    if (analysisResult) {
      onApplyRecipe(analysisResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1f1c19] text-[#e8ded5] border border-[#3d3630] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#342e28] flex items-center justify-between bg-[#26221e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#c46637]/20 border border-[#c46637]/40 flex items-center justify-center text-[#d97d4f]">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#f5eee6] font-editorial-sans">
                Produktionsassistent: Neues Rezept anlegen & redaktionell optimieren
              </h2>
              <p className="text-xs text-[#9c8e82]">
                Eingabe analysieren · Fehlendes ergänzen · 4 Tags · 2 Spalten · Mastervorlage befüllen
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Quick preset selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#b8a697] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#c46637]" />
                Oder Referenzrezept aus „Rezepte durchs Jahr“ laden:
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {DEFAULT_RECIPES.map(rec => (
                <button
                  key={rec.id}
                  onClick={() => handleLoadSample(rec)}
                  className="px-3 py-2 text-left rounded-lg bg-[#27221d] hover:bg-[#342d25] border border-[#3d342b] hover:border-[#c46637]/50 text-xs transition-colors"
                >
                  <div className="font-semibold text-[#f0e7df] truncate">{rec.title}</div>
                  <div className="text-[10.5px] text-[#9e8f83] truncate">
                    {rec.season} · {rec.masterVariant}er Vorlage
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Raw Text Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#b8a697] mb-2">
              Rezept-Informationen (Roh-Text, Notizen, Zutatenliste oder Ablauf):
            </label>
            <textarea
              rows={8}
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="Füge hier das Rezept ein, z.B.:
Chicken Gyros Pita Bowl
Zutaten: Hähnchenbrust 600g, 1½ Zitronen Saft und Abrieb, Knoblauchpulver, Salz Pfeffer, 4 Pitas, Gurke, Tomaten, rote Zwiebel, Hummus, Feta, Petersilie...
Zubereitung: Hähnchen würzen, im Airfryer 15 Min garen, Gemüse schneiden, Pitas toasten, anrichten..."
              className="w-full bg-[#171513] border border-[#3b332b] focus:border-[#c46637] focus:ring-1 focus:ring-[#c46637] rounded-xl p-3.5 text-xs text-[#eae2d8] placeholder:text-[#6a5e55] font-mono leading-relaxed outline-hidden"
            />
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#9e8f83]">
              {sourceNote && (
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {sourceNote}
                </span>
              )}
              {errorMsg && (
                <span className="inline-flex items-center gap-1.5 text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errorMsg}
                </span>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !rawText.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#c46637] hover:bg-[#d6723e] disabled:opacity-50 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-[#c46637]/20 transition-all cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redaktionelle Analyse läuft...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Rezept analysieren & Masterseite vorbereiten
                </>
              )}
            </button>
          </div>

          {/* Extracted preview card */}
          {analysisResult && (
            <div className="bg-[#24201c] border border-[#3e352d] rounded-xl p-4.5 space-y-3.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#362e26] pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d97d4f] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Ergebnis der redaktionellen Aufbereitung
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#342b23] border border-[#4a3e33] text-[#cfc0b2]">
                  Gewählte Vorlage: {analysisResult.masterVariant}er Vorlage
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[#8c7e73] block text-[10.5px]">Titel:</span>
                  <span className="font-semibold text-[#f5eee6]">{analysisResult.title}</span>
                </div>
                <div>
                  <span className="text-[#8c7e73] block text-[10.5px]">Saison & Kategorie:</span>
                  <span className="text-[#e8ded5]">
                    {analysisResult.season} · {analysisResult.category}
                  </span>
                </div>
                <div>
                  <span className="text-[#8c7e73] block text-[10.5px]">4 Tags:</span>
                  <span className="text-[#e8ded5]">{analysisResult.tags.join(' · ')}</span>
                </div>
                <div>
                  <span className="text-[#8c7e73] block text-[10.5px]">Gesamtzeit:</span>
                  <span className="text-[#e8ded5]">{analysisResult.quickFacts.totalTimeMin} Min</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-[#1b1816] p-2.5 rounded-lg border border-[#312a23]">
                  <span className="text-[10px] uppercase font-bold text-[#c46637] block mb-1">
                    Zutaten (Zweispaltig gegliedert)
                  </span>
                  <div className="text-[11px] text-[#baa99b]">
                    Links: {analysisResult.columnLeft.groups.map(g => g.header).join(', ')} | Rechts:{' '}
                    {analysisResult.columnRight.groups.map(g => g.header).join(', ')}
                  </div>
                </div>

                <div className="bg-[#1b1816] p-2.5 rounded-lg border border-[#312a23]">
                  <span className="text-[10px] uppercase font-bold text-[#c46637] block mb-1">
                    Achte auf (Kritischer Hinweis)
                  </span>
                  <div className="text-[11px] text-[#baa99b] italic">
                    „{analysisResult.watchOutTip}“
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#342e28] bg-[#24201c] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#baa99b] hover:text-[#f5eee6] hover:bg-[#2f2822] transition-colors"
          >
            Abbrechen
          </button>

          <button
            onClick={handleApply}
            disabled={!analysisResult}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
          >
            Fertige Rezeptseite in Mastervorlage übernehmen
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
