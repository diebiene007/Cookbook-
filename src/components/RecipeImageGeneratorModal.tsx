import React, { useState, useEffect } from 'react';
import { RecipePageData, ImageVerificationResult } from '../types/recipe';
import { CustomBackground, BackgroundCategory } from '../types/backgrounds';
import {
  Sparkles,
  RefreshCw,
  Dices,
  Check,
  X,
  AlertCircle,
  Eye,
  Camera,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  Sun,
  Palette,
  Info,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface RecipeImageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: RecipePageData;
  backgrounds: CustomBackground[];
  categories: BackgroundCategory[];
  onApplyImage: (imageUrl: string, verification?: ImageVerificationResult) => void;
  onOpenBackgroundManager?: () => void;
}

export const RecipeImageGeneratorModal: React.FC<RecipeImageGeneratorModalProps> = ({
  isOpen,
  onClose,
  recipe,
  backgrounds,
  categories,
  onApplyImage,
  onOpenBackgroundManager,
}) => {
  // Options state
  const [backgroundOption, setBackgroundOption] = useState<string>('auto');
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');

  // Generation state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<{
    dishName?: string;
    visualSummary?: string;
    visibleIngredients?: string[];
    transformedTextures?: string;
    chosenPerspective?: string;
    tablewareAndProps?: string;
    lightingAndMood?: string;
    finalPhotoPrompt?: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [activeCompareTab, setActiveCompareTab] = useState<'generated' | 'current'>('generated');

  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<ImageVerificationResult | null>(null);
  const [verifiedImageUrl, setVerifiedImageUrl] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Filter backgrounds matching this season or general
  const seasonBackgrounds = backgrounds.filter(
    b => b.season === recipe.season || b.categoryId.toLowerCase() === recipe.season.toLowerCase()
  );

  // Reset or preset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      // Preselect recipe custom background if assigned, else 'auto'
      if (recipe.customBackgroundId) {
        setBackgroundOption(recipe.customBackgroundId);
      } else {
        setBackgroundOption('auto');
      }
    }
  }, [isOpen, recipe.customBackgroundId]);

  if (!isOpen) return null;

  // Determine active background details
  let effectiveBgName = '';
  let effectiveBgPrompt = '';
  if (backgroundOption === 'auto') {
    const matchedBg =
      (recipe.customBackgroundId && backgrounds.find(b => b.id === recipe.customBackgroundId)) ||
      seasonBackgrounds.find(b => b.isSeasonalDefault) ||
      seasonBackgrounds[0];
    if (matchedBg) {
      effectiveBgName = matchedBg.name;
      effectiveBgPrompt = matchedBg.backdropPrompt;
    } else {
      effectiveBgName = `Saisonaler ${recipe.season}-Stil`;
      effectiveBgPrompt = `Harmonious seasonal backdrop fitting ${recipe.season} mood.`;
    }
  } else if (backgroundOption === 'zeitlos') {
    effectiveBgName = 'Warmes Studio-Greige & Sandstein (Zeitlos)';
    effectiveBgPrompt = 'Fine mineral greige sandstone surface with neutral daylight, soft natural textures.';
  } else if (backgroundOption === 'none') {
    effectiveBgName = 'Kein spezieller Hintergrund (Neutraler Studio-Untergrund)';
    effectiveBgPrompt = 'Clean warm neutral studio surface, minimalist culinary styling.';
  } else {
    const custom = backgrounds.find(b => b.id === backgroundOption);
    if (custom) {
      effectiveBgName = custom.name;
      effectiveBgPrompt = custom.backdropPrompt;
    }
  }

  // Multi-stage loading animation
  const runGeneration = async (isVariant: boolean = false) => {
    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStage('Analysiere Rezeptzutaten, Mengen & Garprozesse...');

    const stageTimer1 = setTimeout(() => {
      setLoadingStage('Ermittle sichtbare Texturen & Anrichteweise...');
    }, 1200);

    const stageTimer2 = setTimeout(() => {
      setLoadingStage(`Inszeniere ${recipe.season}-Lichtstimmung & Kulisse...`);
    }, 2800);

    const stageTimer3 = setTimeout(() => {
      setLoadingStage('Generiere fotorealistisches 1:1 Food-Foto via Gemini...');
    }, 4500);

    try {
      const response = await fetch('/api/generate-recipe-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: recipe.title,
          season: recipe.season,
          category: recipe.category,
          tags: recipe.tags,
          columnLeft: recipe.columnLeft,
          columnRight: recipe.columnRight,
          steps: recipe.steps,
          backgroundName: effectiveBgName,
          backgroundPrompt: effectiveBgPrompt,
          additionalInstructions: additionalInstructions.trim(),
          isVariant,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Fehler beim Generieren des Bildes.');
      }

      const newImageUrl = data.imageUrl;
      setGeneratedImageUrl(newImageUrl);
      setAnalysisData(data.analysis || null);
      setActiveCompareTab('generated');
      // Reset any previous verification
      setVerificationResult(null);
      setVerifiedImageUrl(null);
      setVerificationError(null);

      // Automatic multimodal verification immediately following generation
      verifyImage(newImageUrl);
    } catch (err: any) {
      console.error('Error generating recipe image:', err);
      setErrorMsg(err.message || 'Die Bildgenerierung konnte nicht abgeschlossen werden.');
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  const currentDisplayedUrl =
    activeCompareTab === 'generated' ? generatedImageUrl : recipe.photoUrl;

  // Helper to convert blob: URLs or external images to Base64 data URLs before sending to server
  const prepareImageForVerification = async (imageUrl: string): Promise<string> => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('data:image/')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('blob:')) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
    // Remote HTTP(S) asset: try fetching client-side to convert into Data-URL.
    // If CORS or network prevents client reading, throw explicit error instead of falling back to server fetch.
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      try {
        const response = await fetch(imageUrl, { mode: 'cors' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const blob = await response.blob();
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch {
        throw new Error(
          'Das Foto ist nutzbar, konnte aber aufgrund externer Zugriffsbeschränkungen (CORS) nicht visuell geprüft werden.'
        );
      }
    }

    // Local assets or others remain as path string (to be checked by server in src/assets/images/)
    return imageUrl;
  };

  // Central verify function sending prepared image data and full RecipePageData
  const verifyImage = async (targetUrl: string): Promise<ImageVerificationResult | null> => {
    if (!targetUrl) return null;
    setIsVerifying(true);
    setVerificationError(null);
    try {
      const preparedImageUrl = await prepareImageForVerification(targetUrl);

      const res = await fetch('/api/verify-recipe-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: preparedImageUrl,
          recipe,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Fehler bei der Bildprüfung.');
      }

      setVerificationResult(data.verification);
      // Keep the original targetUrl as the verified image identity
      setVerifiedImageUrl(targetUrl);
      return data.verification;
    } catch (err: any) {
      console.error('Error verifying recipe image:', err);
      setVerificationError(
        'Bild wurde erzeugt, die zusätzliche KI-Bildprüfung konnte jedoch nicht abgeschlossen werden.'
      );
      setVerificationResult(null);
      setVerifiedImageUrl(null);
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualVerify = () => {
    if (currentDisplayedUrl) {
      verifyImage(currentDisplayedUrl);
    }
  };

  const handleApply = () => {
    if (generatedImageUrl) {
      // Only attach verification if it was verified strictly for this exact generatedImageUrl
      const applicableVerification =
        verifiedImageUrl === generatedImageUrl ? verificationResult || undefined : undefined;
      onApplyImage(generatedImageUrl, applicableVerification);
      onClose();
    }
  };

  const quickInstructions = [
    'Etwas näher herangezoomt (Close-Up)',
    'Rustikaler auf Holzbrett anrichten',
    'Dampfend heiß serviert',
    'Erhöhte Schale auf Leinentuch',
    'Eine angeschnittene Portion zeigen',
    'Sehr minimalistisch & modern',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[#1b1714] border border-[#3b3127] rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#2d251e] flex items-center justify-between bg-[#221c17]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c46637] to-[#8c3e17] flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial-serif text-lg font-bold uppercase tracking-wider text-[#f5eee6]">
                  KI-Food-Foto Generator
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#c46637]/20 border border-[#c46637]/40 text-[#d97d4f]">
                  {recipe.season}
                </span>
                <span className="text-[10px] text-[#8e8074]">· {recipe.category}</span>
              </div>
              <p className="text-xs text-[#a09083] font-editorial-serif tracking-wide truncate max-w-md">
                Rezepttreue Visualisierung: <strong className="text-[#f5eee6]">{recipe.title}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9c8e82] hover:text-[#f5eee6] hover:bg-[#2e261f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split into Settings & Visual Preview */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Settings (5 cols) */}
          <div className="lg:col-span-5 space-y-4 text-xs">
            {/* Foto-Kulisse / Untergrund Auswahl */}
            <div className="bg-[#151210] p-3.5 rounded-xl border border-[#2f2720] space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[#c46637] font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  Foto-Kulisse / Untergrund (§4):
                </label>
                {onOpenBackgroundManager && (
                  <button
                    type="button"
                    onClick={onOpenBackgroundManager}
                    className="text-[10px] text-[#baa99b] hover:text-[#f5eee6] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Foto-Kulissen verwalten...
                  </button>
                )}
              </div>

              <select
                value={backgroundOption}
                onChange={e => setBackgroundOption(e.target.value)}
                className="w-full bg-[#201b17] border border-[#3d3227] focus:border-[#c46637] rounded-lg px-3 py-2 text-[#f5eee6] outline-hidden text-xs"
              >
                <option value="auto">
                  ✨ Automatisch passend zur Saison ({recipe.season})
                </option>
                <option value="zeitlos">
                  ⚖️ Zeitlose Foto-Kulisse (Greige & Sandstein)
                </option>
                <option value="none">
                  ⚪ Kein spezieller Kulissen-Hintergrund (Dezenter Studio-Untergrund)
                </option>

                {seasonBackgrounds.length > 0 && (
                  <optgroup label={`Eigene Foto-Kulissen: ${recipe.season}`}>
                    {seasonBackgrounds.map(bg => (
                      <option key={bg.id} value={bg.id}>
                        🎨 {bg.name}
                      </option>
                    ))}
                  </optgroup>
                )}

                <optgroup label="Alle hinterlegten Foto-Kulissen">
                  {backgrounds
                    .filter(bg => !seasonBackgrounds.some(sb => sb.id === bg.id))
                    .map(bg => (
                      <option key={bg.id} value={bg.id}>
                        {bg.name}
                      </option>
                    ))}
                </optgroup>
              </select>

              <div className="text-[10px] text-[#8e8074] bg-[#1a1613] p-2 rounded-lg border border-[#2a221b] flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#c46637] shrink-0 mt-0.5" />
                <span>
                  Aktive Foto-Kulisse: <strong className="text-[#cfc0b2]">{effectiveBgName}</strong>. Licht, Schatten und Geschirr des Food-Fotos werden harmonisch auf diesen Untergrund abgestimmt.
                </span>
              </div>
            </div>

            {/* Optional Additional Instructions */}
            <div className="bg-[#151210] p-3.5 rounded-xl border border-[#2f2720] space-y-2">
              <label className="text-[#cfc0b2] font-semibold text-[11px] flex items-center justify-between">
                <span>Zusätzliche Bildanweisung (optional):</span>
                <span className="text-[9.5px] text-[#8e8074] font-normal">Rezepttreue bleibt Priorität 1</span>
              </label>

              <textarea
                value={additionalInstructions}
                onChange={e => setAdditionalInstructions(e.target.value)}
                placeholder="Z. B. „Etwas näher fotografiert“, „Rustikaler anrichten“, „Dunkler Holztisch“, „Eine angeschnittene Portion zeigen“..."
                rows={3}
                className="w-full bg-[#201b17] border border-[#3d3227] focus:border-[#c46637] rounded-lg p-2.5 text-[#f5eee6] placeholder-[#6b5d51] text-xs outline-hidden resize-none"
              />

              {/* Quick suggestions chips */}
              <div className="space-y-1">
                <span className="text-[9.5px] text-[#8e8074]">Vorschläge:</span>
                <div className="flex flex-wrap gap-1">
                  {quickInstructions.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setAdditionalInstructions(prev =>
                          prev ? `${prev}, ${chip}` : chip
                        )
                      }
                      className="text-[9.5px] px-2 py-0.5 rounded-md bg-[#221c17] hover:bg-[#342b23] border border-[#362c22] text-[#baa99b] hover:text-[#f5eee6] transition-colors"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Analysis & Strategy Transparency Accordion */}
            {analysisData && (
              <div className="bg-[#181411] rounded-xl border border-[#2d251e] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full px-3 py-2 text-left flex items-center justify-between text-[#baa99b] hover:text-[#f5eee6] text-xs font-semibold"
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#c46637]" />
                    Semantische Rezeptanalyse einsehen
                  </span>
                  {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showDetails && (
                  <div className="p-3 pt-1 space-y-2 border-t border-[#261f18] text-[10.5px] text-[#9c8e82] bg-[#14110f]">
                    <div>
                      <strong className="text-[#cfc0b2] block">Sichtbare Komponenten:</strong>
                      <span>{analysisData.visibleIngredients?.join(', ') || 'Aus Zutaten abgeleitet'}</span>
                    </div>
                    <div>
                      <strong className="text-[#cfc0b2] block">Perspektive & Geschirr:</strong>
                      <span>{analysisData.chosenPerspective} · {analysisData.tablewareAndProps}</span>
                    </div>
                    <div>
                      <strong className="text-[#cfc0b2] block">Licht & Atmosphäre:</strong>
                      <span>{analysisData.lightingAndMood}</span>
                    </div>
                    {analysisData.finalPhotoPrompt && (
                      <div>
                        <strong className="text-[#cfc0b2] block">Finaler Bildprompt (Englisch):</strong>
                        <p className="font-mono text-[9px] bg-[#1d1814] p-1.5 rounded border border-[#2e251c] text-[#8e8074] leading-relaxed max-h-24 overflow-y-auto">
                          {analysisData.finalPhotoPrompt}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Multimodal AI Recipe-Fidelity Verification Card */}
            {currentDisplayedUrl && (
              <div className="bg-[#161311] rounded-xl border border-[#2e261f] p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#d97d4f] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    KI-Rezepttreueprüfung (§13 &amp; §14)
                  </span>
                  <button
                    type="button"
                    disabled={isVerifying}
                    onClick={handleManualVerify}
                    className="px-2.5 py-1 rounded-lg bg-[#27211b] hover:bg-[#342b23] border border-[#3b3127] text-[10.5px] text-[#ded3c8] hover:text-white font-medium flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin text-[#c46637]" />
                        <span>Prüfe...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-[#c46637]" />
                        <span>{verifiedImageUrl === currentDisplayedUrl ? 'Erneut prüfen' : 'Jetzt visuell prüfen'}</span>
                      </>
                    )}
                  </button>
                </div>

                {isVerifying ? (
                  <div className="p-2.5 rounded-lg bg-[#1e1915] border border-[#342a22] flex items-center gap-2 text-[10.5px] text-[#baa99b]">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c46637]" />
                    <span>Bild erstellt · Rezepttreue wird geprüft …</span>
                  </div>
                ) : verificationError ? (
                  <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-900/40 text-[10.5px] text-rose-300">
                    {verificationError}
                  </div>
                ) : verificationResult && verifiedImageUrl === currentDisplayedUrl ? (
                  <div className="space-y-2 text-[10.5px]">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#1e1915] border border-[#342a22]">
                      <span className="text-[#baa99b]">Kulinarischer Treuescore:</span>
                      <span
                        className={`font-mono font-bold text-xs ${
                          verificationResult.fidelityScore >= 80
                            ? 'text-emerald-400'
                            : verificationResult.fidelityScore >= 60
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {verificationResult.fidelityScore} / 100
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        {verificationResult.matchesRecipe ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        )}
                        <span className={verificationResult.matchesRecipe ? 'text-[#ded3c8]' : 'text-rose-300 font-medium'}>
                          {verificationResult.matchesRecipe
                            ? 'Gericht & Zutaten stimmen überein'
                            : 'Abweichung bei den Zutaten festgestellt'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!verificationResult.containsTextOrLogo ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        )}
                        <span className={!verificationResult.containsTextOrLogo ? 'text-[#ded3c8]' : 'text-rose-300 font-medium'}>
                          {!verificationResult.containsTextOrLogo
                            ? 'Keine Texte oder Logos im Bild (editorial konform)'
                            : 'Störende Schriften / Labels im Foto erkannt!'}
                        </span>
                      </div>
                    </div>

                    {verificationResult.unexpectedVisibleIngredients && verificationResult.unexpectedVisibleIngredients.length > 0 && (
                      <div className="p-1.5 rounded bg-rose-950/30 border border-rose-900/40 text-[10px] text-rose-300">
                        <strong>Unerwartete Zutaten im Bild:</strong> {verificationResult.unexpectedVisibleIngredients.join(', ')}
                      </div>
                    )}

                    {verificationResult.notes && verificationResult.notes.length > 0 && (
                      <div className="text-[9.5px] text-[#9c8e82] italic leading-tight">
                        „{verificationResult.notes[0]}“
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[10px] text-[#786c62] leading-relaxed">
                    Lasse Gemini 3.8 Flash das aktuelle Foto auf Textfreiheit, Buchtauglichkeit und Übereinstimmung mit den Rezeptzutaten überprüfen.
                  </p>
                )}
              </div>
            )}

            {/* Error Message if any */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong>Hinweis zur Generierung:</strong>
                  <p className="text-[11px] leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Visual Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#f5eee6] flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#c46637]" />
                  Food-Foto Vorschau (Format 1:1)
                </span>

                {generatedImageUrl && recipe.photoUrl && (
                  <div className="flex items-center gap-1 bg-[#151210] p-0.5 rounded-lg border border-[#2e261f]">
                    <button
                      type="button"
                      onClick={() => setActiveCompareTab('generated')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                        activeCompareTab === 'generated'
                          ? 'bg-[#c46637] text-white shadow-xs'
                          : 'text-[#8e8074] hover:text-[#ded3c8]'
                      }`}
                    >
                      Neu generiert
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCompareTab('current')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                        activeCompareTab === 'current'
                          ? 'bg-[#c46637] text-white shadow-xs'
                          : 'text-[#8e8074] hover:text-[#ded3c8]'
                      }`}
                    >
                      Bestehendes Foto
                    </button>
                  </div>
                )}
              </div>

              {/* Main Image Viewport 1:1 */}
              <div className="relative aspect-square w-full max-w-[420px] mx-auto rounded-2xl overflow-hidden border border-[#3b3227] bg-[#13110f] shadow-inner flex items-center justify-center">
                {isLoading ? (
                  <div className="p-6 text-center space-y-3.5 z-10">
                    <div className="w-12 h-12 rounded-full border-2 border-[#c46637] border-t-transparent animate-spin mx-auto" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[#f5eee6] font-editorial-serif tracking-wide">
                        KI generiert Rezeptfoto...
                      </p>
                      <p className="text-xs text-[#c46637] font-medium animate-pulse min-h-[20px]">
                        {loadingStage}
                      </p>
                      <p className="text-[10px] text-[#786c62]">
                        Auf Rezepttreue optimiert · Jahreszeit: {recipe.season}
                      </p>
                    </div>
                  </div>
                ) : generatedImageUrl && activeCompareTab === 'generated' ? (
                  <div className="w-full h-full relative group">
                    <img
                      src={generatedImageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-xs text-[10px] text-white font-medium flex items-center gap-1.5 shadow-sm">
                      <Sparkles className="w-3 h-3 text-[#d97d4f]" />
                      Editorial Food Photography (1:1)
                    </div>
                  </div>
                ) : recipe.photoUrl && (activeCompareTab === 'current' || !generatedImageUrl) ? (
                  <div className="w-full h-full relative">
                    <img
                      src={recipe.photoUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-xs text-[10px] text-[#cfc0b2] font-medium shadow-sm">
                      Aktuell hinterlegtes Foto
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center space-y-2 text-[#786c62]">
                    <Camera className="w-12 h-12 mx-auto text-[#42372d]" />
                    <p className="text-xs text-[#a09083]">
                      Noch kein KI-Bild generiert.
                    </p>
                    <p className="text-[10px] text-[#635548] max-w-xs">
                      Klicke unten auf „Bild generieren“, um die semantische Rezeptanalyse zu starten.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-3 border-t border-[#2a221b] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                {!generatedImageUrl ? (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => runGeneration(false)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#c46637] to-[#b35528] hover:from-[#d6723e] hover:to-[#c46637] text-white font-bold tracking-wide shadow-md flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    Bild generieren
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => runGeneration(false)}
                      className="px-3.5 py-2 rounded-xl bg-[#241e19] hover:bg-[#342b23] border border-[#3b3127] text-[#f5eee6] font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                      title="Generiert das Bild mit denselben Einstellungen neu"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                      Neu generieren
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => runGeneration(true)}
                      className="px-3.5 py-2 rounded-xl bg-[#241e19] hover:bg-[#342b23] border border-[#3b3127] text-[#f5eee6] font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                      title="Variiert Kamerawinkel, Anordnung und Licht – Rezepttreue bleibt priorisiert"
                    >
                      <Dices className="w-3.5 h-3.5 text-[#d97d4f]" />
                      Variante erstellen
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl bg-transparent hover:bg-[#251e18] text-[#9c8e82] hover:text-[#f5eee6] transition-colors cursor-pointer"
                >
                  Abbrechen
                </button>

                {generatedImageUrl && (
                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Bild übernehmen
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
