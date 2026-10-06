import React from 'react';
import { Season } from '../types/recipe';
import { getPageBackgroundById } from '../data/recipePageBackgrounds';

interface SeasonalBackgroundLayerProps {
  pageBackgroundId?: string;
  season?: Season;
  isThumbnail?: boolean;
}

/**
 * High-End Editorial Seasonal Background Layer.
 * - Base Warm Cream Paper: #FFF7F0
 * - Strictly respects recipe content safe-zones (no lines behind title, tags, ingredients or steps)
 * - 90% calm paper canvas, 10% delicate botanical art direction
 * - Watercolor washes are ultra-diffuse and borderless (4-8% opacity)
 * - Botanical line art is fine, organic and hand-drawn (8-14% opacity)
 * - 100% inline SVG vectors, fully print-safe and PDF-ready
 */
export const SeasonalBackgroundLayer: React.FC<SeasonalBackgroundLayerProps> = ({
  pageBackgroundId,
  season = 'Frühling',
  isThumbnail = false,
}) => {
  const bg = getPageBackgroundById(pageBackgroundId, season);
  const motif = bg.motifKey;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${
        isThumbnail ? 'w-full h-full' : 'z-0'
      }`}
      style={{
        width: isThumbnail ? '100%' : '794px',
        height: isThumbnail ? '100%' : '1123px',
        backgroundColor: '#FFF7F0',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 794 1123"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle diffused blur filter for organic watercolor aura */}
          <filter id="soft-wash-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="45" />
          </filter>
          <filter id="soft-wash-wide" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="65" />
          </filter>

          {/* Linen Texture Pattern for Zeitlos 1 */}
          <pattern id="linen-weave" width="16" height="16" patternUnits="userSpaceOnUse">
            <line x1="0" y1="8" x2="16" y2="8" stroke="#8A7B6E" strokeWidth="0.4" strokeOpacity="0.05" />
            <line x1="8" y1="0" x2="8" y2="16" stroke="#8A7B6E" strokeWidth="0.4" strokeOpacity="0.05" />
          </pattern>
        </defs>

        {/* ════════════════════════════════════════════════════════════
            1. FRÜHLING MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* FRÜHLING 1: Frische Kräuter (Basilikum- & Kräuterzweige strictly at corners) */}
        {motif === 'fruehling-kraeuter' && (
          <g>
            {/* Diffused corner watercolor aura */}
            <path
              d="M 680 -20 Q 770 10 810 110 Q 760 160 700 80 Z"
              fill="#7AA66E"
              opacity="0.07"
              filter="url(#soft-wash-blur)"
            />
            <path
              d="M -20 1040 Q 60 1010 100 1140 Z"
              fill="#88B27F"
              opacity="0.06"
              filter="url(#soft-wash-blur)"
            />

            {/* Hand-drawn herb sprig top right corner (creeping from edge) */}
            <g stroke="#3F6335" strokeWidth="0.9" fill="none" opacity="0.14" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 794 15 C 772 32, 755 58, 742 90 C 738 100, 735 118, 738 132" />
              {/* Herb leaf pairs */}
              <path d="M 770 34 C 754 22, 744 14, 756 6 C 768 -2, 778 16, 770 34 Z" fill="#6E9864" fillOpacity="0.12" />
              <path d="M 764 42 C 776 56, 782 72, 770 76 C 758 80, 754 62, 764 42 Z" fill="#7AA66E" fillOpacity="0.12" />
              <path d="M 748 74 C 732 64, 722 54, 734 46 C 746 38, 756 56, 748 74 Z" fill="#6E9864" fillOpacity="0.12" />
              <path d="M 744 82 C 754 98, 756 112, 744 116 C 732 120, 734 102, 744 82 Z" fill="#88B27F" fillOpacity="0.12" />
            </g>

            {/* Delicate lower-left sprig */}
            <g stroke="#3F6335" strokeWidth="0.85" fill="none" opacity="0.13" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 5 1120 C 24 1098, 38 1072, 42 1045" />
              <path d="M 22 1102 C 34 1088, 44 1082, 38 1074 C 32 1066, 18 1082, 22 1102 Z" fill="#6E9864" fillOpacity="0.11" />
              <path d="M 34 1078 C 48 1064, 58 1060, 52 1052 C 46 1044, 30 1060, 34 1078 Z" fill="#7AA66E" fillOpacity="0.11" />
            </g>
          </g>
        )}

        {/* FRÜHLING 2: Zarte Blätter (Aquarellierte junge Blätter entlang der Seitenkante) */}
        {motif === 'fruehling-blaetter' && (
          <g>
            <path
              d="M 740 60 Q 820 120 780 240 Q 720 180 740 60 Z"
              fill="#88B27F"
              opacity="0.06"
              filter="url(#soft-wash-blur)"
            />
            {/* Fine cascading branch strictly on outer 30px margin */}
            <g stroke="#426639" strokeWidth="0.85" fill="none" opacity="0.13" strokeLinecap="round">
              <path d="M 790 30 C 778 90, 775 160, 782 230 C 785 260, 778 300, 772 340" />
              <path d="M 784 70 C 768 56, 758 46, 768 40 C 778 34, 786 52, 784 70 Z" fill="#7AA66E" fillOpacity="0.12" />
              <path d="M 780 120 C 764 108, 754 98, 764 92 C 774 86, 782 102, 780 120 Z" fill="#6E9864" fillOpacity="0.12" />
              <path d="M 778 180 C 762 170, 752 160, 762 154 C 772 148, 780 162, 778 180 Z" fill="#88B27F" fillOpacity="0.12" />
              <path d="M 780 240 C 766 230, 756 222, 766 216 C 776 210, 782 224, 780 240 Z" fill="#7AA66E" fillOpacity="0.12" />
            </g>
          </g>
        )}

        {/* FRÜHLING 3: Reduzierte Frühlingsblüten (Wenige zarte Knospen & Blüten im Editorial-Look) */}
        {motif === 'fruehling-blueten' && (
          <g>
            <path
              d="M 700 -10 Q 780 20 810 120 Q 730 90 700 -10 Z"
              fill="#A2C497"
              opacity="0.06"
              filter="url(#soft-wash-blur)"
            />
            {/* Delicate twig with subtle blossom silhouette in extreme corner */}
            <g stroke="#48683D" strokeWidth="0.8" fill="none" opacity="0.14" strokeLinecap="round">
              <path d="M 794 20 C 774 38, 760 62, 752 88" />
              {/* Petals */}
              <path d="M 752 88 C 744 76, 736 82, 742 94 C 748 104, 758 98, 752 88 Z" fill="#FFF7F0" stroke="#48683D" strokeWidth="0.7" fillOpacity="0.8" />
              <path d="M 752 88 C 762 80, 768 88, 762 98 C 756 106, 746 98, 752 88 Z" fill="#FFF7F0" stroke="#48683D" strokeWidth="0.7" fillOpacity="0.8" />
              <circle cx="752" cy="88" r="1.5" fill="#D98A3B" fillOpacity="0.4" stroke="none" />
              <path d="M 772 45 C 758 35, 754 44, 766 52 Z" fill="#7AA66E" fillOpacity="0.12" />
            </g>
          </g>
        )}

        {/* FRÜHLING 4: Botanical Line Art (Minimalistische Linienführung ohne Flächen) */}
        {motif === 'fruehling-line-art' && (
          <g>
            <g stroke="#3E6135" strokeWidth="0.75" fill="none" opacity="0.12" strokeLinecap="round">
              {/* Continuous one-line botanical gesture hugging upper right boundary */}
              <path d="M 794 10 C 765 25, 750 50, 745 80 C 740 110, 748 140, 742 170" />
              <path d="M 762 38 C 748 30, 742 22, 752 18 C 762 14, 770 28, 762 38" />
              <path d="M 748 76 C 734 68, 728 58, 738 54 C 748 50, 756 66, 748 76" />
              <path d="M 744 122 C 730 114, 726 106, 736 102 C 744 98, 752 112, 744 122" />
              {/* Tiny watercolor accent tucked behind line */}
              <circle cx="750" cy="50" r="12" fill="#7AA66E" fillOpacity="0.06" stroke="none" filter="url(#soft-wash-blur)" />
            </g>
          </g>
        )}

        {/* FRÜHLING 5: Salbei-Aquarell (Weiche diffuse Farbschleier an gegenüberliegenden Ecken) */}
        {motif === 'fruehling-aquarell' && (
          <g>
            <path
              d="M 640 -40 C 720 -20, 810 40, 810 140 C 750 140, 680 80, 640 -40 Z"
              fill="#7AA66E"
              opacity="0.08"
              filter="url(#soft-wash-wide)"
            />
            <path
              d="M -40 1020 C 40 1020, 140 1080, 120 1150 C 40 1150, -20 1100, -40 1020 Z"
              fill="#88B27F"
              opacity="0.07"
              filter="url(#soft-wash-wide)"
            />
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            2. SOMMER MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* SOMMER 1: Kleiner Zitronenzweig (Dezenter Zweig mit kleiner Fruchtsilhouette) */}
        {motif === 'sommer-zitrone' && (
          <g>
            <path
              d="M 690 -20 Q 780 10 810 100 Q 750 140, 690 -20 Z"
              fill="#E8A64E"
              opacity="0.07"
              filter="url(#soft-wash-blur)"
            />
            <g stroke="#78592A" strokeWidth="0.85" fill="none" opacity="0.14" strokeLinecap="round">
              <path d="M 794 15 C 772 32, 755 58, 748 85" />
              {/* Citrus leaves */}
              <path d="M 770 32 C 756 20, 748 14, 758 8 C 768 2, 778 18, 770 32 Z" fill="#788850" fillOpacity="0.12" />
              <path d="M 754 75 C 740 65, 734 55, 744 50 C 754 44, 762 62, 754 75 Z" fill="#788850" fillOpacity="0.12" />
              {/* Small understated lemon silhouette */}
              <path
                d="M 748 85 C 744 98, 750 110, 760 114 C 770 116, 778 106, 774 92 C 770 82, 754 78, 748 85 Z"
                fill="#F0C265"
                fillOpacity="0.22"
                stroke="#9E7030"
                strokeWidth="0.75"
              />
            </g>
          </g>
        )}

        {/* SOMMER 2: Olivenzweige (Feine toskanische Olivenblätter am Seitenrand) */}
        {motif === 'sommer-oliven' && (
          <g>
            <path
              d="M 740 40 Q 820 120 780 250 Q 730 180 740 40 Z"
              fill="#8A8E6F"
              opacity="0.06"
              filter="url(#soft-wash-blur)"
            />
            <g stroke="#565942" strokeWidth="0.85" fill="none" opacity="0.13" strokeLinecap="round">
              <path d="M 790 20 C 778 80, 775 160, 780 230 C 784 270, 778 320, 772 370" />
              {/* Slender willow-like olive leaves */}
              <path d="M 782 60 C 760 52, 750 46, 762 40 C 774 34, 784 48, 782 60 Z" fill="#787352" fillOpacity="0.12" />
              <path d="M 778 110 C 758 104, 748 98, 758 92 C 768 86, 780 98, 778 110 Z" fill="#787352" fillOpacity="0.12" />
              <path d="M 778 170 C 756 166, 746 160, 756 154 C 766 148, 780 158, 778 170 Z" fill="#787352" fillOpacity="0.12" />
              <path d="M 779 230 C 758 226, 748 220, 758 214 C 768 208, 780 218, 779 230 Z" fill="#787352" fillOpacity="0.12" />
              {/* Subtle dark olive drops */}
              <ellipse cx="766" cy="116" rx="3.5" ry="5" fill="#3D3A2C" fillOpacity="0.18" stroke="none" />
              <ellipse cx="764" cy="235" rx="3.5" ry="5" fill="#3D3A2C" fillOpacity="0.18" stroke="none" />
            </g>
          </g>
        )}

        {/* SOMMER 3: Rosmarin / Sommerkräuter (Zarte Rosmarinnadeln als Randgestaltung) */}
        {motif === 'sommer-kraeuter' && (
          <g>
            <path
              d="M 720 0 Q 800 30 810 140 Q 740 100 720 0 Z"
              fill="#B08D5B"
              opacity="0.06"
              filter="url(#soft-wash-blur)"
            />
            <g stroke="#665034" strokeWidth="0.8" fill="none" opacity="0.13" strokeLinecap="round">
              <path d="M 794 15 C 776 50, 768 110, 772 170 C 775 210, 768 260, 762 300" />
              <path d="M 782 45 L 766 38 M 780 55 L 794 48 M 774 85 L 758 78 M 774 95 L 790 88" />
              <path d="M 770 130 L 754 124 M 771 140 L 787 134 M 770 175 L 754 170 M 770 185 L 786 180" />
            </g>
          </g>
        )}

        {/* SOMMER 4: Apricot-Honig-Aquarell (Weiche warme Sonnenschleier) */}
        {motif === 'sommer-aquarell' && (
          <g>
            <path
              d="M 620 -40 C 710 -20, 810 30, 810 130 C 750 140, 670 70, 620 -40 Z"
              fill="#E8A65C"
              opacity="0.08"
              filter="url(#soft-wash-wide)"
            />
            <path
              d="M -30 1030 C 50 1020, 130 1080, 110 1150 C 40 1150, -20 1100, -30 1030 Z"
              fill="#E29B38"
              opacity="0.06"
              filter="url(#soft-wash-wide)"
            />
          </g>
        )}

        {/* SOMMER 5: Mediterrane botanische Line Art (Organische Konturlinien) */}
        {motif === 'sommer-line-art' && (
          <g>
            <g stroke="#916132" strokeWidth="0.75" fill="none" opacity="0.12" strokeLinecap="round">
              <path d="M 794 15 C 765 35, 750 75, 755 120 C 760 165, 745 210, 748 260" />
              <path d="M 764 45 C 748 40, 740 50, 748 60 C 758 70, 768 56, 764 45" />
              <path d="M 755 120 C 740 115, 734 125, 742 134 C 752 142, 760 130, 755 120" />
              <circle cx="750" cy="80" r="14" fill="#E8A65C" fillOpacity="0.06" stroke="none" filter="url(#soft-wash-blur)" />
            </g>
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            3. HERBST MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* HERBST 1: Elegantes Herbstlaub (Feine botanische Herbstblätter in warmem Ocker) */}
        {motif === 'herbst-laub' && (
          <g>
            <path
              d="M 680 -20 Q 770 10 810 110 Q 750 140 680 -20 Z"
              fill="#B85829"
              opacity="0.07"
              filter="url(#soft-wash-blur)"
            />
            <path
              d="M -20 1040 Q 60 1020 90 1130 Z"
              fill="#C87B3E"
              opacity="0.06"
              filter="url(#soft-wash-blur)"
            />

            {/* Hand-drawn stylized oak/beech leaf contour in upper right corner */}
            <g stroke="#693014" strokeWidth="0.85" fill="none" opacity="0.14" strokeLinecap="round">
              <path d="M 794 15 C 770 34, 754 62, 744 92" />
              <path
                d="M 768 36 C 756 22, 742 26, 738 18 C 734 10, 748 4, 760 10 C 770 16, 778 28, 768 36 Z"
                fill="#C87B3E"
                fillOpacity="0.13"
              />
              <path
                d="M 754 72 C 740 62, 728 66, 724 58 C 720 50, 734 46, 746 50 C 754 54, 762 64, 754 72 Z"
                fill="#B85829"
                fillOpacity="0.12"
              />
              {/* Midrib and subtle leaf veins */}
              <path d="M 754 22 L 762 16 M 748 30 L 756 24 M 736 60 L 744 54" stroke="#693014" strokeWidth="0.6" />
            </g>

            {/* Delicate lower left autumn blade */}
            <g stroke="#693014" strokeWidth="0.8" fill="none" opacity="0.12" strokeLinecap="round">
              <path d="M 8 1120 C 26 1098, 42 1076, 48 1050" />
              <path d="M 26 1100 C 38 1088, 44 1080, 36 1074 C 28 1068, 20 1082, 26 1100 Z" fill="#C87B3E" fillOpacity="0.11" />
            </g>
          </g>
        )}

        {/* HERBST 2: Getrocknete Zweige (Elegante feine Zweige mit getrockneten Blättern) */}
        {motif === 'herbst-zweige' && (
          <g>
            <path
              d="M 740 40 Q 820 110 780 240 Q 730 180 740 40 Z"
              fill="#C87B3E"
              opacity="0.06"
              filter="url(#soft-wash-blur)"
            />
            <g stroke="#693318" strokeWidth="0.85" fill="none" opacity="0.13" strokeLinecap="round">
              <path d="M 790 20 C 778 80, 775 160, 780 240 C 784 280, 778 330, 772 380" />
              <path d="M 782 65 L 766 56 M 778 120 L 762 112 M 778 180 L 762 174 M 779 245 L 763 240" />
              {/* Dried teardrop leaves */}
              <path d="M 766 56 C 752 48, 748 56, 756 62 C 764 68, 770 60, 766 56 Z" fill="#965328" fillOpacity="0.12" />
              <path d="M 762 112 C 748 106, 746 114, 754 118 C 762 122, 768 116, 762 112 Z" fill="#B85829" fillOpacity="0.12" />
              <path d="M 762 174 C 748 168, 746 176, 754 180 C 762 184, 768 178, 762 174 Z" fill="#965328" fillOpacity="0.12" />
            </g>
          </g>
        )}

        {/* HERBST 3: Ocker-Terrakotta-Aquarell (Organische warme Farbflächen) */}
        {motif === 'herbst-aquarell' && (
          <g>
            <path
              d="M 620 -40 C 710 -20, 810 30, 810 130 C 750 140, 670 70, 620 -40 Z"
              fill="#B85829"
              opacity="0.07"
              filter="url(#soft-wash-wide)"
            />
            <path
              d="M -30 1030 C 50 1020, 130 1080, 110 1150 C 40 1150, -20 1100, -30 1030 Z"
              fill="#C87B3E"
              opacity="0.06"
              filter="url(#soft-wash-wide)"
            />
          </g>
        )}

        {/* HERBST 4: Herbst Botanical Line Art (Feine Linienzeichnung von Blättern & Zweigen) */}
        {motif === 'herbst-line-art' && (
          <g>
            <g stroke="#693014" strokeWidth="0.75" fill="none" opacity="0.12" strokeLinecap="round">
              <path d="M 794 15 C 765 35, 750 70, 748 115 C 746 160, 754 200, 748 245" />
              <path d="M 764 42 C 748 34, 738 44, 746 54 C 756 62, 768 50, 764 42" />
              <path d="M 748 115 C 732 108, 726 118, 734 126 C 744 134, 754 122, 748 115" />
              <circle cx="750" cy="75" r="14" fill="#B85829" fillOpacity="0.06" stroke="none" filter="url(#soft-wash-blur)" />
            </g>
          </g>
        )}

        {/* HERBST 5: Warme organische Naturformen (Asymmetrische sanfte Formen) */}
        {motif === 'herbst-natur' && (
          <g>
            <path
              d="M 700 -20 Q 790 10 810 110 Q 740 140 700 -20 Z"
              fill="#C87B3E"
              opacity="0.06"
              filter="url(#soft-wash-blur)"
            />
            <g stroke="#783A1A" strokeWidth="0.8" fill="none" opacity="0.12">
              <path d="M 790 30 C 768 60, 755 100, 762 145" />
              <circle cx="760" cy="90" r="10" fill="#DE8A52" fillOpacity="0.08" stroke="none" />
            </g>
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            4. WINTER MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* WINTER 1: Kahle Winterzweige (Feine kahle Zweige mit kleinen Knospen) */}
        {motif === 'winter-zweige' && (
          <g>
            <path
              d="M 680 -20 Q 770 10 810 110 Q 750 140 680 -20 Z"
              fill="#4F7285"
              opacity="0.07"
              filter="url(#soft-wash-blur)"
            />
            <path
              d="M -20 1040 Q 60 1020 90 1130 Z"
              fill="#557B8E"
              opacity="0.06"
              filter="url(#soft-wash-blur)"
            />
            <g stroke="#2C4857" strokeWidth="0.85" fill="none" opacity="0.14" strokeLinecap="round">
              <path d="M 794 15 C 772 32, 755 58, 746 88" />
              <path d="M 770 32 L 754 24 M 756 58 L 742 50 M 748 82 L 738 74" />
              {/* Frosty little bud dots */}
              <circle cx="754" cy="24" r="2.2" fill="#B2D2DE" fillOpacity="0.4" stroke="#2C4857" strokeWidth="0.6" />
              <circle cx="742" cy="50" r="2.2" fill="#B2D2DE" fillOpacity="0.4" stroke="#2C4857" strokeWidth="0.6" />
              <circle cx="746" cy="88" r="2.2" fill="#B2D2DE" fillOpacity="0.4" stroke="#2C4857" strokeWidth="0.6" />
            </g>
            <g stroke="#2C4857" strokeWidth="0.8" fill="none" opacity="0.12" strokeLinecap="round">
              <path d="M 8 1120 C 26 1098, 42 1076, 48 1050" />
              <circle cx="48" cy="1050" r="2" fill="#B2D2DE" fillOpacity="0.4" stroke="#2C4857" strokeWidth="0.6" />
            </g>
          </g>
        )}

        {/* WINTER 2: Reduzierte Tannenzweige (Dezente Nadelzweige ohne Deko) */}
        {motif === 'winter-tannen' && (
          <g>
            <path
              d="M 720 0 Q 800 30 810 140 Q 740 100 720 0 Z"
              fill="#436173"
              opacity="0.06"
              filter="url(#soft-wash-blur)"
            />
            <g stroke="#283F4C" strokeWidth="0.8" fill="none" opacity="0.13" strokeLinecap="round">
              <path d="M 794 20 C 772 45, 758 75, 748 110" />
              <path d="M 778 38 L 766 30 M 780 42 L 790 32 M 768 56 L 756 48 M 770 60 L 780 50" />
              <path d="M 758 78 L 746 70 M 760 82 L 770 72 M 750 100 L 738 92 M 752 104 L 762 94" />
            </g>
          </g>
        )}

        {/* WINTER 3: Eisblau-Rauchblau-Aquarell (Weiche diffuse Winterauren) */}
        {motif === 'winter-aquarell' && (
          <g>
            <path
              d="M 620 -40 C 710 -20, 810 30, 810 130 C 750 140, 670 70, 620 -40 Z"
              fill="#557B8E"
              opacity="0.07"
              filter="url(#soft-wash-wide)"
            />
            <path
              d="M -30 1030 C 50 1020, 130 1080, 110 1150 C 40 1150, -20 1100, -30 1030 Z"
              fill="#4F7285"
              opacity="0.06"
              filter="url(#soft-wash-wide)"
            />
          </g>
        )}

        {/* WINTER 4: Nordic Botanical Line Art (Kühle, minimalistische Konturlinien) */}
        {motif === 'winter-line-art' && (
          <g>
            <g stroke="#2A4554" strokeWidth="0.75" fill="none" opacity="0.12" strokeLinecap="round">
              <path d="M 794 15 C 765 35, 750 70, 748 115 C 746 160, 754 200, 748 245" />
              <circle cx="754" cy="45" r="2.2" fill="#557B8E" />
              <circle cx="748" cy="95" r="2.2" fill="#557B8E" />
              <circle cx="750" cy="155" r="2.2" fill="#557B8E" />
              <circle cx="750" cy="70" r="14" fill="#6B8E9E" fillOpacity="0.06" stroke="none" filter="url(#soft-wash-blur)" />
            </g>
          </g>
        )}

        {/* WINTER 5: Abstrakte frostige Naturformen (Sehr ruhige weiche Kaltton-Formen) */}
        {motif === 'winter-formen' && (
          <g>
            <path
              d="M 690 -20 Q 780 10 810 100 Q 750 140 690 -20 Z"
              fill="#6B8E9E"
              opacity="0.06"
              filter="url(#soft-wash-blur)"
            />
            <g stroke="#375566" strokeWidth="0.75" fill="none" opacity="0.11">
              <path d="M 790 25 C 770 50, 758 85, 764 125" />
              <path d="M 764 125 C 770 165, 758 200, 762 235" strokeDasharray="3 4" />
            </g>
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            5. ZEITLOS MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* ZEITLOS 1: Feine Leinenstruktur (Hauchzartes Naturleinen) */}
        {motif === 'zeitlos-leinen' && (
          <g>
            <rect width="794" height="1123" fill="url(#linen-weave)" />
            <path
              d="M 690 -20 Q 780 10 810 100 Q 750 140 690 -20 Z"
              fill="#8C7B6E"
              opacity="0.04"
              filter="url(#soft-wash-blur)"
            />
          </g>
        )}

        {/* ZEITLOS 2: Organische Konturlinien (Feine abstrakte Linien in Greige) */}
        {motif === 'zeitlos-linien' && (
          <g>
            <g stroke="#6B5C50" strokeWidth="0.75" fill="none" opacity="0.12" strokeLinecap="round">
              <path d="M 794 20 C 768 45, 752 90, 758 140 C 764 190, 750 240, 754 290" />
              <circle cx="755" cy="110" r="14" fill="#9C8C7E" fillOpacity="0.05" stroke="none" filter="url(#soft-wash-blur)" />
            </g>
          </g>
        )}

        {/* ZEITLOS 3: Greige-Aquarell (Sehr leichte Steinton-Aura) */}
        {motif === 'zeitlos-aquarell' && (
          <g>
            <path
              d="M 630 -30 C 720 -10, 810 30, 810 130 C 750 130, 670 60, 630 -30 Z"
              fill="#9C8C7E"
              opacity="0.06"
              filter="url(#soft-wash-wide)"
            />
          </g>
        )}

        {/* ZEITLOS 4: Monochrome botanische Kontur (Extrem reduzierte Konturlinie) */}
        {motif === 'zeitlos-kontur' && (
          <g>
            <g stroke="#5E5045" strokeWidth="0.75" fill="none" opacity="0.12" strokeLinecap="round">
              <path d="M 790 20 C 778 80, 775 160, 780 230 C 784 270, 778 320, 772 370" />
              <path d="M 782 60 C 760 52, 750 46, 762 40" />
              <path d="M 778 110 C 758 104, 748 98, 758 92" />
              <path d="M 778 170 C 756 166, 746 160, 756 154" />
            </g>
          </g>
        )}

        {/* ZEITLOS 5: Minimal Paper (Ruhigste Variante: zarter Steinton & viel Raum) */}
        {motif === 'zeitlos-paper' && (
          <g>
            <path
              d="M 720 -20 Q 790 0 810 80 Q 760 100 720 -20 Z"
              fill="#807267"
              opacity="0.03"
              filter="url(#soft-wash-blur)"
            />
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            6. NEUTRAL STANDARD (#FFF7F0 ohne Dekoration)
            ════════════════════════════════════════════════════════════ */}
        {motif === 'neutral-clean' && (
          <rect width="794" height="1123" fill="#FFF7F0" />
        )}
      </svg>
    </div>
  );
};
