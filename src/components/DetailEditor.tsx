import React, { useState } from 'react';
import { RecipePageData, Season, Category, MasterVariant, IngredientGroup } from '../types/recipe';
import {
  Tag,
  Clock,
  Layers,
  ChefHat,
  Scale,
  Sparkles,
  Plus,
  Trash2,
  ArrowLeftRight,
  Image as ImageIcon,
  Flame,
} from 'lucide-react';

interface DetailEditorProps {
  recipe: RecipePageData;
  onChange: (updated: RecipePageData) => void;
}

const COMMON_TAGS = [
  'HIGH PROTEIN',
  'SCHNELL',
  'MEAL PREP',
  'AIRFRYER',
  'ONE POT',
  'VEGETARISCH',
  'VEGAN',
  'CARB-REICH',
  'HERZHAFT',
  'FLUFFIG',
  'WÄRMEND',
  'ASIASTYLE',
  'DIP',
  'SAUCE',
  'NINJA CREAMI',
];

const SEASONS: Season[] = ['Frühling', 'Sommer', 'Herbst', 'Winter', 'Zeitlos'];
const CATEGORIES: Category[] = [
  'Frühstück & Bowls',
  'Hauptgerichte',
  'Snacks & Desserts',
  'Saucen & Basics',
  'Drinks',
];

const PRESET_PHOTOS = [
  {
    name: 'Chicken Gyros Pita Bowl',
    url: '/src/assets/images/chicken_gyros_bowl_1791146799733.jpg',
  },
  {
    name: 'Kürbis-Gnocchi mit Salbei',
    url: '/src/assets/images/pumpkin_gnocchi_1791146812345.jpg',
  },
  {
    name: 'Berry Protein Bowl',
    url: '/src/assets/images/berry_protein_bowl_1791146822339.jpg',
  },
];

