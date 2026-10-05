import React from 'react';
import { Season } from '../types/recipe';
import { getPageBackgroundById } from '../data/recipePageBackgrounds';

interface SeasonalBackgroundLayerProps {
  pageBackgroundId?: string;
  season?: Season;
  isThumbnail?: boolean;
}

/**
 * Editorial Recipe Page Background Layer.
 * Renders across the entire A4 canvas (794 x 1123 px).
 * - Base warm cream background #FFF7F0
 * - Delicate, quiet, botanical & watercolor-like elements placed strictly at margins and corners
 * - Visually clear and distinct for each of the 25 seasonal motifs (8-22% opacity)
 * - 100% print and PDF safe (rendered as inline SVG vectors, not CSS background-images)
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
          {/* Spring Watercolor Gradients */}
          <radialGradient id="sp-wash-tr" cx="85%" cy="8%" r="35%">
            <stop offset="0%" stopColor="#88B27F" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#9EC795" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFF7F0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sp-wash-bl" cx="12%" cy="92%" r="30%">
            <stop offset="0%" stopColor="#88B27F" stopOpacity="0.20" />
            <stop offset="60%" stopColor="#9EC795" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#FFF7F0" stopOpacity="0" />
          </radialGradient>

          {/* Summer Watercolor Gradients */}
          <radialGradient id="su-wash-tr" cx="85%" cy="8%" r="35%">
            <stop offset="0%" stopColor="#E6A35C" stopOpacity="0.24" />
            <stop offset="60%" stopColor="#F5C48A" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#FFF7F0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="su-wash-bl" cx="15%" cy="90%" r="30%">
            <stop offset="0%" stopColor="#E29B38" stopOpacity="0.20" />
            <stop offset="60%" stopColor="#F5C48A" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#FFF7F0" stopOpacity="0" />
          </radialGradient>

          {/* Autumn Watercolor Gradients */}
          <radialGradient id="au-wash-tr" cx="85%" cy="8%" r="38%">
            <stop offset="0%" stopColor="#B85829" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#DE8A52" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#FFF7F0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="au-wash-bl" cx="12%" cy="92%" r="30%">
            <stop offset="0%" stopColor="#C87B3E" stopOpacity="0.20" />
            <stop offset="60%" stopColor="#E2A169" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#FFF7F0" stopOpacity="0" />
          </radialGradient>

          {/* Winter Watercolor Gradients */}
          <radialGradient id="wi-wash-tr" cx="85%" cy="8%" r="35%">
            <stop offset="0%" stopColor="#557B8E" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#80A4B5" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFF7F0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="wi-wash-bl" cx="12%" cy="92%" r="30%">
            <stop offset="0%" stopColor="#4F7285" stopOpacity="0.18" />
            <stop offset="60%" stopColor="#7E9FA0" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#FFF7F0" stopOpacity="0" />
          </radialGradient>

          {/* Timeless Watercolor Gradients */}
          <radialGradient id="ti-wash-tr" cx="85%" cy="8%" r="35%">
            <stop offset="0%" stopColor="#8C7B6E" stopOpacity="0.20" />
            <stop offset="60%" stopColor="#B2A396" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#FFF7F0" stopOpacity="0" />
          </radialGradient>

          {/* Subtle Linen Pattern for Zeitlos 1 */}
          <pattern id="linen-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="10" x2="20" y2="10" stroke="#7A6B5F" strokeWidth="0.5" strokeOpacity="0.07" />
            <line x1="10" y1="0" x2="10" y2="20" stroke="#7A6B5F" strokeWidth="0.5" strokeOpacity="0.07" />
          </pattern>
        </defs>

        {/* ════════════════════════════════════════════════════════════
            1. FRÜHLING MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* FRÜHLING 1: Frische Kräuter (Basilikum/Kräuterzweige oben rechts & unten links) */}
        {motif === 'fruehling-kraeuter' && (
          <g>
            {/* Top Right Corner Herbs */}
            <circle cx="730" cy="70" r="160" fill="url(#sp-wash-tr)" />
            <g stroke="#4F7344" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.28">
              <path d="M 785 10 C 750 35, 710 65, 665 85" />
              {/* Herb leaves */}
              <path d="M 715 60 C 695 48, 680 35, 700 28 C 720 22, 730 40, 715 60 Z" fill="#7BA672" fillOpacity="0.45" />
              <path d="M 720 62 C 735 85, 730 105, 715 100 C 700 95, 705 75, 720 62 Z" fill="#8FB984" fillOpacity="0.45" />
              <path d="M 748 35 C 730 20, 720 10, 738 6 C 755 2, 762 18, 748 35 Z" fill="#7BA672" fillOpacity="0.40" />
              <path d="M 675 80 C 655 75, 642 65, 658 58 C 674 52, 685 68, 675 80 Z" fill="#A5CB96" fillOpacity="0.45" />
            </g>

            {/* Bottom Left Corner Herbs */}
            <circle cx="70" cy="1050" r="140" fill="url(#sp-wash-bl)" />
            <g stroke="#4F7344" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.25">
              <path d="M 10 1115 C 45 1090, 85 1060, 130 1040" />
              <path d="M 80 1065 C 65 1045, 70 1025, 88 1030 C 105 1035, 95 1055, 80 1065 Z" fill="#7BA672" fillOpacity="0.45" />
              <path d="M 85 1062 C 100 1082, 95 1102, 80 1098 C 65 1092, 72 1075, 85 1062 Z" fill="#8FB984" fillOpacity="0.45" />
            </g>
          </g>
        )}

        {/* FRÜHLING 2: Zarte Blätter (Aquarellierte junge Blätter entlang Seitenrand) */}
        {motif === 'fruehling-blaetter' && (
          <g>
            <circle cx="740" cy="90" r="140" fill="url(#sp-wash-tr)" />
            {/* Delicate leaves cascading down the right margin */}
            <g stroke="#4B6E40" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.26">
              <path d="M 770 40 C 760 120, 765 220, 755 320" />
              <path d="M 764 80 Q 735 65 725 45 Q 745 42 764 76" fill="#7BA672" fillOpacity="0.45" />
              <path d="M 764 80 Q 775 110, 768 128 Q 755 118 762 84" fill="#8FB984" fillOpacity="0.4" />
              <path d="M 762 160 Q 732 148 722 130 Q 742 128 762 155" fill="#7BA672" fillOpacity="0.45" />
              <path d="M 760 240 Q 730 230 720 215 Q 740 212 760 235" fill="#8FB984" fillOpacity="0.45" />
            </g>
          </g>
        )}

        {/* FRÜHLING 3: Frühlingsblüten (Dezente Blüten & Blätter im Editorial-Look) */}
        {motif === 'fruehling-blueten' && (
          <g>
            <circle cx="730" cy="70" r="150" fill="url(#sp-wash-tr)" />
            <g stroke="#537548" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.28">
              <path d="M 780 15 C 750 40, 715 70, 680 85" />
              {/* Petals of subtle blossom */}
              <circle cx="682" cy="85" r="7" fill="#FFF7F0" stroke="#7BA672" strokeWidth="1" fillOpacity="0.9" />
              <circle cx="682" cy="74" r="5" fill="#FFF7F0" stroke="#7BA672" strokeWidth="0.8" fillOpacity="0.8" />
              <circle cx="692" cy="82" r="5" fill="#FFF7F0" stroke="#7BA672" strokeWidth="0.8" fillOpacity="0.8" />
              <circle cx="686" cy="94" r="5" fill="#FFF7F0" stroke="#7BA672" strokeWidth="0.8" fillOpacity="0.8" />
              <circle cx="673" cy="90" r="5" fill="#FFF7F0" stroke="#7BA672" strokeWidth="0.8" fillOpacity="0.8" />
              <circle cx="673" cy="78" r="5" fill="#FFF7F0" stroke="#7BA672" strokeWidth="0.8" fillOpacity="0.8" />
              <circle cx="682" cy="85" r="2.5" fill="#D9822B" fillOpacity="0.6" stroke="none" />
              {/* Green leaf accent */}
              <path d="M 720 60 Q 695 48 688 35 Q 708 34 722 56" fill="#7BA672" fillOpacity="0.4" />
            </g>
          </g>
        )}

        {/* FRÜHLING 4: Botanical Line Art (Sehr feine Linienzeichnung mit grünen Akzenten) */}
        {motif === 'fruehling-line-art' && (
          <g>
            {/* Fine contour line art top right */}
            <g stroke="#486D3E" strokeWidth="0.9" fill="none" opacity="0.25">
              <path d="M 780 10 C 750 30, 710 60, 670 75 C 640 85, 620 120, 610 160" />
              <path d="M 720 52 C 700 35, 680 40, 685 20 C 710 25, 725 40, 720 52 Z" />
              <path d="M 670 75 C 650 60, 635 68, 642 50 C 662 55, 675 70, 670 75 Z" />
              <circle cx="700" cy="32" r="16" fill="#88B27F" fillOpacity="0.18" stroke="none" />
              <circle cx="654" cy="62" r="14" fill="#A5CB96" fillOpacity="0.18" stroke="none" />
            </g>
          </g>
        )}

        {/* FRÜHLING 5: Frisches Aquarell (Weiche Aquarellflächen in Salbei & Grün in 2 Ecken) */}
        {motif === 'fruehling-aquarell' && (
          <g>
            <circle cx="740" cy="70" r="180" fill="url(#sp-wash-tr)" />
            <circle cx="60" cy="1060" r="170" fill="url(#sp-wash-bl)" />
            <path
              d="M 620 0 C 660 60, 720 90, 794 80 L 794 0 Z"
              fill="#7BA672"
              fillOpacity="0.08"
            />
            <path
              d="M 0 1040 C 60 1050, 100 1090, 120 1123 L 0 1123 Z"
              fill="#8FB984"
              fillOpacity="0.08"
            />
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            2. SOMMER MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* SOMMER 1: Zitrone & Blätter (Dezente Zitronenzweige in der Ecke) */}
        {motif === 'sommer-zitrone' && (
          <g>
            <circle cx="730" cy="70" r="160" fill="url(#su-wash-tr)" />
            <g stroke="#9E6122" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.28">
              <path d="M 785 15 C 750 38, 715 68, 675 85" />
              {/* Citrus leaves */}
              <path d="M 720 62 Q 695 46 688 30 Q 708 28 724 55" fill="#8F9E62" fillOpacity="0.45" />
              <path d="M 720 62 Q 732 90 726 108 Q 714 96 718 66" fill="#A5B278" fillOpacity="0.45" />
              {/* Small subtle lemon */}
              <ellipse cx="668" cy="92" rx="14" ry="17" fill="#FBD694" fillOpacity="0.55" stroke="#C77D24" strokeWidth="1" />
              <path d="M 670 75 Q 673 70 675 67" stroke="#9E6122" strokeWidth="1" />
            </g>
          </g>
        )}

        {/* SOMMER 2: Olivenzweige (Feine toskanische Olivenzweige am Rand) */}
        {motif === 'sommer-oliven' && (
          <g>
            <circle cx="740" cy="80" r="150" fill="url(#su-wash-tr)" />
            <g stroke="#666144" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.26">
              <path d="M 775 30 C 760 120, 762 220, 755 320" />
              <path d="M 764 70 Q 736 60 726 50 Q 742 46 764 66" fill="#8A8E6F" fillOpacity="0.45" />
              <path d="M 762 120 Q 734 114 724 104 Q 740 100 762 116" fill="#8A8E6F" fillOpacity="0.45" />
              <path d="M 760 170 Q 732 168 722 158 Q 738 154 760 166" fill="#8A8E6F" fillOpacity="0.45" />
              <path d="M 758 230 Q 730 230 720 222 Q 736 216 758 226" fill="#8A8E6F" fillOpacity="0.45" />
              {/* Subtle dark olives */}
              <ellipse cx="730" cy="126" rx="5" ry="6.5" fill="#4B4734" fillOpacity="0.45" stroke="#4B4734" strokeWidth="0.8" />
              <ellipse cx="728" cy="235" rx="5" ry="6.5" fill="#4B4734" fillOpacity="0.45" stroke="#4B4734" strokeWidth="0.8" />
            </g>
          </g>
        )}

        {/* SOMMER 3: Sommerkräuter (Rosmarinzweige & Sommerkräuter als Randgestaltung) */}
        {motif === 'sommer-kraeuter' && (
          <g>
            <circle cx="730" cy="80" r="140" fill="url(#su-wash-tr)" />
            {/* Rosemary sprig */}
            <g stroke="#755C33" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.26">
              <path d="M 780 20 C 750 60, 740 130, 750 200" />
              <path d="M 760 55 L 742 46 M 758 64 L 774 54 M 750 85 L 732 76 M 750 95 L 766 85" />
              <path d="M 746 120 L 728 112 M 748 130 L 764 122 M 748 155 L 730 148 M 750 165 L 766 158" />
            </g>
          </g>
        )}

        {/* SOMMER 4: Sonniges Aquarell (Weiche Aquarellschleier in Honig, Apricot, Pfirsich) */}
        {motif === 'sommer-aquarell' && (
          <g>
            <circle cx="730" cy="70" r="190" fill="url(#su-wash-tr)" />
            <circle cx="70" cy="1050" r="170" fill="url(#su-wash-bl)" />
            <ellipse cx="700" cy="120" rx="100" ry="70" fill="#E29B38" fillOpacity="0.10" />
            <ellipse cx="120" cy="1020" rx="90" ry="60" fill="#F5C48A" fillOpacity="0.12" />
          </g>
        )}

        {/* SOMMER 5: Mediterrane Linien (Feine organische mediterrane Formen & Pflanzenlinien) */}
        {motif === 'sommer-linien' && (
          <g>
            <g stroke="#B87635" strokeWidth="0.9" fill="none" opacity="0.25">
              <path d="M 780 20 C 740 40, 720 90, 735 140 C 750 190, 730 240, 715 280" />
              <path d="M 735 90 C 700 85, 680 110, 695 130 C 715 140, 730 115, 735 90 Z" />
              <circle cx="704" cy="112" r="16" fill="#F5C48A" fillOpacity="0.18" stroke="none" />
            </g>
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            3. HERBST MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* HERBST 1: Herbstlaub (Stilisierte Herbstblätter in Ocker & Terrakotta) */}
        {motif === 'herbst-laub' && (
          <g>
            <circle cx="730" cy="70" r="160" fill="url(#au-wash-tr)" />
            <g stroke="#873F18" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.28">
              <path d="M 785 15 C 750 40, 710 70, 668 85" />
              {/* Oak / Maple leaf contour */}
              <path
                d="M 715 65 C 702 48, 680 52, 674 38 C 668 24, 688 14, 704 20 C 716 26, 726 42, 715 65 Z"
                fill="#DE8A52"
                fillOpacity="0.45"
              />
              <path
                d="M 740 38 C 728 26, 712 28, 708 18 C 704 8, 722 4, 734 12 Z"
                fill="#B85829"
                fillOpacity="0.40"
              />
              <path d="M 698 46 L 710 38 M 692 36 L 704 30" stroke="#873F18" strokeWidth="0.8" />
            </g>
            {/* Subtle bottom leaf accent */}
            <g stroke="#873F18" strokeWidth="1" fill="none" opacity="0.22">
              <path d="M 20 1100 C 45 1080, 80 1070, 110 1065" />
              <path d="M 80 1075 C 65 1060, 68 1045, 82 1050 C 95 1055, 90 1070, 80 1075 Z" fill="#DE8A52" fillOpacity="0.38" />
            </g>
          </g>
        )}

        {/* HERBST 2: Zweige & getrocknete Blätter (Elegante Zweige & Ähren am Rand) */}
        {motif === 'herbst-zweige' && (
          <g>
            <circle cx="740" cy="80" r="140" fill="url(#au-wash-tr)" />
            <g stroke="#7C411E" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.26">
              <path d="M 770 30 C 758 130, 762 230, 755 330" />
              <path d="M 764 80 L 748 70 M 762 130 L 744 120 M 760 180 L 742 172 M 758 240 L 740 234" />
              {/* Small dried leaf drops */}
              <ellipse cx="744" cy="68" rx="6" ry="3.5" transform="rotate(-30 744 68)" fill="#C87B3E" fillOpacity="0.45" stroke="#7C411E" strokeWidth="0.8" />
              <ellipse cx="740" cy="118" rx="6" ry="3.5" transform="rotate(-30 740 118)" fill="#C87B3E" fillOpacity="0.45" stroke="#7C411E" strokeWidth="0.8" />
              <ellipse cx="738" cy="170" rx="6" ry="3.5" transform="rotate(-30 738 170)" fill="#B85829" fillOpacity="0.45" stroke="#7C411E" strokeWidth="0.8" />
            </g>
          </g>
        )}

        {/* HERBST 3: Goldenes Aquarell (Sanfte Aquarellflächen in Ocker, Beige & Terrakotta) */}
        {motif === 'herbst-aquarell' && (
          <g>
            <circle cx="730" cy="70" r="190" fill="url(#au-wash-tr)" />
            <circle cx="70" cy="1050" r="170" fill="url(#au-wash-bl)" />
            <ellipse cx="710" cy="110" rx="90" ry="60" fill="#DE8A52" fillOpacity="0.10" />
            <ellipse cx="110" cy="1020" rx="80" ry="50" fill="#B85829" fillOpacity="0.08" />
          </g>
        )}

        {/* HERBST 4: Herbst Botanical Line Art (Feine Linienzeichnung von Blättern & Zweigen) */}
        {motif === 'herbst-line-art' && (
          <g>
            <g stroke="#7C3B18" strokeWidth="0.9" fill="none" opacity="0.26">
              <path d="M 780 20 C 740 40, 715 80, 680 95 C 650 110, 630 150, 620 190" />
              <path d="M 715 80 C 695 65, 680 72, 686 52 C 708 58, 722 72, 715 80 Z" />
              <path d="M 680 95 C 660 85, 646 95, 652 76 C 670 82, 682 92, 680 95 Z" />
              <circle cx="700" cy="62" r="16" fill="#DE8A52" fillOpacity="0.18" stroke="none" />
              <circle cx="664" cy="84" r="14" fill="#B85829" fillOpacity="0.16" stroke="none" />
            </g>
          </g>
        )}

        {/* HERBST 5: Warmes Naturmotiv (Reduzierte Kombination aus Blättern & organischen Formen) */}
        {motif === 'herbst-natur' && (
          <g>
            <circle cx="740" cy="80" r="150" fill="url(#au-wash-tr)" />
            <g stroke="#873F18" strokeWidth="1" fill="none" opacity="0.25">
              <path d="M 780 30 C 750 60, 730 110, 740 160" />
              <circle cx="740" cy="100" r="18" fill="#C87B3E" fillOpacity="0.2" stroke="none" />
              <circle cx="720" cy="140" r="12" fill="#B85829" fillOpacity="0.18" stroke="none" />
            </g>
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            4. WINTER MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* WINTER 1: Winterzweige (Feine kahle Zweige in Rauchblau & Graublau) */}
        {motif === 'winter-zweige' && (
          <g>
            <circle cx="730" cy="70" r="160" fill="url(#wi-wash-tr)" />
            <g stroke="#375566" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.28">
              <path d="M 785 15 C 750 38, 715 68, 672 82" />
              <path d="M 740 45 L 724 35 M 718 64 L 702 54 M 698 72 L 688 62" />
              {/* Frosted winter buds */}
              <circle cx="724" cy="35" r="3.2" fill="#B2D2DE" fillOpacity="0.6" stroke="#375566" strokeWidth="0.8" />
              <circle cx="702" cy="54" r="3.2" fill="#B2D2DE" fillOpacity="0.6" stroke="#375566" strokeWidth="0.8" />
              <circle cx="672" cy="82" r="3.2" fill="#B2D2DE" fillOpacity="0.6" stroke="#375566" strokeWidth="0.8" />
            </g>
            {/* Subtle bottom branch */}
            <g stroke="#375566" strokeWidth="1" fill="none" opacity="0.20">
              <path d="M 20 1105 C 50 1085, 90 1075, 125 1070" />
              <circle cx="95" cy="1078" r="2.8" fill="#B2D2DE" fillOpacity="0.5" stroke="#375566" strokeWidth="0.8" />
            </g>
          </g>
        )}

        {/* WINTER 2: Tannenzweige (Dezente Tannennadeln ohne Deko) */}
        {motif === 'winter-tannen' && (
          <g>
            <circle cx="730" cy="70" r="150" fill="url(#wi-wash-tr)" />
            <g stroke="#2C4857" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.26">
              <path d="M 780 20 C 750 50, 720 85, 680 105" />
              <path d="M 750 48 L 738 38 M 754 42 L 766 32 M 732 70 L 720 60 M 736 64 L 748 54" />
              <path d="M 714 88 L 702 78 M 718 82 L 730 72 M 696 102 L 684 92 M 700 96 L 712 86" />
            </g>
          </g>
        )}

        {/* WINTER 3: Frostiges Aquarell (Weiche Aquarellflächen in Eisblau & Rauchblau) */}
        {motif === 'winter-aquarell' && (
          <g>
            <circle cx="730" cy="70" r="190" fill="url(#wi-wash-tr)" />
            <circle cx="70" cy="1050" r="170" fill="url(#wi-wash-bl)" />
            <ellipse cx="710" cy="110" rx="90" ry="60" fill="#6B8E9E" fillOpacity="0.10" />
            <ellipse cx="110" cy="1020" rx="80" ry="50" fill="#4F7285" fillOpacity="0.08" />
          </g>
        )}

        {/* WINTER 4: Nordic Line Art (Minimalistische botanische Line-Art in kühlen Blautönen) */}
        {motif === 'winter-line-art' && (
          <g>
            <g stroke="#325061" strokeWidth="0.9" fill="none" opacity="0.25">
              <path d="M 780 15 C 740 35, 715 75, 685 90 C 655 105, 635 145, 625 185" />
              <circle cx="715" cy="75" r="3" fill="#557B8E" />
              <circle cx="685" cy="90" r="3" fill="#557B8E" />
              <circle cx="655" cy="120" r="3" fill="#557B8E" />
              <circle cx="700" cy="65" r="16" fill="#80A4B5" fillOpacity="0.18" stroke="none" />
            </g>
          </g>
        )}

        {/* WINTER 5: Eisige organische Formen (Abstrakte weiche Formen in kühler Ruhe) */}
        {motif === 'winter-formen' && (
          <g>
            <circle cx="730" cy="70" r="160" fill="url(#wi-wash-tr)" />
            <g stroke="#375566" strokeWidth="0.8" fill="none" opacity="0.22">
              <polygon points="760,20 780,50 760,80 740,50" />
              <line x1="760" y1="20" x2="760" y2="80" strokeDasharray="3 3" />
              <line x1="740" y1="50" x2="780" y2="50" strokeDasharray="3 3" />
              <circle cx="760" cy="50" r="25" fill="#80A4B5" fillOpacity="0.15" stroke="none" />
            </g>
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            5. ZEITLOS MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* ZEITLOS 1: Leinen (Subtile warme Leinenstruktur) */}
        {motif === 'zeitlos-leinen' && (
          <g>
            <rect width="794" height="1123" fill="url(#linen-grid)" />
            <circle cx="730" cy="70" r="140" fill="url(#ti-wash-tr)" />
          </g>
        )}

        {/* ZEITLOS 2: Organische Linien (Feine abstrakte Linien in Greige & Taupe) */}
        {motif === 'zeitlos-linien' && (
          <g>
            <g stroke="#7A6B5F" strokeWidth="0.8" fill="none" opacity="0.24" strokeDasharray="4 5">
              <path d="M 780 20 C 750 40, 730 80, 740 120 C 750 160, 770 200, 765 240" />
              <circle cx="740" cy="120" r="3" fill="#7A6B5F" opacity="0.3" />
            </g>
          </g>
        )}

        {/* ZEITLOS 3: Greige Aquarell (Sehr leichte Steinton-Aquarellflächen) */}
        {motif === 'zeitlos-aquarell' && (
          <g>
            <circle cx="730" cy="70" r="180" fill="url(#ti-wash-tr)" />
            <ellipse cx="700" cy="110" rx="90" ry="60" fill="#9C8C7E" fillOpacity="0.09" />
          </g>
        )}

        {/* ZEITLOS 4: Botanische Kontur (Monochrome botanische Line-Art) */}
        {motif === 'zeitlos-kontur' && (
          <g>
            <g stroke="#6E5F53" strokeWidth="0.9" fill="none" opacity="0.24" strokeLinecap="round">
              <path d="M 770 30 C 755 110, 750 200, 758 290" />
              <path d="M 758 90 Q 736 82 730 72 M 756 150 Q 734 142 728 132 M 754 210 Q 732 202 726 192" />
            </g>
          </g>
        )}

        {/* ZEITLOS 5: Minimal Paper (Ruhigste Variante: zarte Papierfaser & sanfte Form) */}
        {motif === 'zeitlos-paper' && (
          <g>
            <circle cx="740" cy="70" r="140" fill="url(#ti-wash-tr)" opacity="0.7" />
            <circle cx="730" cy="80" r="30" fill="#807267" fillOpacity="0.04" />
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            6. NEUTRAL STANDARD (#FFF7F0 ohne Dekoration)
            ════════════════════════════════════════════════════════════ */}
        {motif === 'neutral-clean' && (
          // Completely pure warm cream paper background
          <rect width="794" height="1123" fill="#FFF7F0" />
        )}
      </svg>
    </div>
  );
};
