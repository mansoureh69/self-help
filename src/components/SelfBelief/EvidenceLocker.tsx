import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Trophy,
  Flame,
  Heart,
  TrendingUp,
  Shuffle,
  Tag,
  Trash2,
  CheckCircle,
  Calendar,
  Sparkles
} from 'lucide-react';
import { EvidenceEntry } from '../../types';

interface EvidenceLockerProps {
  evidence: EvidenceEntry[];
  onAddEvidence: (entry: Omit<EvidenceEntry, 'id'>) => void;
  onDeleteEvidence: (id: string) => void;
}

export const EvidenceLocker: React.FC<EvidenceLockerProps> = ({
  evidence,
  onAddEvidence,
  onDeleteEvidence,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [randomProof, setRandomProof] = useState<EvidenceEntry | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EvidenceEntry['category']>('win');
  const [description, setDescription] = useState('');
  const [strengthTag, setStrengthTag] = useState('');

  const categories = [
    { id: 'all', label: 'All Proof', icon: ShieldCheck },
    { id: 'win', label: 'Small & Big Wins', icon: Trophy },
    { id: 'courage', label: 'Courage Moments', icon: Flame },
    { id: 'resilience', label: 'Resilience / Setbacks', icon: TrendingUp },
    { id: 'kindness', label: 'Positive Feedback', icon: Heart },
    { id: 'growth', label: 'Personal Growth', icon: Sparkles },
  ];

  const filteredEvidence =
    selectedCategory === 'all'
      ? evidence
      : evidence.filter((item) => item.category === selectedCategory);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onAddEvidence({
      title,
      category,
      description,
      date: 'Today',
      strengthTag: strengthTag.trim() || 'Resilience & Competence',
    });

    setTitle('');
    setDescription('');
    setStrengthTag('');
    setIsAdding(false);
  };

  const drawRandomProof = () => {
    if (evidence.length === 0) return;
    const randomIndex = Math.floor(Math.random() * evidence.length);
    setRandomProof(evidence[randomIndex]);
  };

  const getCategoryBadge = (cat: EvidenceEntry['category']) => {
    switch (cat) {
      case 'win':
        return {
          label: 'Victory / Win',
          classes: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
        };
      case 'courage':
        return {
          label: 'Courage Shown',
          classes: 'bg-orange-950/60 text-orange-300 border-orange-800/60',
        };
      case 'resilience':
        return {
          label: 'Hardship Survived',
          classes: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
        };
      case 'kindness':
        return {
          label: 'Praise / Impact',
          classes: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
        };
      case 'growth':
      default:
        return {
          label: 'Personal Growth',
          classes: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 mb-6 text-stone-100 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                The Undeniable Proof Ledger
              </span>
              <span className="text-xs text-stone-400">Grounding Reality</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-['Outfit'] mt-1">
              Self-Belief Evidence Locker
            </h1>
            <p className="text-xs md:text-sm text-stone-400 mt-1 max-w-2xl">
              Imposter syndrome thrives on amnesia of your past triumphs. Keep an undeniable record of
              hurdles you survived, fears you faced, and small daily victories.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={drawRandomProof}
              id="random-proof-btn"
              disabled={evidence.length === 0}
              className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700/80 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-stone-700 transition-all disabled:opacity-40"
              title="Draw a random past victory when doubt strikes"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Confidence Shot</span>
            </button>

            <button
              onClick={() => setIsAdding(!isAdding)}
              id="add-evidence-btn"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-950/30"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Log New Proof</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spontaneous Confidence Shot Modal/Banner */}
      {randomProof && (
        <div className="bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 border-2 border-amber-500/70 rounded-2xl p-5 mb-6 text-stone-100 shadow-xl relative animate-in fade-in zoom-in duration-200">
          <button
            onClick={() => setRandomProof(null)}
            className="absolute top-3 right-3 text-stone-400 hover:text-stone-100 text-xs font-bold p-1"
          >
            ✕ Dismiss
          </button>

          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Reminder of Your Capability</span>
          </div>

          <h3 className="text-lg font-bold text-stone-100 font-['Outfit'] mb-1">
            "{randomProof.title}"
          </h3>
          <p className="text-sm text-stone-300 leading-relaxed mb-3">
            {randomProof.description}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold">
              Strength: {randomProof.strengthTag}
            </span>
            <span className="text-xs text-stone-400">Recorded: {randomProof.date}</span>
          </div>
        </div>
      )}

      {/* Add New Evidence Form */}
      {isAdding && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 mb-8 shadow-xl">
          <h2 className="text-base font-bold text-stone-100 mb-1 flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Log Indisputable Proof of Competence or Courage</span>
          </h2>
          <p className="text-xs text-stone-400 mb-4">
            No win is too small. Even taking a 10-minute break or sending an awkward email counts.
          </p>

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  What did you accomplish or overcome?
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., 'Spoke up in the boardroom despite racing heartbeat'"
                  className="w-full bg-stone-800 text-stone-100 placeholder-stone-400 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EvidenceEntry['category'])}
                  className="w-full bg-stone-800 text-stone-100 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="win">Small & Big Win</option>
                  <option value="courage">Faced a Fear / Courage</option>
                  <option value="resilience">Hardship / Setback Survived</option>
                  <option value="kindness">Praise / Impact on Others</option>
                  <option value="growth">Personal Growth & Skill</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Context & Reflection (Why does this prove your strength?):
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail what happened and what internal barrier you overcame..."
                className="w-full bg-stone-800 text-stone-100 placeholder-stone-400 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Strength Demonstrated (e.g. 'Integrity', 'Composure', 'Fast Learner'):
              </label>
              <input
                type="text"
                value={strengthTag}
                onChange={(e) => setStrengthTag(e.target.value)}
                placeholder="e.g., 'Courage Under Pressure'"
                className="w-full bg-stone-800 text-stone-100 placeholder-stone-400 border border-stone-700 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-medium hover:bg-stone-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md shadow-amber-950/30"
              >
                Save to Evidence Locker
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-stone-100 border border-stone-700/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Evidence Cards Grid */}
      {filteredEvidence.length === 0 ? (
        <div className="bg-stone-900 border border-dashed border-stone-800 rounded-2xl p-10 text-center text-stone-400">
          <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-stone-600" />
          <p className="text-sm font-semibold text-stone-200">No proof entries in this category yet</p>
          <p className="text-xs mt-1 max-w-sm mx-auto">
            Click "Log New Proof" above to deposit evidence of your capability into your vault.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvidence.map((item) => {
            const badge = getCategoryBadge(item.category);
            return (
              <div
                key={item.id}
                className="bg-stone-900 border border-stone-800 rounded-2xl p-5 flex flex-col justify-between hover:border-stone-700 transition-all shadow-md group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badge.classes}`}
                    >
                      {badge.label}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                      <button
                        onClick={() => onDeleteEvidence(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-stone-500 hover:text-rose-400 p-1 transition-opacity"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-stone-100 font-['Outfit'] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed line-clamp-4">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-amber-300 font-medium">
                    <Tag className="w-3 h-3 text-amber-400" />
                    <span>{item.strengthTag}</span>
                  </div>
                  <CheckCircle className="w-4 h-4 text-emerald-400/80" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
