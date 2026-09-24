import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Plus,
  Trophy,
  Flame,
  Heart,
  TrendingUp,
  Sparkles,
  Trash2,
  Calendar,
  X
} from 'lucide-react';
import { EvidenceEntry } from '../../types';
import { GlowCard } from '../ui/GlowCard';
import { SPRINGS } from '../../styles/tokens';

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
    { id: 'win', label: 'Victories', icon: Trophy },
    { id: 'courage', label: 'Courage', icon: Flame },
    { id: 'resilience', label: 'Resilience', icon: TrendingUp },
    { id: 'kindness', label: 'Feedback', icon: Heart },
    { id: 'growth', label: 'Growth', icon: Sparkles },
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
          classes: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
        };
      case 'courage':
        return {
          label: 'Courage Shown',
          classes: 'bg-orange-500/15 text-orange-300 border-orange-500/25',
        };
      case 'resilience':
        return {
          label: 'Overcame Hurdle',
          classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
        };
      case 'kindness':
        return {
          label: 'Praise / Feedback',
          classes: 'bg-rose-500/15 text-rose-300 border-rose-500/25',
        };
      case 'growth':
        return {
          label: 'Growth Milestone',
          classes: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
        };
      default:
        return {
          label: 'Proof Point',
          classes: 'bg-white/[0.08] text-stone-300 border-white/[0.1]',
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-7">
      {/* 21st.dev Header Banner */}
      <GlowCard glowColor="emerald" className="p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Empirical Self-Trust</span>
              </span>
              <span className="text-xs text-stone-400">The Undeniable Proof Vault</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-white mt-1">
              Evidence Locker
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl leading-relaxed">
              Self-belief isn't positive thinking; it's a stack of undeniable proof that you are
              capable. Deposit genuine wins, courage acts, and setbacks overcome.
            </p>
          </div>

          {/* Quick Actions (Add & Confidence Shot) */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={drawRandomProof}
              className="px-4 py-2 rounded-xl bg-[#141824] hover:bg-[#1c2234] border border-white/[0.09] text-xs font-semibold text-amber-300 flex items-center gap-2 transition-all shadow-sm"
              title="Pull up a random past win to crush immediate doubt"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Confidence Shot</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAdding(!isAdding)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>Deposit Proof</span>
            </motion.button>
          </div>
        </div>
      </GlowCard>

      {/* Confidence Shot Modal */}
      <AnimatePresence>
        {randomProof && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={SPRINGS.snappy}
              className="bg-[#0f121a] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-44 h-44 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold text-amber-400 tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Immediate Proof Recall</span>
                </span>
                <button
                  onClick={() => setRandomProof(null)}
                  className="text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">
                {randomProof.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                "{randomProof.description}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 font-medium">
                  {randomProof.strengthTag}
                </span>
                <span className="text-stone-400">{randomProof.date}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Proof Form Drawer */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={SPRINGS.gentle}
            onSubmit={handleCreateSubmit}
            className="rounded-3xl border border-emerald-500/30 bg-[#0e1117]/90 backdrop-blur-xl p-6 shadow-xl space-y-4 text-xs overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white font-['Outfit'] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Record Capability Proof</span>
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕ Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Title / Headline:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 'Delivered live demo without freezing'"
                  className="w-full bg-[#080a0f] text-white placeholder-stone-500 border border-white/[0.1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Evidence Domain:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EvidenceEntry['category'])}
                  className="w-full bg-[#080a0f] text-white border border-white/[0.1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-400"
                >
                  <option value="win">Victory / Win</option>
                  <option value="courage">Courage Under Fear</option>
                  <option value="resilience">Resilience Through Setback</option>
                  <option value="kindness">Praise / Positive Feedback</option>
                  <option value="growth">Skill & Personal Growth</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">What happened specifically?</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Be concrete. What felt hard, what action did you take, and what was the outcome?"
                className="w-full bg-[#080a0f] text-white placeholder-stone-500 border border-white/[0.1] rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <input
                type="text"
                value={strengthTag}
                onChange={(e) => setStrengthTag(e.target.value)}
                placeholder="Identity tag (e.g. 'Decisiveness', 'Grace under pressure')"
                className="w-1/2 bg-[#080a0f] text-white placeholder-stone-500 border border-white/[0.1] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-400"
              />

              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-stone-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-950/40"
              >
                Deposit to Proof Ledger
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Category Filter Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all select-none ${
                isActive
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-stone-300 hover:text-white bg-[#0e1117] border border-white/[0.06]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Evidence Cards Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvidence.map((entry) => {
          const badge = getCategoryBadge(entry.category);
          return (
            <motion.div
              key={entry.id}
              whileHover={{ y: -3 }}
              transition={SPRINGS.subtleHover}
              className="rounded-3xl border border-white/[0.08] bg-[#0e1117]/80 hover:border-emerald-500/30 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.classes}`}
                  >
                    {badge.label}
                  </span>

                  <div className="flex items-center gap-2 text-stone-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{entry.date}</span>
                    </span>
                    <button
                      onClick={() => onDeleteEvidence(entry.id)}
                      className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-1 transition-opacity"
                      title="Remove entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white font-['Outfit'] mb-1.5">
                  {entry.title}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed mb-3">
                  {entry.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  {entry.strengthTag}
                </span>
                <span className="text-[10px] text-stone-500">Verified Empirical Proof</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
