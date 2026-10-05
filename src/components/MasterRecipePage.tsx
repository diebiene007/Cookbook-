import React from 'react';
import { RecipePageData } from '../types/recipe';
import { CustomBackground } from '../types/backgrounds';
import { Clock, Users, UtensilsCrossed, AlertCircle, Sparkles } from 'lucide-react';

interface MasterRecipePageProps {
  recipe: RecipePageData;
  scale?: number;
  highlightBoxes?: boolean;
  background?: CustomBackground;
}

export const MasterRecipePage: React.FC<MasterRecipePageProps> = ({
  recipe,
  scale = 1,
  highlightBoxes = false,
  background,
}) => {
  const {
    title,
    season,
    category,
    tags,
    photoUrl,
    photoAlt,
    quickFacts,
    columnLeft,
    columnRight,
    steps,
    masterVariant,
    nutrition,
    watchOutTip,
    source,
    footerText,
  } = recipe;

  // Adaptive typography based on step variant (6, 8, 10, 12)
  const getStepTextSize = () => {
    switch (masterVariant) {
      case 12:
        return 'text-[9px] leading-[1.25]';
      case 10:
        return 'text-[10px] leading-[1.3]';
      case 8:
        return 'text-[10.5px] leading-[1.35]';
      case 6:
      default:
        return 'text-[11.5px] leading-[1.4]';
    }
  };

  const getStepPadding = () => {
    switch (masterVariant) {
      case 12:
        return 'p-1.5 min-h-[50px]';
      case 10:
        return 'p-2 min-h-[58px]';
      case 8:
        return 'p-2.5 min-h-[66px]';
      case 6:
      default:
        return 'p-3 min-h-[76px]';
    }
  };

  // Title size handling
  const titleSizeClass =
    title.length > 36
      ? 'text-[22px] tracking-wide'
      : title.length > 26
      ? 'text-[25px] tracking-wide'
      : 'text-[28px] tracking-wide';

  return (
    <div
      id="master-a4-page"
      className="print-page-target bg-[#FFF7F0] text-[#241E1A] relative flex flex-col justify-between overflow-hidden shadow-2xl transition-transform origin-top select-text"
      style={{
        width: '794px', // standard 96dpi A4 width
        height: '1123px', // standard 96dpi A4 height
        minWidth: '794px',
        minHeight: '1123px',
        maxWidth: '794px',
        maxHeight: '1123px',
        padding: '36px 42px 28px 42px',
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        boxSizing: 'border-box',
      }}
    >
      {/* ────────────────────────────────────────────────────────
          1. HEADER BLOCK: [Jahreszeit] · [Kategorie], TITEL, 4 TAGS
          ──────────────────────────────────────────────────────── */}
      <header className={`mb-3.5 ${highlightBoxes ? 'ring-1 ring-amber-400/40' : ''}`}>
        {/* Season & Category */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#876F61] mb-1">
          <span>{season.toUpperCase()}</span>
          <span className="text-[#BCAEA3] font-normal">·</span>
          <span>{category.toUpperCase()}</span>
        </div>

        {/* Recipe Title */}
        <h1
          className={`font-editorial-serif font-bold uppercase text-[#231A14] leading-[1.12] mb-2.5 ${titleSizeClass}`}
        >
          {title}
        </h1>

        {/* 4 Tags */}
        <div className="flex items-center gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-[#694F3E] bg-[#F7ECE1] border border-[#E8DACD]"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* ────────────────────────────────────────────────────────
          2. UPPER HERO GRID: FOTO (1:1), AUF EINEN BLICK, NÄHRWERTE, ACHTE AUF
          ──────────────────────────────────────────────────────── */}
      <section className={`grid grid-cols-12 gap-3.5 mb-3.5 ${highlightBoxes ? 'ring-1 ring-blue-400/40' : ''}`}>
        {/* Left: Square 1:1 Photo Frame */}
        <div className="col-span-5 flex flex-col justify-center items-center">
          <div
            className="w-[220px] h-[220px] rounded-xl overflow-hidden shadow-sm relative shrink-0 transition-colors"
            style={{
              backgroundColor: background?.previewColor || '#F0E5D9',
              borderColor: background?.previewBorderColor || '#E5D7CA',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
            title={background ? `Food-Foto (1:1 quadratisch) · Hintergrund: ${background.name}` : 'Food-Foto (1:1 quadratisch)'}
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={photoAlt || title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-[#8C7A6D]"
                style={{
                  background: background?.previewGradient || background?.previewColor || '#F0E5D9',
                }}
              >
                <Sparkles className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-[11px] font-medium uppercase tracking-wider">
                  {background?.name || 'Foto-Frame (1:1)'}
                </span>
                <span className="text-[9.5px] opacity-70 mt-1">
                  {background?.mood || 'Quadratisch · Keine Typografie'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Auf einen Blick + Nährwerte + Achte auf */}
        <div className="col-span-7 flex flex-col justify-between space-y-2">
          {/* Card: Auf einen Blick */}
          <div className="bg-[#FAF2EA] border border-[#ECDDCF] rounded-lg p-3">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#735848] mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8683B]"></span>
              Auf einen Blick
            </h3>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#A06440] shrink-0" />
                <span className="text-[#7C6C62]">Portionen:</span>
                <span className="font-semibold text-[#29221C]">{quickFacts.portions}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#A06440] shrink-0" />
                <span className="text-[#7C6C62]">Aktiv / Passiv:</span>
                <span className="font-semibold text-[#29221C]">
                  {quickFacts.activeTimeMin}m / {quickFacts.passiveTimeMin}m
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#A06440] shrink-0" />
                <span className="text-[#7C6C62]">Gesamtzeit:</span>
                <span className="font-semibold text-[#29221C]">
                  {quickFacts.totalTimeMin} Min
                </span>
              </div>
              <div className="flex items-center gap-1.5 truncate" title={quickFacts.utensils}>
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#A06440] shrink-0" />
                <span className="text-[#7C6C62]">Utensilien:</span>
                <span className="font-medium text-[#29221C] truncate">{quickFacts.utensils}</span>
              </div>
            </div>
          </div>

          {/* Card: Nährwerte pro Portion */}
          <div className="bg-[#FAF2EA] border border-[#ECDDCF] rounded-lg p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9.5px] font-bold tracking-[0.18em] uppercase text-[#735848]">
                Nährwerte pro Portion
              </span>
              <span className="text-[9px] text-[#8C7A6D]">Ca.-Angaben</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <div className="bg-[#FFF7F0] border border-[#E9DACD] rounded px-1 py-1">
                <div className="text-[12px] font-bold text-[#271E18]">{nutrition.calories}</div>
                <div className="text-[8.5px] text-[#8C7A6D] uppercase">kcal</div>
              </div>
              <div className="bg-[#FFF7F0] border border-[#E9DACD] rounded px-1 py-1">
                <div className="text-[12px] font-bold text-[#271E18]">{nutrition.carbs} g</div>
                <div className="text-[8.5px] text-[#8C7A6D] uppercase">Kohlenhydr.</div>
              </div>
              <div className="bg-[#FFF7F0] border border-[#E9DACD] rounded px-1 py-1">
                <div className="text-[12px] font-bold text-[#271E18]">{nutrition.protein} g</div>
                <div className="text-[8.5px] text-[#8C7A6D] uppercase">Proteine</div>
              </div>
              <div className="bg-[#FFF7F0] border border-[#E9DACD] rounded px-1 py-1">
                <div className="text-[12px] font-bold text-[#271E18]">{nutrition.fat} g</div>
                <div className="text-[8.5px] text-[#8C7A6D] uppercase">Fette</div>
              </div>
            </div>
          </div>

          {/* Card: Achte auf */}
          <div className="bg-[#F8EFE4] border-l-2 border-l-[#C46637] border-y border-r border-[#ECDDCF] rounded-r-lg p-2 flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-[#C46637] shrink-0 mt-0.5" />
            <div className="text-[10px] leading-[1.34] text-[#42342A]">
              <span className="font-bold tracking-wider uppercase text-[#C46637] mr-1">
                Achte auf:
              </span>
              {watchOutTip}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          3. ZUTATEN: 2 BALANCIERTE SPALTEN MIT LOGISCHEN GRUPPEN
          ──────────────────────────────────────────────────────── */}
      <section
        className={`bg-[#FAF2EA] border border-[#ECDDCF] rounded-lg p-3 mb-3.5 ${
          highlightBoxes ? 'ring-1 ring-green-400/40' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#735848] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8683B]"></span>
            Zutaten
          </h2>
          <span className="text-[9.5px] text-[#8C7A6D] tracking-wider uppercase">
            Zweispaltig strukturiert
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-5 text-[11px]">
          {/* Linke Spalte */}
          <div className="space-y-2">
            {columnLeft.groups.map(group => (
              <div key={group.id} className="space-y-0.5">
                <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#A06440] border-b border-[#E9DACD] pb-0.5 mb-1">
                  {group.header}
                </div>
                <ul className="space-y-0.5">
                  {group.items.map(item => (
                    <li key={item.id} className="flex items-baseline justify-between gap-1 leading-snug">
                      <span className="text-[#362C24]">
                        {item.name}
                      </span>
                      {item.amount && (
                        <span className="text-[#7A695E] font-medium text-[10.5px] shrink-0 text-right">
                          {item.amount}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Rechte Spalte */}
          <div className="space-y-2">
            {columnRight.groups.map(group => (
              <div key={group.id} className="space-y-0.5">
                <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#A06440] border-b border-[#E9DACD] pb-0.5 mb-1">
                  {group.header}
                </div>
                <ul className="space-y-0.5">
                  {group.items.map(item => (
                    <li
                      key={item.id}
                      className={`leading-snug ${
                        item.isGarnishCompact
                          ? 'text-[#5C4D43] italic text-[10.5px] py-0.5'
                          : 'flex items-baseline justify-between gap-1'
                      }`}
                    >
                      <span className="text-[#362C24]">{item.name}</span>
                      {item.amount && !item.isGarnishCompact && (
                        <span className="text-[#7A695E] font-medium text-[10.5px] shrink-0 text-right">
                          {item.amount}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          4. ZUBEREITUNG: 2-SPALTIGES GRID MIT SCHRITT-KARTEN (6, 8, 10, 12)
          ──────────────────────────────────────────────────────── */}
      <section
        className={`bg-[#FAF2EA] border border-[#ECDDCF] rounded-lg p-3 flex-1 flex flex-col justify-between mb-3 ${
          highlightBoxes ? 'ring-1 ring-purple-400/40' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#735848] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8683B]"></span>
            Zubereitung
          </h2>
          <span className="text-[9.5px] text-[#8C7A6D] tracking-wider uppercase">
            {masterVariant}er Vorlage · {steps.length} Schritte
          </span>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          {steps.map(step => (
            <div
              key={step.id}
              className={`bg-[#FFF7F0] border border-[#E9DACD] rounded-md flex gap-2 ${getStepPadding()} transition-all`}
            >
              {/* Step Number */}
              <div className="shrink-0 flex items-start pt-0.5">
                <span className="font-editorial-title text-[#C46637] text-[12px] font-bold tracking-wider">
                  {String(step.stepNumber).padStart(2, '0')}
                </span>
              </div>

              {/* Title & Action Text */}
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#2B2119] mb-0.5 truncate">
                  {step.title}
                </div>
                <p className={`text-[#45372E] text-pretty ${getStepTextSize()}`}>
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          5. FOOTER: QUELLE & „REZEPTE DURCHS JAHR“
          ──────────────────────────────────────────────────────── */}
      <footer
        className={`border-t border-[#E8DACD] pt-2 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-[#8C7A6D] ${
          highlightBoxes ? 'ring-1 ring-emerald-400/40' : ''
        }`}
      >
        <div className="truncate max-w-[400px]">
          {source ? (
            <span className="normal-case italic tracking-normal text-[#756458]">
              {source}
            </span>
          ) : (
            <span></span>
          )}
        </div>
        <div className="font-brand font-semibold text-[#735848]">
          {footerText || 'REZEPTE DURCHS JAHR'}
        </div>
      </footer>
    </div>
  );
};
