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
 * - Individual spatial signature for every single motif (no repetitive schematic layouts).
 * - Watercolor Pigment Filter with subtle organic displacement & paper bleed.
 * - Handcrafted botanical ink strokes (0.8 - 1.0px) with irregular organic paths (no clipart circles).
 * - Controlled editorial opacity (0.14 - 0.22 for washes, 0.18 - 0.28 for botanical accents).
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
          {/* Organic watercolor edge displacement: simulates wet-on-dry pigment bleed */}
          <filter id="watercolor-wash" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.032" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="14" />
          </filter>

          {/* Gentle diffused background wash */}
          <filter id="gentle-wash-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="22" />
          </filter>

          {/* Delicate botanical pigment blur for fruits & soft leaf tints */}
          <filter id="botanical-tint" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
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

        {/* FRÜHLING 1: Frische Kräuter
            Signatur: Lockere, feine aromatische Kräuterzweige (Estragon / Kerbel) im oberen Eckbereich
            mit zartem Salbeiwash nur oben rechts. Keine schweren Flächen unten. */}
        {motif === 'fruehling-kraeuter' && (
          <g>
            <path
              d="M 540 -30 C 650 10, 800 60, 790 230 C 710 240, 620 160, 560 70 Z"
              fill="#7AA66E"
              opacity="0.16"
              filter="url(#watercolor-wash)"
            />
            {/* Feine Handzeichnung: Kräuterstängel mit asymmetrischen Fiederblättchen */}
            <g stroke="#2F5426" strokeWidth="0.85" fill="none" opacity="0.26" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 775 20 C 730 75, 695 150, 680 245 C 670 310, 685 380, 705 450" />
              {/* Zarte, offene Fiederblätter */}
              <path d="M 740 65 C 710 50, 690 35, 715 25 C 735 18, 755 45, 740 65 Z" fill="#6E9864" fillOpacity="0.22" strokeWidth="0.75" />
              <path d="M 718 105 C 685 95, 670 78, 692 68 C 715 58, 735 88, 718 105 Z" fill="#7AA66E" fillOpacity="0.20" strokeWidth="0.75" />
              <path d="M 700 160 C 665 150, 645 130, 672 120 C 695 110, 718 140, 700 160 Z" fill="#6E9864" fillOpacity="0.22" strokeWidth="0.75" />
              <path d="M 686 215 C 650 205, 638 185, 660 178 C 682 170, 702 195, 686 215 Z" fill="#88B27F" fillOpacity="0.20" strokeWidth="0.75" />
              {/* Zweiter kleiner Nebenzweig */}
              <path d="M 698 165 C 725 185, 745 220, 735 250" />
              <path d="M 725 210 C 748 220, 760 240, 745 248 C 730 255, 715 230, 725 210 Z" fill="#7AA66E" fillOpacity="0.18" strokeWidth="0.75" />
            </g>
            {/* Minimaler, poetischer Gegenakzent am unteren linken Rand */}
            <g stroke="#2F5426" strokeWidth="0.8" fill="none" opacity="0.20" strokeLinecap="round">
              <path d="M 30 1100 C 55 1060, 75 1020, 85 960" />
              <path d="M 52 1055 C 72 1040, 88 1035, 80 1020 C 72 1005, 48 1025, 52 1055 Z" fill="#6E9864" fillOpacity="0.16" strokeWidth="0.7" />
            </g>
          </g>
        )}

        {/* FRÜHLING 2: Zarte Blätter
            Signatur: Horizontaler/diagonale Bewegung entlang des oberen Seitenrandes wie ein leichter
            Frühlingswind, transparente lindgrüne Blattaustriebe. */}
        {motif === 'fruehling-blaetter' && (
          <g>
            {/* Sanfter Schleier entlang der oberen Kante */}
            <path
              d="M 360 -40 C 500 -10, 720 15, 800 120 C 750 180, 580 120, 420 50 Z"
              fill="#88B27F"
              opacity="0.16"
              filter="url(#watercolor-wash)"
            />
            {/* Filigraner horizontal geschwungener Ast */}
            <g stroke="#35562C" strokeWidth="0.85" fill="none" opacity="0.25" strokeLinecap="round">
              <path d="M 790 35 C 710 45, 620 55, 530 85 C 460 110, 400 145, 360 170" />
              {/* Frische junge Blätter mit zarter Mittelrippe */}
              <path d="M 720 45 C 690 30, 675 15, 698 10 C 720 5, 735 30, 720 45 Z" fill="#7AA66E" fillOpacity="0.22" strokeWidth="0.75" />
              <path d="M 640 55 C 615 35, 605 18, 625 15 C 645 12, 655 40, 640 55 Z" fill="#88B27F" fillOpacity="0.22" strokeWidth="0.75" />
              <path d="M 560 75 C 530 60, 515 45, 535 38 C 555 30, 575 58, 560 75 Z" fill="#6E9864" fillOpacity="0.20" strokeWidth="0.75" />
              <path d="M 470 100 C 440 90, 425 75, 442 68 C 460 60, 480 85, 470 100 Z" fill="#7AA66E" fillOpacity="0.20" strokeWidth="0.75" />
              <path d="M 400 135 C 375 130, 360 115, 375 105 C 390 95, 408 120, 400 135 Z" fill="#88B27F" fillOpacity="0.18" strokeWidth="0.75" />
            </g>
          </g>
        )}

        {/* FRÜHLING 3: Reduzierte Frühlingsblüten
            Signatur: Ein feiner Obstblütenzweig (Apfel-/Mandelblüte) mit organisch gezeichneten Blütenblättern,
            keine starren Vektorkreise, mit sanftem Blütenstaub-Hauch. */}
        {motif === 'fruehling-blueten' && (
          <g>
            <path
              d="M 560 -30 C 670 10, 790 70, 790 220 C 710 210, 630 140, 580 60 Z"
              fill="#94BA8A"
              opacity="0.15"
              filter="url(#watercolor-wash)"
            />
            {/* Blütenzweig */}
            <g stroke="#3A5C30" strokeWidth="0.9" fill="none" opacity="0.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 790 40 C 730 80, 680 140, 650 220 C 630 280, 640 340, 660 400" />
              {/* Blüte 1: Organische, leicht geöffnete Blütenblätter */}
              <g transform="translate(710, 105)">
                <path d="M 0 -12 C 7 -15, 14 -7, 10 0 C 6 6, -3 8, -8 2 C -12 -3, -8 -10, 0 -12 Z" fill="#FFF7F0" fillOpacity="0.85" stroke="#3A5C30" strokeWidth="0.7" />
                <path d="M 6 -4 C 13 -4, 15 5, 8 9 C 2 12, -2 6, 6 -4 Z" fill="#FCECE6" fillOpacity="0.75" stroke="#3A5C30" strokeWidth="0.65" />
                <path d="M -6 -3 C -13 -3, -14 6, -7 8 C -1 10, 2 5, -6 -3 Z" fill="#FFF7F0" fillOpacity="0.85" stroke="#3A5C30" strokeWidth="0.65" />
                {/* Staubfäden */}
                <circle cx="1" cy="1" r="2.2" fill="#D98A3B" fillOpacity="0.65" stroke="none" />
              </g>
              {/* Blüte 2: Zarte Knospe weiter unten */}
              <g transform="translate(655, 235)">
                <path d="M -3 -8 C 5 -10, 9 -2, 5 5 C 1 10, -5 7, -7 1 C -9 -4, -6 -7, -3 -8 Z" fill="#FFF7F0" fillOpacity="0.85" stroke="#3A5C30" strokeWidth="0.7" />
                <circle cx="0" cy="0" r="1.8" fill="#D98A3B" fillOpacity="0.6" stroke="none" />
              </g>
              {/* Zarte Blattaustriebe */}
              <path d="M 740 60 C 720 45, 715 25, 732 20 C 748 15, 755 42, 740 60 Z" fill="#7AA66E" fillOpacity="0.20" strokeWidth="0.7" />
              <path d="M 670 170 C 645 160, 638 140, 658 135 C 675 130, 685 155, 670 170 Z" fill="#88B27F" fillOpacity="0.20" strokeWidth="0.7" />
            </g>
          </g>
        )}

        {/* FRÜHLING 4: Botanical Line Art
            Signatur: Reine filigrane Tuschezeichnung (Wiesenkerbel / Wilde Möhre),
            nur haarfeine Striche, fast keine Farbfläche – pure Eleganz. */}
        {motif === 'fruehling-line-art' && (
          <g>
            <path
              d="M 620 -10 C 710 20, 790 80, 780 200 C 720 180, 660 120, 620 40 Z"
              fill="#7AA66E"
              opacity="0.10"
              filter="url(#watercolor-wash)"
            />
            <g stroke="#2F5426" strokeWidth="0.85" fill="none" opacity="0.27" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 780 30 C 740 90, 715 170, 705 260 C 695 350, 710 440, 720 530" />
              {/* Filigrane Doldenstrahlen */}
              <path d="M 735 90 L 695 70 M 735 90 L 705 55 M 735 90 L 725 45 M 735 90 L 750 48" />
              <circle cx="695" cy="70" r="1.2" fill="#2F5426" />
              <circle cx="705" cy="55" r="1.2" fill="#2F5426" />
              <circle cx="725" cy="45" r="1.2" fill="#2F5426" />
              <circle cx="750" cy="48" r="1.2" fill="#2F5426" />

              <path d="M 710 210 L 670 195 M 710 210 L 680 180 M 710 210 L 698 170" />
              <circle cx="670" cy="195" r="1.2" fill="#2F5426" />
              <circle cx="680" cy="180" r="1.2" fill="#2F5426" />
              <circle cx="698" cy="170" r="1.2" fill="#2F5426" />

              <path d="M 708 340 L 675 330 M 708 340 L 685 315" />
              <circle cx="675" cy="330" r="1.2" fill="#2F5426" />
              <circle cx="685" cy="315" r="1.2" fill="#2F5426" />
            </g>
          </g>
        )}

        {/* FRÜHLING 5: Salbei-Aquarell
            Signatur: Reine Malerei. Großzügige, samtige Salbei- und Celadon-Pigmentschleier oben rechts
            mit weich ineinanderfließenden Tonwerten. Keine Vektor-Sticker. */}
        {motif === 'fruehling-aquarell' && (
          <g>
            <path
              d="M 440 -40 C 580 -20, 780 30, 780 260 C 690 270, 560 190, 480 80 Z"
              fill="#7AA66E"
              opacity="0.18"
              filter="url(#watercolor-wash)"
            />
            <path
              d="M 580 120 C 680 160, 770 230, 760 380 C 690 360, 630 280, 580 120 Z"
              fill="#88B27F"
              opacity="0.14"
              filter="url(#gentle-wash-blur)"
            />
            {/* Sanfte, transluzente Überlagerung */}
            <path
              d="M -30 650 C 70 650, 140 710, 120 820 C 40 820, -10 770, -30 650 Z"
              fill="#7AA66E"
              opacity="0.12"
              filter="url(#watercolor-wash)"
            />
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            2. SOMMER MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* SOMMER 1: Kleiner Zitronenzweig
            Signatur: Ein dominanter, feiner Zweig ragt diagonal von rechts oben Richtung Seitenmitte.
            Eine zarte, organisch gezeichnete kleine Zitrone (kein fettes Vektorei!),
            leichte Gelb-/Oliv-Wash NUR im oberen Drittel. */}
        {motif === 'sommer-zitrone' && (
          <g>
            {/* Warm-sonniger zarter Schleier nur oben */}
            <path
              d="M 480 -30 C 620 -10, 790 40, 780 220 C 700 210, 580 140, 500 50 Z"
              fill="#E8A64E"
              opacity="0.16"
              filter="url(#watercolor-wash)"
            />
            {/* Diagonaler Zweig von rechts oben zur Seitenmitte */}
            <g stroke="#5A421A" strokeWidth="0.9" fill="none" opacity="0.26" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 790 15 C 720 50, 650 95, 570 140 C 510 170, 460 185, 410 180" />
              {/* Kleine Aquarellzitrone (organische Bezier-Form, zarter Farbverlauf) */}
              <path
                d="M 590 125 C 575 110, 550 115, 540 135 C 530 155, 545 178, 565 182 C 585 186, 608 170, 612 148 C 615 135, 605 120, 590 125 Z"
                fill="#F4C842"
                fillOpacity="0.32"
                stroke="#6E4C18"
                strokeWidth="0.85"
              />
              {/* Zarter Schattenspitz an der Zitrone */}
              <path d="M 537 137 C 532 142, 533 148, 539 152" stroke="#6E4C18" strokeWidth="0.7" />

              {/* Mediterrane Blätter am Zweig */}
              <path d="M 670 85 C 635 70, 620 48, 645 40 C 670 32, 692 65, 670 85 Z" fill="#688040" fillOpacity="0.24" strokeWidth="0.75" />
              <path d="M 610 120 C 580 100, 575 80, 595 75 C 615 70, 630 100, 610 120 Z" fill="#788850" fillOpacity="0.22" strokeWidth="0.75" />
              <path d="M 510 170 C 475 160, 460 142, 482 135 C 505 128, 528 152, 510 170 Z" fill="#688040" fillOpacity="0.22" strokeWidth="0.75" />
              <path d="M 440 185 C 410 180, 395 165, 412 158 C 430 150, 452 172, 440 185 Z" fill="#788850" fillOpacity="0.20" strokeWidth="0.75" />
            </g>
          </g>
        )}

        {/* SOMMER 2: Olivenzweige
            Signatur: Langer, vertikaler toskanischer Olivenzweig entlang der rechten Außenkante,
            schmale lanzettliche Blätter, kleine dunkle Olivenfrüchte, graugrüner diffuser Wash eher mittig/rechts. */}
        {motif === 'sommer-oliven' && (
          <g>
            {/* Diffuser graugrüner Wash im mittleren Seitenbereich rechts */}
            <path
              d="M 640 240 C 720 280, 790 350, 780 540 C 700 520, 650 420, 630 310 Z"
              fill="#7A8260"
              opacity="0.15"
              filter="url(#watercolor-wash)"
            />
            {/* Feiner Olivenzweig an der rechten Außenkante */}
            <g stroke="#3D4428" strokeWidth="0.85" fill="none" opacity="0.26" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 780 40 C 745 110, 730 200, 735 300 C 740 400, 725 500, 730 600" />
              {/* Schmale Olivenblätter */}
              <path d="M 750 90 C 710 80, 690 65, 712 55 C 735 45, 765 75, 750 90 Z" fill="#687250" fillOpacity="0.24" strokeWidth="0.7" />
              <path d="M 735 155 C 695 145, 680 128, 702 118 C 725 108, 750 140, 735 155 Z" fill="#78805E" fillOpacity="0.24" strokeWidth="0.7" />
              <path d="M 732 235 C 692 225, 675 208, 698 198 C 720 188, 748 220, 732 235 Z" fill="#687250" fillOpacity="0.24" strokeWidth="0.7" />
              <path d="M 738 330 C 700 320, 685 302, 708 292 C 730 282, 755 315, 738 330 Z" fill="#78805E" fillOpacity="0.24" strokeWidth="0.7" />
              <path d="M 730 430 C 692 420, 678 402, 700 392 C 722 382, 748 415, 730 430 Z" fill="#687250" fillOpacity="0.22" strokeWidth="0.7" />
              {/* Dunkle Olivenfrüchte (kleine unregelmäßige Tropfen) */}
              <path d="M 716 168 C 713 162, 722 158, 725 164 C 728 170, 720 174, 716 168 Z" fill="#2E3320" fillOpacity="0.36" stroke="none" />
              <path d="M 714 345 C 711 339, 720 335, 723 341 C 726 347, 718 351, 714 345 Z" fill="#2E3320" fillOpacity="0.36" stroke="none" />
            </g>
          </g>
        )}

        {/* SOMMER 3: Rosmarin / Sommerkräuter
            Signatur: Trockener, linearer Charakter, mehrere feine Rosmarin-/Thymianlinien,
            stärker verteilt, deutlich weniger große Farbflächen. */}
        {motif === 'sommer-kraeuter' && (
          <g>
            {/* Sehr dezenter ocker-trockener Pigmenthauch oben */}
            <path
              d="M 580 -20 C 680 10, 780 60, 770 180 C 710 170, 640 110, 590 40 Z"
              fill="#A68250"
              opacity="0.12"
              filter="url(#watercolor-wash)"
            />
            {/* Feine Nadeln & holzige Zweige */}
            <g stroke="#544026" strokeWidth="0.8" fill="none" opacity="0.26" strokeLinecap="round">
              <path d="M 780 30 C 740 90, 720 170, 725 260 C 730 350, 715 440, 720 520" />
              {/* Rosmarinnadel-Cluster */}
              <path d="M 748 70 L 720 58 M 744 82 L 770 72" />
              <path d="M 735 120 L 708 110 M 734 132 L 762 122" />
              <path d="M 730 180 L 702 172 M 728 192 L 756 184" />
              <path d="M 728 240 L 700 234 M 727 252 L 755 246" />
              <path d="M 722 320 L 695 314 M 721 332 L 749 326" />
              <path d="M 720 400 L 694 395 M 719 412 L 747 407" />
            </g>
            {/* Zweiter feiner Thymianzweig unten links */}
            <g stroke="#544026" strokeWidth="0.75" fill="none" opacity="0.20" strokeLinecap="round">
              <path d="M 20 1090 C 50 1050, 75 1010, 90 950" />
              <path d="M 45 1050 L 65 1040 M 60 1015 L 80 1005" />
            </g>
          </g>
        )}

        {/* SOMMER 4: Apricot-Honig-Aquarell
            Signatur: Primär abstrakte, warme malerische Washes in Apricot, Goldhonig & Pfirsich.
            Große Apricotfläche oben rechts, weiche Honigschleier, fast keine harten Äste. */}
        {motif === 'sommer-aquarell' && (
          <g>
            {/* Primäre leuchtende Apricotfläche oben rechts */}
            <path
              d="M 420 -50 C 560 -20, 790 20, 790 270 C 710 300, 590 220, 500 110 C 450 40, 410 -10, 420 -50 Z"
              fill="#E89B54"
              opacity="0.20"
              filter="url(#watercolor-wash)"
            />
            {/* Weicher goldener Honigschleier entlang der rechten Flanke */}
            <path
              d="M 620 250 C 710 310, 790 390, 780 590 C 700 570, 640 440, 610 330 Z"
              fill="#F2B750"
              opacity="0.16"
              filter="url(#gentle-wash-blur)"
            />
            {/* Zarter Pfirsich-Gegenakzent unten links */}
            <path
              d="M -30 920 C 70 910, 160 970, 140 1110 C 40 1110, -10 1050, -30 920 Z"
              fill="#E89B54"
              opacity="0.15"
              filter="url(#watercolor-wash)"
            />
            {/* Sehr reduzierte, feine Tuscheakzente */}
            <g stroke="#8A481C" strokeWidth="0.8" fill="none" opacity="0.22" strokeLinecap="round">
              <path d="M 760 50 C 720 95, 700 160, 695 240" />
              <path d="M 725 110 C 700 100, 690 85, 710 78 C 728 70, 742 95, 725 110 Z" fill="#889852" fillOpacity="0.20" strokeWidth="0.7" />
            </g>
          </g>
        )}

        {/* SOMMER 5: Mediterrane botanische Line Art
            Signatur: Reduzierte, elegante Tuschekontur mediterraner Pflanzenlinien (Feigenblatt-Inspiration),
            warme Terrakotta-Linienführung, grafisch und modern. */}
        {motif === 'sommer-line-art' && (
          <g>
            <path
              d="M 600 -20 C 700 20, 790 80, 780 220 C 710 210, 640 150, 600 60 Z"
              fill="#E89B54"
              opacity="0.12"
              filter="url(#watercolor-wash)"
            />
            <g stroke="#7D4820" strokeWidth="0.85" fill="none" opacity="0.26" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 780 30 C 735 90, 715 180, 710 280 C 705 380, 730 480, 725 580" />
              {/* Grafisch reduzierte Blattkontur */}
              <path d="M 745 75 C 700 65, 680 40, 710 32 C 738 25, 762 55, 745 75" />
              <path d="M 720 165 C 675 155, 655 130, 685 120 C 715 110, 738 142, 720 165" />
              <path d="M 715 270 C 670 260, 650 235, 680 225 C 710 215, 735 248, 715 270" />
              <path d="M 725 390 C 685 380, 670 358, 698 350 C 725 342, 748 372, 725 390" />
            </g>
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            3. HERBST MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* HERBST 1: Elegantes Herbstlaub
            Signatur: Herbstliches Blattwerk (Buchen-/Eichenblatt) asymmetrisch herabgleitend,
            warme Rost- und Bernsteintöne, ruhige Eleganz. */}
        {motif === 'herbst-laub' && (
          <g>
            <path
              d="M 480 -40 C 620 -10, 780 40, 780 260 C 700 280, 580 200, 510 90 Z"
              fill="#B85829"
              opacity="0.18"
              filter="url(#watercolor-wash)"
            />
            {/* Blätterzweig mit individuellen, unregelmäßigen Blattformen */}
            <g stroke="#5E260D" strokeWidth="0.85" fill="none" opacity="0.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 780 25 C 730 85, 705 170, 700 265 C 695 355, 720 445, 725 530" />
              {/* Eichenähnliche geschwungene Blätter */}
              <path
                d="M 745 75 C 720 58, 695 62, 690 48 C 685 35, 705 25, 728 32 C 750 40, 760 60, 745 75 Z"
                fill="#C87B3E"
                fillOpacity="0.25"
                strokeWidth="0.75"
              />
              <path
                d="M 718 160 C 695 142, 672 148, 665 135 C 660 122, 680 112, 702 120 C 722 128, 732 148, 718 160 Z"
                fill="#B85829"
                fillOpacity="0.25"
                strokeWidth="0.75"
              />
              <path
                d="M 712 255 C 690 238, 668 242, 660 230 C 655 218, 675 208, 698 215 C 718 222, 728 242, 712 255 Z"
                fill="#C87B3E"
                fillOpacity="0.25"
                strokeWidth="0.75"
              />
            </g>
          </g>
        )}

        {/* HERBST 2: Getrocknete Zweige
            Signatur: Knorriger Hagebutten-/Schlehenzweig mit kleinen Beeren,
            spröde und reduziert. */}
        {motif === 'herbst-zweige' && (
          <g>
            <path
              d="M 580 -20 C 680 10, 780 60, 770 190 C 710 180, 640 120, 590 50 Z"
              fill="#C87B3E"
              opacity="0.14"
              filter="url(#watercolor-wash)"
            />
            <g stroke="#5C2E14" strokeWidth="0.85" fill="none" opacity="0.25" strokeLinecap="round">
              <path d="M 780 30 C 738 85, 718 170, 722 265 C 726 360, 712 450, 716 540" />
              {/* Feine Äste mit Knospen/Beeren */}
              <path d="M 742 70 L 715 60 M 732 120 L 705 112 M 728 180 L 700 174" />
              {/* Kleine Hagebutten */}
              <path d="M 715 60 C 711 55, 719 50, 722 55 C 725 60, 718 64, 715 60 Z" fill="#8C2D18" fillOpacity="0.32" stroke="none" />
              <path d="M 705 112 C 701 107, 709 102, 712 107 C 715 112, 708 116, 705 112 Z" fill="#8C2D18" fillOpacity="0.32" stroke="none" />
            </g>
          </g>
        )}

        {/* HERBST 3: Ocker-Terrakotta-Aquarell
            Signatur: Tiefe Nass-in-Nass Pigmentschleier in Ocker, Siena und Terrakotta. */}
        {motif === 'herbst-aquarell' && (
          <g>
            <path
              d="M 420 -50 C 560 -20, 780 30, 780 270 C 700 290, 580 210, 500 100 Z"
              fill="#B85829"
              opacity="0.19"
              filter="url(#watercolor-wash)"
            />
            <path
              d="M 600 280 C 690 340, 780 420, 760 620 C 690 600, 640 480, 610 360 Z"
              fill="#D98A44"
              opacity="0.14"
              filter="url(#gentle-wash-blur)"
            />
          </g>
        )}

        {/* HERBST 4: Herbst Botanical Line Art
            Signatur: Filigrane Weizenähren / trockene Gräser am rechten Rand, rein linear. */}
        {motif === 'herbst-line-art' && (
          <g>
            <path
              d="M 620 -10 C 710 20, 780 80, 770 200 C 710 190, 650 130, 610 50 Z"
              fill="#C87B3E"
              opacity="0.11"
              filter="url(#watercolor-wash)"
            />
            <g stroke="#5E260D" strokeWidth="0.85" fill="none" opacity="0.26" strokeLinecap="round">
              <path d="M 780 20 C 735 80, 715 170, 710 270 C 705 370, 725 470, 720 570" />
              {/* Feine Ährenspindeln */}
              <path d="M 742 65 L 720 52 M 748 75 L 768 62" />
              <path d="M 730 115 L 708 102 M 736 125 L 756 112" />
              <path d="M 724 175 L 702 162 M 730 185 L 750 172" />
              <path d="M 722 245 L 700 232 M 728 255 L 748 242" />
            </g>
          </g>
        )}

        {/* HERBST 5: Warme organische Naturformen
            Signatur: Gedeckte, ruhige Waldformen (Eichelkappen-Inspiration / Haselnuss) in Erdtönen. */}
        {motif === 'herbst-natur' && (
          <g>
            <path
              d="M 520 -30 C 650 0, 790 60, 780 240 C 700 250, 590 180, 530 80 Z"
              fill="#C87B3E"
              opacity="0.16"
              filter="url(#watercolor-wash)"
            />
            <g stroke="#6A3014" strokeWidth="0.85" fill="none" opacity="0.23" strokeLinecap="round">
              <path d="M 780 30 C 740 90, 720 180, 725 270" />
              <path d="M 735 110 C 720 95, 705 110, 720 125 Z" fill="#DE8A52" fillOpacity="0.22" strokeWidth="0.75" />
              <path d="M 720 220 C 705 205, 690 220, 705 235 Z" fill="#B85829" fillOpacity="0.22" strokeWidth="0.75" />
            </g>
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            4. WINTER MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* WINTER 1: Kahle Winterzweige
            Signatur: Schlafende, karge Winteräste mit zarten Raureifspuren in kühlem Schiefer- und Rauchblau. */}
        {motif === 'winter-zweige' && (
          <g>
            <path
              d="M 520 -30 C 640 0, 780 60, 780 240 C 700 250, 590 180, 530 80 Z"
              fill="#4F7285"
              opacity="0.16"
              filter="url(#watercolor-wash)"
            />
            <g stroke="#1F3B4A" strokeWidth="0.85" fill="none" opacity="0.25" strokeLinecap="round">
              <path d="M 780 30 C 738 85, 718 170, 722 265 C 726 360, 712 450, 716 540" />
              <path d="M 745 70 L 718 58 M 734 120 L 706 110 M 730 180 L 702 172" />
              {/* Feine Raureifpunkte */}
              <circle cx="718" cy="58" r="2.2" fill="#B2D2DE" fillOpacity="0.55" stroke="#1F3B4A" strokeWidth="0.6" />
              <circle cx="706" cy="110" r="2.2" fill="#B2D2DE" fillOpacity="0.55" stroke="#1F3B4A" strokeWidth="0.6" />
            </g>
          </g>
        )}

        {/* WINTER 2: Reduzierte Tannenzweige
            Signatur: Lärchen- / Kiefernzweig mit zarten Nadelbüscheln, dezent horizontal/bogig
            oben rechts über das Eck laufend (kein Kitsch!). */}
        {motif === 'winter-tannen' && (
          <g>
            <path
              d="M 480 -30 C 600 -10, 780 40, 770 200 C 690 190, 570 120, 500 50 Z"
              fill="#365445"
              opacity="0.15"
              filter="url(#watercolor-wash)"
            />
            <g stroke="#1F362A" strokeWidth="0.85" fill="none" opacity="0.25" strokeLinecap="round">
              <path d="M 780 25 C 710 40, 630 65, 560 105 C 510 135, 470 170, 440 200" />
              {/* Nadelbüschel */}
              <path d="M 720 40 L 705 28 M 722 42 L 728 25 M 718 45 L 700 40" />
              <path d="M 645 62 L 630 50 M 647 64 L 652 46 M 643 66 L 625 60" />
              <path d="M 570 100 L 555 88 M 572 102 L 576 84 M 568 104 L 550 98" />
            </g>
          </g>
        )}

        {/* WINTER 3: Eisblau-Rauchblau-Aquarell
            Signatur: Reiner, weicher Nebelhorizont in Rauchblau und Eisblau. Ruhig und klar. */}
        {motif === 'winter-aquarell' && (
          <g>
            <path
              d="M 420 -50 C 560 -20, 780 30, 780 270 C 700 290, 580 210, 500 100 Z"
              fill="#557B8E"
              opacity="0.18"
              filter="url(#watercolor-wash)"
            />
            <path
              d="M 600 280 C 690 340, 780 420, 760 620 C 690 600, 640 480, 610 360 Z"
              fill="#6B8E9E"
              opacity="0.13"
              filter="url(#gentle-wash-blur)"
            />
          </g>
        )}

        {/* WINTER 4: Nordic Botanical Line Art
            Signatur: Filigrane, scharf gezeichnete Tuschelinien getrockneter Wintergräser / Schilf. */}
        {motif === 'winter-line-art' && (
          <g>
            <path
              d="M 620 -10 C 710 20, 780 80, 770 200 C 710 190, 650 130, 610 50 Z"
              fill="#557B8E"
              opacity="0.11"
              filter="url(#watercolor-wash)"
            />
            <g stroke="#1F3B4A" strokeWidth="0.85" fill="none" opacity="0.25" strokeLinecap="round">
              <path d="M 780 20 C 735 80, 715 170, 710 270 C 705 370, 725 470, 720 570" />
              <circle cx="725" cy="95" r="2.5" fill="#B2D2DE" fillOpacity="0.65" stroke="#1F3B4A" strokeWidth="0.6" />
              <circle cx="712" cy="190" r="2.5" fill="#B2D2DE" fillOpacity="0.65" stroke="#1F3B4A" strokeWidth="0.6" />
              <circle cx="722" cy="285" r="2.5" fill="#B2D2DE" fillOpacity="0.65" stroke="#1F3B4A" strokeWidth="0.6" />
            </g>
          </g>
        )}

        {/* WINTER 5: Abstrakte frostige Naturformen
            Signatur: Dezente weiche Frostschattierungen. */}
        {motif === 'winter-formen' && (
          <g>
            <path
              d="M 520 -30 C 650 0, 790 60, 780 240 C 700 250, 590 180, 530 80 Z"
              fill="#6B8E9E"
              opacity="0.16"
              filter="url(#watercolor-wash)"
            />
            <g stroke="#2C4857" strokeWidth="0.85" fill="none" opacity="0.22" strokeLinecap="round">
              <path d="M 780 30 C 740 90, 720 180, 725 270" />
              <path d="M 735 120 C 720 108, 710 120, 725 132 Z" fill="#B2D2DE" fillOpacity="0.22" strokeWidth="0.7" />
            </g>
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════
            5. ZEITLOS MOTIFE (5 VARIANTEN)
            ════════════════════════════════════════════════════════════ */}

        {/* ZEITLOS 1: Feine Leinenstruktur
            Signatur: Subtiles warmes Webmuster mit zartem Hafermilch-Wash. */}
        {motif === 'zeitlos-leinen' && (
          <g>
            <rect width="794" height="1123" fill="url(#linen-weave)" />
            <path
              d="M 520 -30 C 650 0, 790 60, 780 240 C 700 250, 590 180, 530 80 Z"
              fill="#8C7B6E"
              opacity="0.12"
              filter="url(#watercolor-wash)"
            />
          </g>
        )}

        {/* ZEITLOS 2: Organische Konturlinien
            Signatur: Feine, ruhige Kiesel- und Horizontkonturen in Greige. */}
        {motif === 'zeitlos-linien' && (
          <g>
            <path
              d="M 600 -20 C 700 20, 780 80, 770 200 C 710 190, 630 140, 590 50 Z"
              fill="#9C8C7E"
              opacity="0.12"
              filter="url(#watercolor-wash)"
            />
            <g stroke="#5E4E42" strokeWidth="0.85" fill="none" opacity="0.24" strokeLinecap="round">
              <path d="M 780 20 C 735 80, 715 170, 710 270 C 705 370, 725 470, 720 570" />
              <path d="M 730 130 C 712 118, 702 130, 720 142 Z" fill="#9C8C7E" fillOpacity="0.18" strokeWidth="0.7" />
            </g>
          </g>
        )}

        {/* ZEITLOS 3: Greige-Aquarell
            Signatur: Minimalistischer Cashmere- und Hafer-Pigmentschleier. */}
        {motif === 'zeitlos-aquarell' && (
          <g>
            <path
              d="M 420 -50 C 560 -20, 780 30, 780 270 C 700 290, 580 210, 500 100 Z"
              fill="#9C8C7E"
              opacity="0.16"
              filter="url(#watercolor-wash)"
            />
            <path
              d="M 600 280 C 690 340, 780 420, 760 620 C 690 600, 640 480, 610 360 Z"
              fill="#B0A092"
              opacity="0.12"
              filter="url(#gentle-wash-blur)"
            />
          </g>
        )}

        {/* ZEITLOS 4: Monochrome botanische Kontur
            Signatur: Edle monochrome Pflanzenkontur in Graphit/Taupe. */}
        {motif === 'zeitlos-kontur' && (
          <g>
            <path
              d="M 600 -20 C 700 20, 780 80, 770 200 C 710 190, 630 140, 590 50 Z"
              fill="#9C8C7E"
              opacity="0.12"
              filter="url(#watercolor-wash)"
            />
            <g stroke="#4E4035" strokeWidth="0.85" fill="none" opacity="0.25" strokeLinecap="round">
              <path d="M 780 30 C 740 90, 720 180, 725 270 C 730 360, 715 450, 720 540" />
              <path d="M 750 80 C 715 70, 695 55, 715 48 C 735 40, 760 65, 750 80 Z" fill="#9C8C7E" fillOpacity="0.18" strokeWidth="0.7" />
              <path d="M 732 160 C 698 150, 680 135, 700 128 C 720 120, 745 145, 732 160 Z" fill="#9C8C7E" fillOpacity="0.18" strokeWidth="0.7" />
            </g>
          </g>
        )}

        {/* ZEITLOS 5: Minimal Paper
            Signatur: Hauchzarte, fast unsichtbare Papiertönung. */}
        {motif === 'zeitlos-paper' && (
          <g>
            <path
              d="M 520 -30 C 650 0, 790 60, 780 240 C 700 250, 590 180, 530 80 Z"
              fill="#948578"
              opacity="0.10"
              filter="url(#watercolor-wash)"
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
