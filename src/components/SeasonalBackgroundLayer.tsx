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
 * - Unrestricted continuous page compositions that run gently behind content cards.
 * - Controlled editorial opacity (0.12 - 0.22 for washes, 0.18 - 0.25 for botanical line art).
 * - Organic watercolor shapes with low blur (stdDeviation 14 - 20) showing natural pigment edges.
 * - 100% inline SVG vectors, strictly z-index: 0, print-safe and PDF-ready.
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
          {/* Natural organic watercolor blur (low blur preserves texture & contours) */}
          <filter id="soft-watercolor-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <filter id="gentle-wash-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="22" />
          </filter>

          {/* Linen Weave Texture for Zeitlos */}
          <pattern id="linen-weave" width="14" height="14" patternUnits="userSpaceOnUse">
            <line x1="0" y1="7" x2="14" y2="7" stroke="#8A7B6E" strokeWidth="0.5" strokeOpacity="0.08" />
            <line x1="7" y1="0" x2="7" y2="14" stroke="#8A7B6E" strokeWidth="0.5" strokeOpacity="0.08" />
          </pattern>
        </defs>

        {/* ════════════════════════════════════════════════════════════
            1. FRÜHLING MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* FRÜHLING 1: Frische Kräuter */}
        {motif === 'fruehling-kraeuter' && (
          <g>
            {/* Upper right vibrant herbal watercolor wash */}
            <path
              d="M 520 -30 C 640 -10, 810 50, 810 240 C 730 260, 610 180, 560 90 Z"
              fill="#7AA66E"
              opacity="0.18"
              filter="url(#soft-watercolor-blur)"
            />
            {/* Mid right trailing wash */}
            <path
              d="M 680 320 C 740 370, 810 420, 800 560 C 720 540, 690 440, 680 320 Z"
              fill="#88B27F"
              opacity="0.14"
              filter="url(#gentle-wash-blur)"
            />
            {/* Lower left counter-accent */}
            <path
              d="M -30 920 C 80 910, 190 980, 160 1140 C 60 1140, -10 1080, -30 920 Z"
              fill="#6E9864"
              opacity="0.16"
              filter="url(#soft-watercolor-blur)"
            />

            {/* Hand-drawn botanical herb branches */}
            <g stroke="#2F5426" strokeWidth="1.1" fill="none" opacity="0.24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 790 30 C 730 90, 695 180, 680 290 C 670 370, 710 480, 730 580" />
              {/* Leaves pairs along branch */}
              <path d="M 745 85 C 700 70, 685 45, 715 35 C 745 25, 765 60, 745 85 Z" fill="#6E9864" fillOpacity="0.20" />
              <path d="M 728 115 C 758 135, 775 160, 755 170 C 735 180, 715 145, 728 115 Z" fill="#7AA66E" fillOpacity="0.20" />
              <path d="M 698 190 C 655 180, 640 155, 670 145 C 700 135, 718 170, 698 190 Z" fill="#6E9864" fillOpacity="0.22" />
              <path d="M 686 230 C 716 250, 730 280, 710 290 C 690 300, 672 265, 686 230 Z" fill="#88B27F" fillOpacity="0.20" />
              <path d="M 678 320 C 635 315, 620 290, 650 280 C 680 270, 698 300, 678 320 Z" fill="#6E9864" fillOpacity="0.20" />
            </g>

            {/* Lower-left herb branch */}
            <g stroke="#2F5426" strokeWidth="1.0" fill="none" opacity="0.22" strokeLinecap="round">
              <path d="M 20 1110 C 60 1060, 95 1010, 110 930" />
              <path d="M 52 1070 C 80 1045, 105 1040, 95 1020 C 85 1000, 50 1030, 52 1070 Z" fill="#6E9864" fillOpacity="0.18" />
              <path d="M 80 1025 C 60 995, 50 970, 70 960 C 90 950, 105 990, 80 1025 Z" fill="#7AA66E" fillOpacity="0.18" />
            </g>
          </g>
        )}

        {/* FRÜHLING 2: Zarte Blätter */}
        {motif === 'fruehling-blaetter' && (
          <g>
            <path
              d="M 540 -20 C 680 20, 810 100, 800 320 C 720 330, 630 220, 570 110 Z"
              fill="#88B27F"
              opacity="0.17"
              filter="url(#soft-watercolor-blur)"
            />
            <path
              d="M 670 420 C 740 480, 805 560, 780 720 C 710 680, 680 560, 670 420 Z"
              fill="#7AA66E"
              opacity="0.13"
              filter="url(#gentle-wash-blur)"
            />
            <path
              d="M -30 960 C 90 960, 170 1030, 150 1140 C 40 1140, -10 1080, -30 960 Z"
              fill="#88B27F"
              opacity="0.15"
              filter="url(#soft-watercolor-blur)"
            />

            {/* Fine cascading branch */}
            <g stroke="#35562C" strokeWidth="1.0" fill="none" opacity="0.23" strokeLinecap="round">
              <path d="M 790 40 C 760 120, 740 230, 755 350 C 770 470, 740 590, 730 680" />
              <path d="M 770 95 C 730 75, 715 50, 740 40 C 765 30, 785 65, 770 95 Z" fill="#7AA66E" fillOpacity="0.22" />
              <path d="M 755 170 C 715 155, 700 130, 725 120 C 750 110, 770 145, 755 170 Z" fill="#6E9864" fillOpacity="0.22" />
              <path d="M 752 260 C 715 250, 705 220, 730 210 C 755 200, 770 235, 752 260 Z" fill="#88B27F" fillOpacity="0.22" />
              <path d="M 760 360 C 725 350, 715 325, 740 315 C 765 305, 778 335, 760 360 Z" fill="#7AA66E" fillOpacity="0.20" />
              <path d="M 745 460 C 715 450, 705 425, 730 415 C 755 405, 765 435, 745 460 Z" fill="#6E9864" fillOpacity="0.20" />
            </g>
          </g>
        )}

        {/* FRÜHLING 3: Reduzierte Frühlingsblüten */}
        {motif === 'fruehling-blueten' && (
          <g>
            <path
              d="M 520 -30 C 660 0, 810 60, 810 260 C 720 280, 600 200, 540 100 Z"
              fill="#94BA8A"
              opacity="0.17"
              filter="url(#soft-watercolor-blur)"
            />
            <path
              d="M -30 940 C 80 940, 180 1010, 150 1140 C 50 1140, -10 1080, -30 940 Z"
              fill="#A2C497"
              opacity="0.15"
              filter="url(#soft-watercolor-blur)"
            />

            {/* Twig with delicate flower silhouettes */}
            <g stroke="#3A5C30" strokeWidth="1.0" fill="none" opacity="0.24" strokeLinecap="round">
              <path d="M 790 30 C 740 90, 715 170, 705 270 C 695 360, 725 460, 740 550" />
              {/* Flower 1 */}
              <circle cx="725" cy="140" r="14" fill="#FFF7F0" fillOpacity="0.9" stroke="#3A5C30" strokeWidth="0.8" />
              <circle cx="725" cy="140" r="3.5" fill="#D98A3B" fillOpacity="0.6" stroke="none" />
              {/* Flower 2 */}
              <circle cx="700" cy="280" r="13" fill="#FFF7F0" fillOpacity="0.9" stroke="#3A5C30" strokeWidth="0.8" />
              <circle cx="700" cy="280" r="3" fill="#D98A3B" fillOpacity="0.6" stroke="none" />
              {/* Petals contour */}
              <path d="M 755 85 C 720 70, 710 45, 735 35 Z" fill="#7AA66E" fillOpacity="0.20" />
              <path d="M 710 210 C 675 195, 665 170, 690 160 Z" fill="#88B27F" fillOpacity="0.20" />
            </g>
          </g>
        )}

        {/* FRÜHLING 4: Botanical Line Art */}
        {motif === 'fruehling-line-art' && (
          <g>
            <path
              d="M 580 -20 C 700 30, 810 120, 800 280 C 720 260, 640 180, 590 80 Z"
              fill="#7AA66E"
              opacity="0.13"
              filter="url(#soft-watercolor-blur)"
            />
            {/* Expressive hand-drawn botanical contour that runs down the right flank */}
            <g stroke="#2F5426" strokeWidth="1.15" fill="none" opacity="0.25" strokeLinecap="round">
              <path d="M 790 20 C 740 80, 720 180, 715 280 C 710 380, 740 480, 735 600 C 730 700, 700 780, 715 880" />
              <path d="M 755 70 C 705 55, 685 30, 715 20 C 745 10, 775 45, 755 70" />
              <path d="M 725 160 C 675 145, 655 120, 685 110 C 715 100, 745 135, 725 160" />
              <path d="M 718 270 C 668 255, 650 230, 680 220 C 710 210, 738 245, 718 270" />
              <path d="M 732 390 C 685 375, 670 350, 700 340 C 730 330, 752 365, 732 390" />
              <path d="M 736 510 C 690 495, 675 470, 705 460 C 735 450, 755 485, 736 510" />
            </g>
          </g>
        )}

        {/* FRÜHLING 5: Salbei-Aquarell */}
        {motif === 'fruehling-aquarell' && (
          <g>
            <path
              d="M 460 -50 C 620 -20, 810 50, 810 310 C 710 320, 580 220, 500 90 Z"
              fill="#7AA66E"
              opacity="0.21"
              filter="url(#soft-watercolor-blur)"
            />
            <path
              d="M 640 340 C 720 400, 810 470, 790 680 C 710 650, 660 520, 640 340 Z"
              fill="#88B27F"
              opacity="0.16"
              filter="url(#gentle-wash-blur)"
            />
            <path
              d="M -40 880 C 90 880, 220 960, 180 1140 C 60 1140, -10 1060, -40 880 Z"
              fill="#7AA66E"
              opacity="0.18"
              filter="url(#soft-watercolor-blur)"
            />
            {/* Subtle organic brush pigment spots */}
            <circle cx="680" cy="180" r="45" fill="#6E9864" opacity="0.14" filter="url(#soft-watercolor-blur)" />
            <circle cx="120" cy="980" r="40" fill="#88B27F" opacity="0.13" filter="url(#soft-watercolor-blur)" />
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            2. SOMMER MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* SOMMER 1: Kleiner Zitronenzweig */}
        {motif === 'sommer-zitrone' && (
          <g>
            {/* Sun-drenched warm watercolor wash */}
            <path
              d="M 520 -30 C 650 0, 810 60, 810 260 C 720 280, 590 190, 530 80 Z"
              fill="#E8A64E"
              opacity="0.19"
              filter="url(#soft-watercolor-blur)"
            />
            <path
              d="M 670 340 C 740 400, 810 490, 790 670 C 710 640, 670 510, 670 340 Z"
              fill="#F0C265"
              opacity="0.15"
              filter="url(#gentle-wash-blur)"
            />
            <path
              d="M -30 940 C 80 940, 180 1010, 150 1140 C 50 1140, -10 1070, -30 940 Z"
              fill="#E29B38"
              opacity="0.17"
              filter="url(#soft-watercolor-blur)"
            />

            {/* Hand-drawn lemon branch with vivid yellow fruit and olive-green leaves */}
            <g stroke="#6A4E20" strokeWidth="1.1" fill="none" opacity="0.25" strokeLinecap="round">
              <path d="M 790 30 C 740 90, 715 180, 710 280 C 705 380, 735 480, 740 570" />
              {/* Ripe lemon fruit 1 */}
              <ellipse cx="730" cy="140" rx="20" ry="26" transform="rotate(-15 730 140)" fill="#F4CA42" fillOpacity="0.45" stroke="#7A561E" strokeWidth="1.1" />
              {/* Citrus leaves */}
              <path d="M 755 85 C 710 70, 695 45, 725 35 C 755 25, 775 60, 755 85 Z" fill="#688040" fillOpacity="0.25" />
              <path d="M 705 180 C 665 170, 650 145, 680 135 C 710 125, 728 160, 705 180 Z" fill="#788850" fillOpacity="0.25" />
              {/* Second smaller lemon */}
              <ellipse cx="700" cy="275" rx="17" ry="22" transform="rotate(12 700 275)" fill="#F4CA42" fillOpacity="0.40" stroke="#7A561E" strokeWidth="1.0" />
              <path d="M 720 320 C 750 340, 765 370, 745 380 C 725 390, 705 355, 720 320 Z" fill="#688040" fillOpacity="0.25" />
            </g>
          </g>
        )}

        {/* SOMMER 2: Olivenzweige */}
        {motif === 'sommer-oliven' && (
          <g>
            {/* Gray-green Tuscan watercolor aura */}
            <path
              d="M 520 -30 C 660 0, 810 70, 810 270 C 720 290, 600 200, 540 90 Z"
              fill="#7A8260"
              opacity="0.18"
              filter="url(#soft-watercolor-blur)"
            />
            <path
              d="M 680 340 C 740 400, 810 490, 785 680 C 715 650, 675 510, 680 340 Z"
              fill="#8A926C"
              opacity="0.14"
              filter="url(#gentle-wash-blur)"
            />
            <path
              d="M -30 940 C 80 940, 180 1010, 150 1140 C 50 1140, -10 1070, -30 940 Z"
              fill="#6A7252"
              opacity="0.16"
              filter="url(#soft-watercolor-blur)"
            />

            {/* Tuscan olive branches with elongated leaves & dark olives */}
            <g stroke="#3D4428" strokeWidth="1.1" fill="none" opacity="0.24" strokeLinecap="round">
              <path d="M 790 30 C 750 90, 730 180, 735 280 C 740 380, 725 480, 730 580 C 735 680, 715 770, 725 860" />
              {/* Slender willow-like leaves */}
              <path d="M 760 80 C 715 70, 690 55, 715 45 C 740 35, 775 65, 760 80 Z" fill="#687250" fillOpacity="0.26" />
              <path d="M 740 140 C 695 130, 675 110, 700 100 C 725 90, 755 125, 740 140 Z" fill="#78805E" fillOpacity="0.26" />
              <path d="M 738 220 C 695 210, 675 190, 700 180 C 725 170, 755 205, 738 220 Z" fill="#687250" fillOpacity="0.26" />
              <path d="M 742 320 C 700 310, 680 290, 705 280 C 730 270, 760 305, 742 320 Z" fill="#78805E" fillOpacity="0.26" />
              <path d="M 735 420 C 695 410, 675 390, 700 380 C 725 370, 755 405, 735 420 Z" fill="#687250" fillOpacity="0.26" />
              {/* Deep olive drops */}
              <ellipse cx="718" cy="150" rx="5" ry="7" fill="#2E3320" fillOpacity="0.45" stroke="none" />
              <ellipse cx="715" cy="335" rx="5" ry="7" fill="#2E3320" fillOpacity="0.45" stroke="none" />
              <ellipse cx="712" cy="435" rx="5" ry="7" fill="#2E3320" fillOpacity="0.45" stroke="none" />
            </g>
          </g>
        )}

        {/* SOMMER 3: Rosmarin / Sommerkräuter */}
        {motif === 'sommer-kraeuter' && (
          <g>
            <path
              d="M 520 -30 C 650 0, 810 60, 810 260 C 720 280, 590 190, 530 80 Z"
              fill="#A68250"
              opacity="0.18"
              filter="url(#soft-watercolor-blur)"
            />
            <path
              d="M 680 340 C 740 400, 810 490, 785 680 C 715 650, 675 510, 680 340 Z"
              fill="#8A9260"
              opacity="0.14"
              filter="url(#gentle-wash-blur)"
            />
            <path
              d="M -30 940 C 80 940, 180 1010, 150 1140 C 50 1140, -10 1070, -30 940 Z"
              fill="#9C7844"
              opacity="0.16"
              filter="url(#soft-watercolor-blur)"
            />

            {/* Fine rosemary & thyme needles */}
            <g stroke="#544026" strokeWidth="1.1" fill="none" opacity="0.25" strokeLinecap="round">
              <path d="M 790 30 C 750 90, 730 180, 735 280 C 740 380, 725 480, 730 580" />
              {/* Needle clusters */}
              <path d="M 755 70 L 725 58 M 750 82 L 778 72 M 742 120 L 712 110 M 740 132 L 770 122" />
              <path d="M 738 180 L 708 172 M 737 192 L 767 184 M 738 240 L 708 234 M 737 252 L 767 246" />
              <path d="M 735 320 L 705 314 M 734 332 L 764 326 M 732 400 L 702 395 M 731 412 L 761 407" />
            </g>
          </g>
        )}

        {/* SOMMER 4: Apricot-Honig-Aquarell (Prominente, warme mediterrane Aquarell-Gestaltung) */}
        {motif === 'sommer-aquarell' && (
          <g>
            {/* 1. Large organic Apricot watercolor aura running deeply into upper page */}
            <path
              d="M 460 -50 C 580 -20, 810 30, 810 290 C 730 320, 610 240, 520 120 C 470 50, 440 -10, 460 -50 Z"
              fill="#E89B54"
              opacity="0.22"
              filter="url(#soft-watercolor-blur)"
            />
            {/* 2. Soft golden honey wash along mid right flank */}
            <path
              d="M 640 280 C 720 340, 810 420, 800 640 C 710 620, 660 480, 630 360 Z"
              fill="#F2B750"
              opacity="0.18"
              filter="url(#gentle-wash-blur)"
            />
            {/* 3. Subtle terracotta brush wash behind preparation area */}
            <path
              d="M 670 660 C 730 720, 805 790, 790 940 C 720 920, 680 810, 670 660 Z"
              fill="#D97A44"
              opacity="0.14"
              filter="url(#gentle-wash-blur)"
            />
            {/* 4. Lower left counter-wash in warm ocher / apricot */}
            <path
              d="M -40 880 C 90 870, 220 950, 180 1140 C 60 1140, -10 1060, -40 880 Z"
              fill="#E89B54"
              opacity="0.19"
              filter="url(#soft-watercolor-blur)"
            />

            {/* 5. Delicate apricot twig with fruit contours & leafy line art */}
            <g stroke="#7D4820" strokeWidth="1.15" fill="none" opacity="0.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 790 25 C 740 80, 715 160, 710 260 C 705 350, 730 450, 740 540" />
              {/* Apricot fruit contour 1 */}
              <path
                d="M 725 120 C 705 105, 690 125, 700 145 C 710 165, 740 160, 745 135 C 750 110, 735 100, 725 120 Z"
                fill="#F4A259"
                fillOpacity="0.45"
                stroke="#8A481C"
                strokeWidth="1.1"
              />
              <path d="M 724 116 C 720 128, 722 142, 728 152" stroke="#8A481C" strokeWidth="0.8" />
              {/* Organic leaves */}
              <path d="M 750 75 C 710 65, 695 40, 722 30 C 750 20, 770 55, 750 75 Z" fill="#889852" fillOpacity="0.28" />
              <path d="M 700 185 C 660 175, 645 150, 675 140 C 705 130, 725 165, 700 185 Z" fill="#889852" fillOpacity="0.28" />
              {/* Apricot fruit contour 2 */}
              <path
                d="M 705 260 C 685 245, 672 265, 680 285 C 690 305, 720 300, 725 275 C 730 250, 715 240, 705 260 Z"
                fill="#F4B259"
                fillOpacity="0.40"
                stroke="#8A481C"
                strokeWidth="1.0"
              />
              <path d="M 728 320 C 758 340, 770 370, 750 380 C 730 390, 710 355, 728 320 Z" fill="#889852" fillOpacity="0.26" />
            </g>

            {/* Lower-left leafy twig counter-accent */}
            <g stroke="#7D4820" strokeWidth="1.0" fill="none" opacity="0.22" strokeLinecap="round">
              <path d="M 20 1110 C 65 1060, 105 1010, 120 920" />
              <path d="M 55 1065 C 85 1040, 110 1035, 100 1015 C 90 995, 55 1025, 55 1065 Z" fill="#889852" fillOpacity="0.24" />
              <path d="M 85 1020 C 65 990, 55 965, 75 955 C 95 945, 110 985, 85 1020 Z" fill="#F4A259" fillOpacity="0.30" stroke="#8A481C" strokeWidth="0.9" />
            </g>
          </g>
        )}

        {/* SOMMER 5: Mediterrane botanische Line Art */}
        {motif === 'sommer-line-art' && (
          <g>
            <path
              d="M 580 -20 C 700 20, 810 100, 800 260 C 720 250, 640 170, 590 70 Z"
              fill="#E89B54"
              opacity="0.14"
              filter="url(#soft-watercolor-blur)"
            />
            {/* Refined clean graphic contour lines */}
            <g stroke="#7D4820" strokeWidth="1.2" fill="none" opacity="0.26" strokeLinecap="round">
              <path d="M 790 20 C 740 80, 720 180, 715 280 C 710 380, 740 480, 735 600 C 730 700, 700 780, 715 880" />
              <path d="M 755 70 C 705 55, 685 30, 715 20 C 745 10, 775 45, 755 70" />
              <circle cx="735" cy="140" r="16" fill="#F4B259" fillOpacity="0.28" stroke="#7D4820" strokeWidth="1.0" />
              <path d="M 718 260 C 668 245, 650 220, 680 210 C 710 200, 738 235, 718 260" />
              <circle cx="715" cy="330" r="14" fill="#F4B259" fillOpacity="0.28" stroke="#7D4820" strokeWidth="1.0" />
              <path d="M 732 450 C 685 435, 670 410, 700 400 C 730 390, 752 425, 732 450" />
            </g>
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            3. HERBST MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* HERBST 1: Elegantes Herbstlaub */}
        {motif === 'herbst-laub' && (
          <g>
            <path
              d="M 500 -40 C 640 -10, 810 50, 810 280 C 720 300, 590 210, 520 100 Z"
              fill="#B85829"
              opacity="0.20"
              filter="url(#soft-watercolor-blur)"
            />
            <path
              d="M 660 330 C 730 390, 810 470, 790 660 C 720 630, 670 500, 660 330 Z"
              fill="#C87B3E"
              opacity="0.15"
              filter="url(#gentle-wash-blur)"
            />
            <path
              d="M -40 900 C 80 900, 200 970, 170 1140 C 60 1140, -10 1070, -40 900 Z"
              fill="#9E461E"
              opacity="0.17"
              filter="url(#soft-watercolor-blur)"
            />

            {/* Autumn oak/beech leaves and branches */}
            <g stroke="#5E260D" strokeWidth="1.15" fill="none" opacity="0.25" strokeLinecap="round">
              <path d="M 790 30 C 740 90, 720 180, 715 280 C 710 380, 735 480, 740 570" />
              <path
                d="M 760 80 C 740 60, 715 65, 705 50 C 700 35, 720 25, 745 35 C 765 45, 775 65, 760 80 Z"
                fill="#C87B3E"
                fillOpacity="0.28"
              />
              <path
                d="M 735 170 C 715 150, 690 155, 680 140 C 675 125, 695 115, 720 125 C 740 135, 750 155, 735 170 Z"
                fill="#B85829"
                fillOpacity="0.28"
              />
              <path
                d="M 730 270 C 710 250, 685 255, 675 240 C 670 225, 690 215, 715 225 C 735 235, 745 255, 730 270 Z"
                fill="#C87B3E"
                fillOpacity="0.28"
              />
            </g>
          </g>
        )}

        {/* HERBST 2: Getrocknete Zweige */}
        {motif === 'herbst-zweige' && (
          <g>
            <path
              d="M 520 -30 C 650 0, 810 60, 810 260 C 720 280, 590 190, 530 80 Z"
              fill="#C87B3E"
              opacity="0.18"
              filter="url(#soft-watercolor-blur)"
            />
            <path
              d="M -30 940 C 80 940, 180 1010, 150 1140 C 50 1140, -10 1070, -30 940 Z"
              fill="#965328"
              opacity="0.16"
              filter="url(#soft-watercolor-blur)"
            />
            <g stroke="#5C2E14" strokeWidth="1.1" fill="none" opacity="0.24" strokeLinecap="round">
              <path d="M 790 30 C 745 90, 725 180, 730 280 C 735 380, 720 480, 725 580" />
              <path d="M 755 70 L 725 58 M 742 120 L 712 110 M 738 180 L 708 172 M 738 240 L 708 234" />
              <path d="M 725 58 C 705 50, 695 62, 708 72 C 720 80, 730 68, 725 58 Z" fill="#965328" fillOpacity="0.26" />
              <path d="M 712 110 C 692 102, 682 114, 695 124 C 707 132, 718 120, 712 110 Z" fill="#B85829" fillOpacity="0.26" />
              <path d="M 708 172 C 688 164, 678 176, 691 186 C 703 194, 714 182, 708 172 Z" fill="#965328" fillOpacity="0.26" />
            </g>
          </g>
        )}

        {/* HERBST 3: Ocker-Terrakotta-Aquarell */}
        {motif === 'herbst-aquarell' && (
          <g>
            <path
              d="M 460 -50 C 600 -20, 810 40, 810 300 C 720 320, 590 230, 510 110 Z"
              fill="#B85829"
              opacity="0.21"
              filter="url(#soft-watercolor-blur)"
            />
            <path
              d="M 640 320 C 720 380, 810 460, 790 680 C 710 650, 660 520, 640 320 Z"
              fill="#D98A44"
              opacity="0.16"
              filter="url(#gentle-wash-blur)"
            />
            <path
              d="M -40 880 C 90 880, 220 960, 180 1140 C 60 1140, -10 1060, -40 880 Z"
              fill="#C87B3E"
              opacity="0.18"
              filter="url(#soft-watercolor-blur)"
            />
            <circle cx="670" cy="190" r="45" fill="#9E461E" opacity="0.14" filter="url(#soft-watercolor-blur)" />
          </g>
        )}

        {/* HERBST 4: Herbst Botanical Line Art */}
        {motif === 'herbst-line-art' && (
          <g>
            <path
              d="M 580 -20 C 700 20, 810 100, 800 260 C 720 250, 640 170, 590 70 Z"
              fill="#C87B3E"
              opacity="0.14"
              filter="url(#soft-watercolor-blur)"
            />
            <g stroke="#5E260D" strokeWidth="1.2" fill="none" opacity="0.25" strokeLinecap="round">
              <path d="M 790 20 C 740 80, 720 180, 715 280 C 710 380, 740 480, 735 600 C 730 700, 700 780, 715 880" />
              <path d="M 755 70 C 705 55, 685 30, 715 20 C 745 10, 775 45, 755 70" />
              <circle cx="735" cy="140" r="16" fill="#B85829" fillOpacity="0.24" stroke="#5E260D" strokeWidth="1.0" />
              <path d="M 718 260 C 668 245, 650 220, 680 210 C 710 200, 738 235, 718 260" />
              <circle cx="715" cy="330" r="14" fill="#C87B3E" fillOpacity="0.24" stroke="#5E260D" strokeWidth="1.0" />
            </g>
          </g>
        )}

        {/* HERBST 5: Warme organische Naturformen */}
        {motif === 'herbst-natur' && (
          <g>
            <path
              d="M 520 -30 C 660 0, 810 60, 810 260 C 720 280, 590 190, 530 80 Z"
              fill="#C87B3E"
              opacity="0.18"
              filter="url(#soft-watercolor-blur)"
            />
            <g stroke="#6A3014" strokeWidth="1.1" fill="none" opacity="0.23">
              <path d="M 790 30 C 750 90, 730 180, 735 280 C 740 380, 725 480, 730 580" />
              <circle cx="740" cy="120" r="15" fill="#DE8A52" fillOpacity="0.25" stroke="none" />
              <circle cx="725" cy="240" r="13" fill="#B85829" fillOpacity="0.25" stroke="none" />
              <circle cx="735" cy="360" r="15" fill="#DE8A52" fillOpacity="0.25" stroke="none" />
            </g>
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            4. WINTER MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* WINTER 1: Kahle Winterzweige */}
        {motif === 'winter-zweige' && (
          <g>
            <path
              d="M 520 -30 C 660 0, 810 60, 810 260 C 720 280, 590 190, 530 80 Z"
              fill="#4F7285"
              opacity="0.18"
              filter="url(#soft-watercolor-blur)"
            />
            <path
              d="M -30 940 C 80 940, 180 1010, 150 1140 C 50 1140, -10 1070, -30 940 Z"
              fill="#557B8E"
              opacity="0.16"
              filter="url(#soft-watercolor-blur)"
            />
            <g stroke="#1F3B4A" strokeWidth="1.1" fill="none" opacity="0.25" strokeLinecap="round">
              <path d="M 790 30 C 745 90, 725 180, 730 280 C 735 380, 720 480, 725 580" />
              <path d="M 755 70 L 725 58 M 742 120 L 712 110 M 738 180 L 708 172 M 738 240 L 708 234" />
              <circle cx="725" cy="58" r="3.5" fill="#B2D2DE" fillOpacity="0.7" stroke="#1F3B4A" strokeWidth="0.8" />
              <circle cx="712" cy="110" r="3.5" fill="#B2D2DE" fillOpacity="0.7" stroke="#1F3B4A" strokeWidth="0.8" />
              <circle cx="708" cy="172" r="3.5" fill="#B2D2DE" fillOpacity="0.7" stroke="#1F3B4A" strokeWidth="0.8" />
            </g>
          </g>
        )}

        {/* WINTER 2: Reduzierte Tannenzweige */}
        {motif === 'winter-tannen' && (
          <g>
            <path
              d="M 520 -30 C 660 0, 810 60, 810 260 C 720 280, 590 190, 530 80 Z"
              fill="#365445"
              opacity="0.18"
              filter="url(#soft-watercolor-blur)"
            />
            <g stroke="#1F362A" strokeWidth="1.1" fill="none" opacity="0.25" strokeLinecap="round">
              <path d="M 790 30 C 745 90, 725 180, 730 280 C 735 380, 720 480, 725 580" />
              <path d="M 760 65 L 740 55 M 762 70 L 775 58 M 748 110 L 728 100 M 750 115 L 765 103" />
              <path d="M 742 170 L 722 162 M 744 175 L 758 164 M 740 230 L 720 224 M 742 235 L 755 224" />
            </g>
          </g>
        )}

        {/* WINTER 3: Eisblau-Rauchblau-Aquarell */}
        {motif === 'winter-aquarell' && (
          <g>
            <path
              d="M 460 -50 C 600 -20, 810 40, 810 300 C 720 320, 590 230, 510 110 Z"
              fill="#557B8E"
              opacity="0.20"
              filter="url(#soft-watercolor-blur)"
            />
            <path
              d="M 640 320 C 720 380, 810 460, 790 680 C 710 650, 660 520, 640 320 Z"
              fill="#6B8E9E"
              opacity="0.15"
              filter="url(#gentle-wash-blur)"
            />
            <path
              d="M -40 880 C 90 880, 220 960, 180 1140 C 60 1140, -10 1060, -40 880 Z"
              fill="#4F7285"
              opacity="0.17"
              filter="url(#soft-watercolor-blur)"
            />
          </g>
        )}

        {/* WINTER 4: Nordic Botanical Line Art */}
        {motif === 'winter-line-art' && (
          <g>
            <path
              d="M 580 -20 C 700 20, 810 100, 800 260 C 720 250, 640 170, 590 70 Z"
              fill="#557B8E"
              opacity="0.14"
              filter="url(#soft-watercolor-blur)"
            />
            <g stroke="#1F3B4A" strokeWidth="1.15" fill="none" opacity="0.25" strokeLinecap="round">
              <path d="M 790 20 C 740 80, 720 180, 715 280 C 710 380, 740 480, 735 600" />
              <circle cx="735" cy="110" r="4" fill="#B2D2DE" fillOpacity="0.8" stroke="#1F3B4A" strokeWidth="0.8" />
              <circle cx="720" cy="210" r="4" fill="#B2D2DE" fillOpacity="0.8" stroke="#1F3B4A" strokeWidth="0.8" />
              <circle cx="735" cy="310" r="4" fill="#B2D2DE" fillOpacity="0.8" stroke="#1F3B4A" strokeWidth="0.8" />
            </g>
          </g>
        )}

        {/* WINTER 5: Abstrakte frostige Naturformen */}
        {motif === 'winter-formen' && (
          <g>
            <path
              d="M 520 -30 C 660 0, 810 60, 810 260 C 720 280, 590 190, 530 80 Z"
              fill="#6B8E9E"
              opacity="0.18"
              filter="url(#soft-watercolor-blur)"
            />
            <g stroke="#2C4857" strokeWidth="1.1" fill="none" opacity="0.22">
              <path d="M 790 30 C 750 90, 730 180, 735 280 C 740 380, 725 480, 730 580" />
              <circle cx="735" cy="140" r="14" fill="#B2D2DE" fillOpacity="0.25" stroke="none" />
              <circle cx="725" cy="260" r="12" fill="#6B8E9E" fillOpacity="0.25" stroke="none" />
            </g>
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            5. ZEITLOS MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* ZEITLOS 1: Feine Leinenstruktur */}
        {motif === 'zeitlos-leinen' && (
          <g>
            <rect width="794" height="1123" fill="url(#linen-weave)" />
            <path
              d="M 520 -30 C 660 0, 810 60, 810 260 C 720 280, 590 190, 530 80 Z"
              fill="#8C7B6E"
              opacity="0.14"
              filter="url(#soft-watercolor-blur)"
            />
            <path
              d="M -30 940 C 80 940, 180 1010, 150 1140 C 50 1140, -10 1070, -30 940 Z"
              fill="#8C7B6E"
              opacity="0.12"
              filter="url(#soft-watercolor-blur)"
            />
          </g>
        )}

        {/* ZEITLOS 2: Organische Konturlinien */}
        {motif === 'zeitlos-linien' && (
          <g>
            <path
              d="M 560 -20 C 680 10, 810 80, 800 240 C 720 230, 620 160, 570 70 Z"
              fill="#9C8C7E"
              opacity="0.14"
              filter="url(#soft-watercolor-blur)"
            />
            <g stroke="#5E4E42" strokeWidth="1.15" fill="none" opacity="0.25" strokeLinecap="round">
              <path d="M 790 20 C 740 80, 720 180, 715 280 C 710 380, 740 480, 735 600" />
              <circle cx="735" cy="140" r="16" fill="#9C8C7E" fillOpacity="0.22" stroke="#5E4E42" strokeWidth="1.0" />
              <circle cx="725" cy="280" r="14" fill="#9C8C7E" fillOpacity="0.22" stroke="#5E4E42" strokeWidth="1.0" />
            </g>
          </g>
        )}

        {/* ZEITLOS 3: Greige-Aquarell */}
        {motif === 'zeitlos-aquarell' && (
          <g>
            <path
              d="M 460 -50 C 600 -20, 810 40, 810 300 C 720 320, 590 230, 510 110 Z"
              fill="#9C8C7E"
              opacity="0.19"
              filter="url(#soft-watercolor-blur)"
            />
            <path
              d="M 640 320 C 720 380, 810 460, 790 680 C 710 650, 660 520, 640 320 Z"
              fill="#B0A092"
              opacity="0.14"
              filter="url(#gentle-wash-blur)"
            />
            <path
              d="M -40 880 C 90 880, 220 960, 180 1140 C 60 1140, -10 1060, -40 880 Z"
              fill="#9C8C7E"
              opacity="0.16"
              filter="url(#soft-watercolor-blur)"
            />
          </g>
        )}

        {/* ZEITLOS 4: Monochrome botanische Kontur */}
        {motif === 'zeitlos-kontur' && (
          <g>
            <path
              d="M 560 -20 C 680 10, 810 80, 800 240 C 720 230, 620 160, 570 70 Z"
              fill="#9C8C7E"
              opacity="0.14"
              filter="url(#soft-watercolor-blur)"
            />
            <g stroke="#4E4035" strokeWidth="1.15" fill="none" opacity="0.25" strokeLinecap="round">
              <path d="M 790 30 C 750 90, 730 180, 735 280 C 740 380, 725 480, 730 580" />
              <path d="M 760 80 C 715 70, 690 55, 715 45 C 740 35, 775 65, 760 80 Z" fill="#9C8C7E" fillOpacity="0.22" />
              <path d="M 740 160 C 695 150, 675 130, 700 120 C 725 110, 755 145, 740 160 Z" fill="#9C8C7E" fillOpacity="0.22" />
              <path d="M 738 250 C 695 240, 675 220, 700 210 C 725 200, 755 235, 738 250 Z" fill="#9C8C7E" fillOpacity="0.22" />
            </g>
          </g>
        )}

        {/* ZEITLOS 5: Minimal Paper */}
        {motif === 'zeitlos-paper' && (
          <g>
            <path
              d="M 520 -30 C 660 0, 810 60, 810 260 C 720 280, 590 190, 530 80 Z"
              fill="#948578"
              opacity="0.12"
              filter="url(#soft-watercolor-blur)"
            />
            <path
              d="M -30 940 C 80 940, 180 1010, 150 1140 C 50 1140, -10 1070, -30 940 Z"
              fill="#948578"
              opacity="0.10"
              filter="url(#soft-watercolor-blur)"
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