export const DetailEditor: React.FC<DetailEditorProps> = ({ recipe, onChange }) => {
  const [activeTab, setActiveTab] = useState<
    'basis' | 'blick' | 'zutaten' | 'schritte' | 'naehrwerte' | 'foto'
  >('basis');

  const update = (patch: Partial<RecipePageData>) => {
    onChange({ ...recipe, ...patch, updatedAt: new Date().toISOString() });
  };

  // Helper for tags
  const handleTagChange = (index: number, val: string) => {
    const newTags = [...recipe.tags] as [string, string, string, string];
    newTags[index] = val.toUpperCase();
    update({ tags: newTags });
  };

  // Helper for quick tags chip click
  const handleAddQuickTag = (tag: string) => {
    const current = [...recipe.tags];
    const emptyIndex = current.findIndex(t => !t || t.startsWith('TAG'));
    if (emptyIndex !== -1) {
      current[emptyIndex] = tag;
      update({ tags: current as [string, string, string, string] });
    } else {
      // replace last tag
      current[3] = tag;
      update({ tags: current as [string, string, string, string] });
    }
  };

  // Zutaten helpers
  const handleMoveGroup = (groupId: string, fromCol: 'left' | 'right') => {
    const leftGroups = [...recipe.columnLeft.groups];
    const rightGroups = [...recipe.columnRight.groups];

    if (fromCol === 'left') {
      const idx = leftGroups.findIndex(g => g.id === groupId);
      if (idx !== -1) {
        const [moved] = leftGroups.splice(idx, 1);
        rightGroups.push(moved);
      }
    } else {
      const idx = rightGroups.findIndex(g => g.id === groupId);
      if (idx !== -1) {
        const [moved] = rightGroups.splice(idx, 1);
        leftGroups.push(moved);
      }
    }

    update({
      columnLeft: { groups: leftGroups },
      columnRight: { groups: rightGroups },
    });
  };

  const handleAddGroup = (col: 'left' | 'right') => {
    const newGroup: IngredientGroup = {
      id: `group-${Date.now()}`,
      header: 'NEUE KOMPONENTE',
      items: [{ id: `item-${Date.now()}`, amount: '1 Prise', name: 'Neue Zutat' }],
    };

    if (col === 'left') {
      update({
        columnLeft: { groups: [...recipe.columnLeft.groups, newGroup] },
      });
    } else {
      update({
        columnRight: { groups: [...recipe.columnRight.groups, newGroup] },
      });
    }
  };

  const handleAddItemToGroup = (groupId: string, col: 'left' | 'right') => {
    const targetGroups = col === 'left' ? [...recipe.columnLeft.groups] : [...recipe.columnRight.groups];
    const group = targetGroups.find(g => g.id === groupId);
    if (group) {
      group.items.push({
        id: `item-${Date.now()}-${Math.random()}`,
        amount: '1 EL',
        name: 'Neue Zutat',
      });
      if (col === 'left') {
        update({ columnLeft: { groups: targetGroups } });
      } else {
        update({ columnRight: { groups: targetGroups } });
      }
    }
  };

  const handleDeleteItem = (groupId: string, itemId: string, col: 'left' | 'right') => {
    const targetGroups = col === 'left' ? [...recipe.columnLeft.groups] : [...recipe.columnRight.groups];
    const group = targetGroups.find(g => g.id === groupId);
    if (group) {
      group.items = group.items.filter(i => i.id !== itemId);
      if (col === 'left') {
        update({ columnLeft: { groups: targetGroups } });
      } else {
        update({ columnRight: { groups: targetGroups } });
      }
    }
  };

  // Zubereitung helpers
  const handleAddStep = () => {
    if (recipe.steps.length >= 12) return;
    const newNum = recipe.steps.length + 1;
    const newSteps = [
      ...recipe.steps,
      {
        id: `step-${Date.now()}`,
        stepNumber: newNum,
        title: `SCHRITT ${newNum}`,
        text: 'Handlung präzise beschreiben.',
      },
    ];

    // Auto adjust master variant to smallest fitting
    let newVariant = recipe.masterVariant;
    if (newSteps.length > 10) newVariant = 12;
    else if (newSteps.length > 8) newVariant = 10;
    else if (newSteps.length > 6) newVariant = 8;
    else newVariant = 6;

    update({ steps: newSteps, masterVariant: newVariant });
  };

  const handleDeleteStep = (id: string) => {
    const remaining = recipe.steps.filter(s => s.id !== id);
    const renumbered = remaining.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));

    let newVariant: MasterVariant = 6;
    if (renumbered.length <= 6) newVariant = 6;
    else if (renumbered.length <= 8) newVariant = 8;
    else if (renumbered.length <= 10) newVariant = 10;
    else newVariant = 12;

    update({ steps: renumbered, masterVariant: newVariant });
  };

  const totalLeft = recipe.columnLeft.groups.reduce((acc, g) => acc + g.items.length, 0);
  const totalRight = recipe.columnRight.groups.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div className="bg-[#1e1b18] text-[#e8ded5] border border-[#3a322a] rounded-2xl p-4 flex flex-col h-full shadow-xl">
      {/* Editor Subtabs */}
      <div className="flex items-center gap-1.5 border-b border-[#342d25] pb-3 mb-4 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('basis')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
            activeTab === 'basis'
              ? 'bg-[#c46637] text-white font-medium shadow-sm'
              : 'text-[#9c8e82] hover:text-[#f5eee6] hover:bg-[#2b251f]'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          Titel & Tags
        </button>

        <button
          onClick={() => setActiveTab('blick')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
            activeTab === 'blick'
              ? 'bg-[#c46637] text-white font-medium shadow-sm'
              : 'text-[#9c8e82] hover:text-[#f5eee6] hover:bg-[#2b251f]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Auf einen Blick
        </button>

        <button
          onClick={() => setActiveTab('zutaten')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
            activeTab === 'zutaten'
              ? 'bg-[#c46637] text-white font-medium shadow-sm'
              : 'text-[#9c8e82] hover:text-[#f5eee6] hover:bg-[#2b251f]'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          Zutaten ({totalLeft + totalRight})
        </button>

        <button
          onClick={() => setActiveTab('schritte')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
            activeTab === 'schritte'
              ? 'bg-[#c46637] text-white font-medium shadow-sm'
              : 'text-[#9c8e82] hover:text-[#f5eee6] hover:bg-[#2b251f]'
          }`}
        >
          <ChefHat className="w-3.5 h-3.5" />
          Zubereitung ({recipe.steps.length})
        </button>

        <button
          onClick={() => setActiveTab('naehrwerte')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
            activeTab === 'naehrwerte'
              ? 'bg-[#c46637] text-white font-medium shadow-sm'
              : 'text-[#9c8e82] hover:text-[#f5eee6] hover:bg-[#2b251f]'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          Nährwerte & Tipp
        </button>

        <button
          onClick={() => setActiveTab('foto')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
            activeTab === 'foto'
              ? 'bg-[#c46637] text-white font-medium shadow-sm'
              : 'text-[#9c8e82] hover:text-[#f5eee6] hover:bg-[#2b251f]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Food-Foto (1:1)
        </button>
      </div>

      {/* Tab 1: Basis (Titel, Saison, Kategorie, 4 Tags) */}
      {activeTab === 'basis' && (
        <div className="space-y-4 text-xs overflow-y-auto pr-1">
          <div>
            <label className="block text-[#a09083] font-semibold uppercase tracking-wider mb-1.5">
              Rezepttitel (Editorial Headline):
            </label>
            <input
              type="text"
              value={recipe.title}
              onChange={e => update({ title: e.target.value.toUpperCase() })}
              placeholder="Z.B. CHICKEN GYROS PITA BOWL"
              className="w-full bg-[#151311] border border-[#3b332b] focus:border-[#c46637] rounded-xl px-3.5 py-2 text-[#f5eee6] font-semibold text-sm font-editorial-serif tracking-wider outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#a09083] font-semibold uppercase tracking-wider mb-1.5">
                Jahreszeit (§4):
              </label>
              <select
                value={recipe.season}
                onChange={e => update({ season: e.target.value as Season })}
                className="w-full bg-[#151311] border border-[#3b332b] focus:border-[#c46637] rounded-xl px-3 py-2 text-[#eae2d8] outline-hidden"
              >
                {SEASONS.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#a09083] font-semibold uppercase tracking-wider mb-1.5">
                Kategorie (§4):
              </label>
              <select
                value={recipe.category}
                onChange={e => update({ category: e.target.value as Category })}
                className="w-full bg-[#151311] border border-[#3b332b] focus:border-[#c46637] rounded-xl px-3 py-2 text-[#eae2d8] outline-hidden"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4 Tags */}
          <div className="bg-[#24201c] p-3.5 rounded-xl border border-[#362e26] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[#c46637] font-semibold uppercase tracking-wider">
                Exakt 4 Tags (§5):
              </label>
              <span className="text-[10px] text-[#8e8074]">Alle 4 Pflichtfelder</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {recipe.tags.map((tag, idx) => (
                <div key={idx}>
                  <input
                    type="text"
                    value={tag}
                    onChange={e => handleTagChange(idx, e.target.value)}
                    placeholder={`TAG ${idx + 1}`}
                    className="w-full bg-[#151311] border border-[#3d342c] focus:border-[#c46637] rounded-lg px-2.5 py-1.5 text-center text-xs font-semibold uppercase tracking-wider text-[#f5eee6] outline-hidden"
                  />
                </div>
              ))}
            </div>

            {/* Quick tag chips */}
            <div>
              <span className="text-[10px] text-[#8e8074] block mb-1.5">
                Schnellauswahl gängiger Kochbuch-Tags:
              </span>
              <div className="flex flex-wrap gap-1">
                {COMMON_TAGS.map(t => (
                  <button
                    key={t}
                    onClick={() => handleAddQuickTag(t)}
                    className="px-2 py-0.5 rounded-md bg-[#1d1917] hover:bg-[#342b23] border border-[#3b322a] text-[10px] text-[#cfc0b2] uppercase tracking-wider transition-colors"
                  >
                    + {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Auf einen Blick */}
      {activeTab === 'blick' && (
        <div className="space-y-3.5 text-xs overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#a09083] font-semibold uppercase tracking-wider mb-1">
                Portionen:
              </label>
              <input
                type="text"
                value={recipe.quickFacts.portions}
                onChange={e =>
                  update({
                    quickFacts: { ...recipe.quickFacts, portions: e.target.value },
                  })
                }
                placeholder="z.B. 4 Portionen"
                className="w-full bg-[#151311] border border-[#3b332b] rounded-xl px-3 py-2 text-[#f5eee6] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[#a09083] font-semibold uppercase tracking-wider mb-1">
                Gesamtzeit (Min):
              </label>
              <input
                type="number"
                value={recipe.quickFacts.totalTimeMin}
                onChange={e =>
                  update({
                    quickFacts: {
                      ...recipe.quickFacts,
                      totalTimeMin: Number(e.target.value) || 0,
                    },
                  })
                }
                className="w-full bg-[#151311] border border-[#3b332b] rounded-xl px-3 py-2 text-[#f5eee6] outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#a09083] font-semibold uppercase tracking-wider mb-1">
                Aktivzeit (Min):
              </label>
              <input
                type="number"
                value={recipe.quickFacts.activeTimeMin}
                onChange={e =>
                  update({
                    quickFacts: {
                      ...recipe.quickFacts,
                      activeTimeMin: Number(e.target.value) || 0,
                    },
                  })
                }
                className="w-full bg-[#151311] border border-[#3b332b] rounded-xl px-3 py-2 text-[#f5eee6] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[#a09083] font-semibold uppercase tracking-wider mb-1">
                Passivzeit (Min):
              </label>
              <input
                type="number"
                value={recipe.quickFacts.passiveTimeMin}
                onChange={e =>
                  update({
                    quickFacts: {
                      ...recipe.quickFacts,
                      passiveTimeMin: Number(e.target.value) || 0,
                    },
                  })
                }
                className="w-full bg-[#151311] border border-[#3b332b] rounded-xl px-3 py-2 text-[#f5eee6] outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#a09083] font-semibold uppercase tracking-wider mb-1">
              Benötigte Utensilien:
            </label>
            <input
              type="text"
              value={recipe.quickFacts.utensils}
              onChange={e =>
                update({
                  quickFacts: { ...recipe.quickFacts, utensils: e.target.value },
                })
              }
              placeholder="z.B. Airfryer (oder Pfanne), Schüssel, Schneidebrett"
              className="w-full bg-[#151311] border border-[#3b332b] rounded-xl px-3 py-2 text-[#f5eee6] outline-hidden"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Zutaten (Zweispaltig strukturiert) */}
      {activeTab === 'zutaten' && (
        <div className="space-y-4 text-xs overflow-y-auto pr-1">
          {/* Column balance indicator */}
          <div className="bg-[#24201c] p-2.5 rounded-xl border border-[#362e26] flex items-center justify-between">
            <span className="text-[11px] text-[#9c8e82]">
              Spalten-Balance: <strong className="text-[#f5eee6]">{totalLeft} links</strong> /{' '}
              <strong className="text-[#f5eee6]">{totalRight} rechts</strong>
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-md ${
                Math.abs(totalLeft - totalRight) <= 2
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {Math.abs(totalLeft - totalRight) <= 2
                ? 'Ausgewogen (Konform)'
                : 'Ungleichgewicht prüfen'}
            </span>
          </div>

          {/* Left & Right columns editor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-3 bg-[#191614] p-3 rounded-xl border border-[#342c24]">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#2d261f]">
                <span className="font-bold text-[#c46637] uppercase tracking-wider text-[11px]">
                  Linke Spalte ({totalLeft})
                </span>
                <button
                  onClick={() => handleAddGroup('left')}
                  className="text-[10px] text-[#c46637] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Gruppe
                </button>
              </div>

              {recipe.columnLeft.groups.map(group => (
                <div key={group.id} className="bg-[#211d19] p-2.5 rounded-lg border border-[#342b23] space-y-2">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={group.header}
                      onChange={e => {
                        const groups = [...recipe.columnLeft.groups];
                        const g = groups.find(x => x.id === group.id);
                        if (g) g.header = e.target.value.toUpperCase();
                        update({ columnLeft: { groups } });
                      }}
                      className="flex-1 bg-[#141210] border border-[#3b322a] rounded px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#d97d4f]"
                    />
                    <button
                      onClick={() => handleMoveGroup(group.id, 'left')}
                      title="Gruppe nach rechts verschieben"
                      className="p-1 hover:bg-[#322921] rounded text-[#8e8074] hover:text-[#f5eee6]"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Group items */}
                  <div className="space-y-1">
                    {group.items.map(item => (
                      <div key={item.id} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={item.amount || ''}
                          onChange={e => {
                            item.amount = e.target.value;
                            update({ columnLeft: { groups: [...recipe.columnLeft.groups] } });
                          }}
                          placeholder="Menge"
                          className="w-16 bg-[#161311] border border-[#332a22] rounded px-1.5 py-0.5 text-[10.5px] text-[#baa99b]"
                        />
                        <input
                          type="text"
                          value={item.name}
                          onChange={e => {
                            item.name = e.target.value;
                            update({ columnLeft: { groups: [...recipe.columnLeft.groups] } });
                          }}
                          placeholder="Zutat"
                          className="flex-1 bg-[#161311] border border-[#332a22] rounded px-2 py-0.5 text-[11px] text-[#f5eee6]"
                        />
                        <button
                          onClick={() => handleDeleteItem(group.id, item.id, 'left')}
                          className="text-stone-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddItemToGroup(group.id, 'left')}
                    className="text-[10px] text-[#8e8074] hover:text-[#d97d4f] flex items-center gap-1 pt-0.5"
                  >
                    <Plus className="w-2.5 h-2.5" /> Zutat hinzufügen
                  </button>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-3 bg-[#191614] p-3 rounded-xl border border-[#342c24]">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#2d261f]">
                <span className="font-bold text-[#c46637] uppercase tracking-wider text-[11px]">
                  Rechte Spalte ({totalRight})
                </span>
                <button
                  onClick={() => handleAddGroup('right')}
                  className="text-[10px] text-[#c46637] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Gruppe
                </button>
              </div>

              {recipe.columnRight.groups.map(group => (
                <div key={group.id} className="bg-[#211d19] p-2.5 rounded-lg border border-[#342b23] space-y-2">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={group.header}
                      onChange={e => {
                        const groups = [...recipe.columnRight.groups];
                        const g = groups.find(x => x.id === group.id);
                        if (g) g.header = e.target.value.toUpperCase();
                        update({ columnRight: { groups } });
                      }}
                      className="flex-1 bg-[#141210] border border-[#3b322a] rounded px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#d97d4f]"
                    />
                    <button
                      onClick={() => handleMoveGroup(group.id, 'right')}
                      title="Gruppe nach links verschieben"
                      className="p-1 hover:bg-[#322921] rounded text-[#8e8074] hover:text-[#f5eee6]"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Group items */}
                  <div className="space-y-1">
                    {group.items.map(item => (
                      <div key={item.id} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={item.amount || ''}
                          onChange={e => {
                            item.amount = e.target.value;
                            update({ columnRight: { groups: [...recipe.columnRight.groups] } });
                          }}
                          placeholder="Menge"
                          className="w-16 bg-[#161311] border border-[#332a22] rounded px-1.5 py-0.5 text-[10.5px] text-[#baa99b]"
                        />
                        <input
                          type="text"
                          value={item.name}
                          onChange={e => {
                            item.name = e.target.value;
                            update({ columnRight: { groups: [...recipe.columnRight.groups] } });
                          }}
                          placeholder="Zutat"
                          className="flex-1 bg-[#161311] border border-[#332a22] rounded px-2 py-0.5 text-[11px] text-[#f5eee6]"
                        />
                        <button
                          onClick={() => handleDeleteItem(group.id, item.id, 'right')}
                          className="text-stone-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddItemToGroup(group.id, 'right')}
                    className="text-[10px] text-[#8e8074] hover:text-[#d97d4f] flex items-center gap-1 pt-0.5"
                  >
                    <Plus className="w-2.5 h-2.5" /> Zutat hinzufügen
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Zubereitung (6, 8, 10, 12 Schritte) */}
      {activeTab === 'schritte' && (
        <div className="space-y-3.5 text-xs overflow-y-auto pr-1">
          {/* Master Variant Switcher */}
          <div className="bg-[#24201c] p-3 rounded-xl border border-[#362e26] flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#f5eee6] block text-xs">
                Masterlayout-Variante (§8):
              </span>
              <span className="text-[10px] text-[#8e8074]">
                Immer die kleinste Variante wählen, in die das Rezept sinnvoll passt.
              </span>
            </div>

            <div className="flex gap-1.5">
              {[6, 8, 10, 12].map(v => (
                <button
                  key={v}
                  onClick={() => update({ masterVariant: v as MasterVariant })}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    recipe.masterVariant === v
                      ? 'bg-[#c46637] text-white shadow-sm'
                      : 'bg-[#1a1715] text-[#9c8e82] hover:text-[#f5eee6] border border-[#332a22]'
                  }`}
                >
                  {v}er
                </button>
              ))}
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-2.5">
            {recipe.steps.map(step => (
              <div
                key={step.id}
                className="bg-[#211d19] p-3 rounded-xl border border-[#342b23] space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-6 h-6 rounded bg-[#2b241e] text-[#c46637] font-bold text-xs flex items-center justify-center shrink-0">
                      {String(step.stepNumber).padStart(2, '0')}
                    </span>
                    <input
                      type="text"
                      value={step.title}
                      onChange={e => {
                        step.title = e.target.value.toUpperCase();
                        update({ steps: [...recipe.steps] });
                      }}
                      placeholder="KURZER TITEL IN VERSALIEN"
                      className="flex-1 bg-[#141210] border border-[#382f27] rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#f5eee6]"
                    />
                  </div>

                  <button
                    onClick={() => handleDeleteStep(step.id)}
                    className="text-stone-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={step.text}
                    onChange={e => {
                      step.text = e.target.value;
                      update({ steps: [...recipe.steps] });
                    }}
                    placeholder="Präziser Handlungstext..."
                    className="w-full bg-[#141210] border border-[#382f27] rounded-lg p-2 text-xs text-[#ded3c8] leading-relaxed outline-hidden"
                  />
                  <div className="flex justify-between text-[9.5px] text-[#786c62] mt-0.5">
                    <span>Handlung kurz und präzise halten</span>
                    <span className={step.text.length > 200 ? 'text-amber-400 font-semibold' : ''}>
                      {step.text.length} / 220 Zeichen
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {recipe.steps.length < 12 && (
            <button
              onClick={handleAddStep}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#44382e] hover:border-[#c46637] text-xs font-semibold text-[#a89789] hover:text-[#d97d4f] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Schritt {recipe.steps.length + 1} hinzufügen (max. 12)
            </button>
          )}
        </div>
      )}

      {/* Tab 5: Nährwerte & Hinweise */}
      {activeTab === 'naehrwerte' && (
        <div className="space-y-4 text-xs overflow-y-auto pr-1">
          <div className="bg-[#24201c] p-3.5 rounded-xl border border-[#362e26] space-y-3">
            <span className="font-bold text-[#c46637] uppercase tracking-wider text-xs block">
              Nährwerte pro Portion (§10):
            </span>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[10.5px] text-[#8e8074] block mb-1">Kalorien (kcal):</label>
                <input
                  type="number"
                  value={recipe.nutrition.calories}
                  onChange={e =>
                    update({
                      nutrition: {
                        ...recipe.nutrition,
                        calories: Number(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-[#151311] border border-[#3d342c] rounded-lg px-2.5 py-1.5 text-center font-bold text-[#f5eee6]"
                />
              </div>

              <div>
                <label className="text-[10.5px] text-[#8e8074] block mb-1">Kohlenhydrate (g):</label>
                <input
                  type="number"
                  value={recipe.nutrition.carbs}
                  onChange={e =>
                    update({
                      nutrition: {
                        ...recipe.nutrition,
                        carbs: Number(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-[#151311] border border-[#3d342c] rounded-lg px-2.5 py-1.5 text-center font-bold text-[#f5eee6]"
                />
              </div>

              <div>
                <label className="text-[10.5px] text-[#8e8074] block mb-1">Proteine (g):</label>
                <input
                  type="number"
                  value={recipe.nutrition.protein}
                  onChange={e =>
                    update({
                      nutrition: {
                        ...recipe.nutrition,
                        protein: Number(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-[#151311] border border-[#3d342c] rounded-lg px-2.5 py-1.5 text-center font-bold text-[#f5eee6]"
                />
              </div>

              <div>
                <label className="text-[10.5px] text-[#8e8074] block mb-1">Fette (g):</label>
                <input
                  type="number"
                  value={recipe.nutrition.fat}
                  onChange={e =>
                    update({
                      nutrition: {
                        ...recipe.nutrition,
                        fat: Number(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-[#151311] border border-[#3d342c] rounded-lg px-2.5 py-1.5 text-center font-bold text-[#f5eee6]"
                />
              </div>
            </div>
          </div>

          {/* Achte auf (§11) */}
          <div className="bg-[#24201c] p-3.5 rounded-xl border border-[#362e26] space-y-2">
            <label className="font-bold text-[#c46637] uppercase tracking-wider text-xs block">
              „Achte auf“ (Kritischer Praxishinweis, §11):
            </label>
            <textarea
              rows={3}
              value={recipe.watchOutTip}
              onChange={e => update({ watchOutTip: e.target.value })}
              placeholder="z.B. Airfryer variieren. 2–3 Min früher prüfen; Hähnchen auf ca. 74 °C Kerntemperatur garen."
              className="w-full bg-[#151311] border border-[#3d342c] rounded-lg p-2.5 text-xs text-[#ded3c8] leading-relaxed outline-hidden"
            />
            <span className="text-[10px] text-[#8e8074] block">
              Nur ein wirklich relevanter Hinweis (Gargrad, Kerntemperatur, Konsistenz, Airfryer-Tipp). Keine allgemeinen Küchentipps.
            </span>
          </div>

          {/* Quelle (§12) */}
          <div>
            <label className="block text-[#a09083] font-semibold uppercase tracking-wider mb-1">
              Quelle (optional, §12):
            </label>
            <input
              type="text"
              value={recipe.source || ''}
              onChange={e => update({ source: e.target.value })}
              placeholder="z.B. Adaptiert nach Originalrezept „Rezepte durchs Jahr“"
              className="w-full bg-[#151311] border border-[#3b332b] rounded-xl px-3 py-2 text-[#f5eee6] outline-hidden"
            />
          </div>
        </div>
      )}

      {/* Tab 6: Food-Foto (1:1 Quadratisch) */}
      {activeTab === 'foto' && (
        <div className="space-y-4 text-xs overflow-y-auto pr-1">
          <div className="flex gap-4 items-start">
            <div className="w-28 h-28 rounded-xl overflow-hidden bg-black/40 border border-[#44382e] shrink-0">
              {recipe.photoUrl ? (
                <img
                  src={recipe.photoUrl}
                  alt={recipe.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-600">
                  Kein Foto
                </div>
              )}
            </div>

            <div className="space-y-1.5 flex-1">
              <span className="font-bold text-[#f5eee6] block text-xs">
                Food-Foto Richtlinien (§13 & §14):
              </span>
              <ul className="text-[10.5px] text-[#9e8f83] space-y-0.5 list-disc list-inside">
                <li>Exakt 1:1 quadratisches Format</li>
                <li>Ausschließlich das fertige Gericht</li>
                <li>Kein Text, keine Titel, keine Wasserzeichen im Bild</li>
                <li>Zutaten im Bild müssen mit Rezept übereinstimmen</li>
              </ul>
            </div>
          </div>

          <div>
            <label className="block text-[#a09083] font-semibold uppercase tracking-wider mb-1">
              Bild-URL oder lokaler Asset-Pfad:
            </label>
            <input
              type="text"
              value={recipe.photoUrl}
              onChange={e => update({ photoUrl: e.target.value })}
              className="w-full bg-[#151311] border border-[#3b332b] rounded-xl px-3 py-2 text-[#f5eee6] font-mono text-[11px] outline-hidden"
            />
          </div>

          <div>
            <span className="text-[#a09083] font-semibold uppercase tracking-wider block mb-2">
              Verfügbare Vorlagenfotos aus „Rezepte durchs Jahr“:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_PHOTOS.map(p => (
                <button
                  key={p.url}
                  onClick={() => update({ photoUrl: p.url, photoAlt: p.name })}
                  className={`p-1.5 rounded-lg border text-left transition-colors ${
                    recipe.photoUrl === p.url
                      ? 'border-[#c46637] bg-[#31261f]'
                      : 'border-[#382f27] bg-[#1a1715] hover:border-[#4d3f34]'
                  }`}
                >
                  <div className="aspect-square rounded overflow-hidden mb-1 bg-black/30">
                    <img
                      src={p.url}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[10px] text-[#ded3c8] truncate">{p.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
