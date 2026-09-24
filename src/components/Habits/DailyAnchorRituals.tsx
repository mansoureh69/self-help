import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Circle,
  Flame,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Wind,
  ShieldCheck,
  Award
} from 'lucide-react';
import { DailyRitual } from '../../types';
import { GlowCard } from '../ui/GlowCard';
import { SPRINGS } from '../../styles/tokens';

interface DailyAnchorRitualsProps {
  rituals: DailyRitual[];
  onToggleRitual: (id: string) => void;
  onAddRitual: (title: string, category: DailyRitual['category']) => void;
}

export const DailyAnchorRituals: React.FC<DailyAnchorRitualsProps> = ({
  rituals,
  onToggleRitual,
  onAddRitual,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DailyRitual['category']>('belief');
  const [isAdding, setIsAdding] = useState(false);

  // 4-7-8 Breathing State
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (breathingActive) {
      interval = setInterval(() => {
        setPhaseSecondsLeft((prev) => {
          if (prev > 1) {
            return prev - 1;
          }

          // Switch phases
          if (breathPhase === 'inhale') {
            setBreathPhase('hold');
            return 7;
          } else if (breathPhase === 'hold') {
            setBreathPhase('exhale');
            return 8;
          } else {
            setBreathPhase('inhale');
            setCyclesCompleted((c) => c + 1);
            return 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathingActive, breathPhase]);

  const toggleBreathing = () => {
    setBreathingActive(!breathingActive);
  };

  const resetBreathing = () => {
    setBreathingActive(false);
    setBreathPhase('inhale');
    setPhaseSecondsLeft(4);
    setCyclesCompleted(0);
  };

  const handleCreateRitual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddRitual(newTitle.trim(), newCategory);
    setNewTitle('');
    setIsAdding(false);
  };

  const completedCount = rituals.filter((r) => r.completedToday).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-7">
      {/* 21st.dev Header Banner */}
      <GlowCard glowColor="amber" className="p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>1% Atomic Consistency</span>
              </span>
              <span className="text-xs text-stone-400">Daily Anchors Protocol</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-white mt-1">
              Daily Anchors & Somatic Reset
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl leading-relaxed">
              Confidence is built through kept promises to yourself. Complete your foundational
              micro-actions and reset your autonomic nervous system with guided vagal breathing.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#131722] px-4 py-3 rounded-2xl border border-white/[0.08]">
            <Award className="w-6 h-6 text-amber-400" />
            <div>
              <p className="text-[11px] text-stone-400 font-medium">Today's Progress</p>
              <p className="text-sm font-bold text-white font-['Outfit']">
                {completedCount} of {rituals.length} Anchors
              </p>
            </div>
          </div>
        </div>
      </GlowCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Daily Habits Checklist */}
        <div className="lg:col-span-7 rounded-3xl border border-white/[0.08] bg-[#0e1117]/80 backdrop-blur-xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Today's Non-Negotiable Anchors</span>
              </h2>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAdding(!isAdding)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Anchor</span>
              </motion.button>
            </div>

            {/* Add Ritual Form */}
            <AnimatePresence>
              {isAdding && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={SPRINGS.gentle}
                  onSubmit={handleCreateRitual}
                  className="bg-[#121622] border border-white/[0.08] p-4 rounded-2xl mb-4 space-y-3 text-xs overflow-hidden"
                >
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. '10 min phone-free walk', 'Write 1 evidence point in locker'"
                    className="w-full bg-[#090b10] text-white placeholder-stone-500 border border-white/[0.1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400"
                  />

                  <div className="flex items-center justify-between">
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as DailyRitual['category'])}
                      className="bg-[#090b10] text-stone-300 border border-white/[0.1] rounded-xl px-3 py-1.5 text-xs"
                    >
                      <option value="belief">Self-Belief / Mindset</option>
                      <option value="focus">Courage / Focus</option>
                      <option value="vitality">Vitality / Energy</option>
                      <option value="gratitude">Gratitude / Reflection</option>
                    </select>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAdding(false)}
                        className="px-3 py-1 text-stone-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="px-4 py-1.5 bg-amber-500 text-stone-950 font-bold rounded-xl"
                      >
                        Save
                      </motion.button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Rituals List */}
            <div className="space-y-3">
              {rituals.map((ritual) => (
                <motion.div
                  key={ritual.id}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onToggleRitual(ritual.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                    ritual.completedToday
                      ? 'bg-emerald-500/[0.08] border-emerald-500/30 text-emerald-200'
                      : 'bg-[#12151e]/80 border-white/[0.06] hover:bg-[#181d2a] text-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="text-stone-400 hover:text-emerald-400 transition-colors"
                    >
                      {ritual.completedToday ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-500" />
                      )}
                    </button>

                    <div>
                      <p
                        className={`text-xs sm:text-sm font-semibold ${
                          ritual.completedToday
                            ? 'line-through text-stone-400'
                            : 'text-stone-100'
                        }`}
                      >
                        {ritual.title}
                      </p>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-medium">
                        {ritual.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0a0d14] border border-white/[0.08] text-[11px] font-bold text-amber-300">
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{ritual.streak}d</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-stone-400 mt-5 pt-3.5 border-t border-white/[0.06] text-center">
            Tip: Consistency trumps intensity. Checking off one micro-anchor maintains your identity.
          </p>
        </div>

        {/* Right Column: Somatic Physiological Reset (4-7-8 Breathing) */}
        <div className="lg:col-span-5 rounded-3xl border border-white/[0.08] bg-[#0e1117]/80 backdrop-blur-xl p-6 shadow-xl flex flex-col justify-between items-center text-center">
          <div className="w-full">
            <div className="flex items-center justify-between mb-4 text-xs">
              <span className="font-semibold text-stone-200 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-sky-400" />
                <span>Vagus Nerve Reset</span>
              </span>
              <span className="text-stone-400">4-7-8 Protocol</span>
            </div>

            <p className="text-xs text-stone-400 mb-6 leading-relaxed">
              When imposter syndrome triggers sympathetic freeze or panic, diaphragmatic breathing activates
              the vagus nerve to restore cognitive calm and self-trust.
            </p>

            {/* Pulsing Visual Sphere with Multi-Phase Chromatic Glows */}
            <div className="relative w-48 h-48 mx-auto my-3 flex items-center justify-center">
              {/* Outer Pulsing Glow */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                  breathingActive
                    ? breathPhase === 'inhale'
                      ? 'scale-110 bg-sky-500/20 ring-4 ring-sky-400/40 shadow-[0_0_32px_rgba(56,189,248,0.3)]'
                      : breathPhase === 'hold'
                      ? 'scale-105 bg-amber-500/20 ring-4 ring-amber-400/40 shadow-[0_0_32px_rgba(245,158,11,0.3)]'
                      : 'scale-95 bg-emerald-500/20 ring-4 ring-emerald-400/40 shadow-[0_0_32px_rgba(16,185,129,0.3)]'
                    : 'scale-90 bg-white/[0.03] ring-1 ring-white/[0.08]'
                }`}
              />

              {/* Core Circle with Instructions */}
              <div className="relative z-10 flex flex-col items-center justify-center w-36 h-36 rounded-full bg-[#080a0f] border border-white/[0.12] shadow-2xl">
                {breathingActive ? (
                  <>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
                      {breathPhase === 'inhale' && 'Inhale'}
                      {breathPhase === 'hold' && 'Hold'}
                      {breathPhase === 'exhale' && 'Slow Exhale'}
                    </span>
                    <span className="text-3xl font-extrabold text-white font-['Outfit'] my-1">
                      {phaseSecondsLeft}s
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Cycles: {cyclesCompleted}
                    </span>
                  </>
                ) : (
                  <>
                    <Wind className="w-6 h-6 text-sky-400 mb-1" />
                    <span className="text-xs font-bold text-white">Start Reset</span>
                    <span className="text-[10px] text-stone-400">3-min Calm</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleBreathing}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                breathingActive
                  ? 'bg-[#181d2a] hover:bg-[#202738] text-stone-200'
                  : 'bg-gradient-to-r from-sky-500 to-sky-400 text-stone-950 shadow-sky-950/40'
              }`}
            >
              {breathingActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Begin Breathing</span>
                </>
              )}
            </motion.button>

            {breathingActive && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={resetBreathing}
                className="p-2.5 rounded-xl bg-[#181d2a] hover:bg-[#202738] text-stone-400 hover:text-white"
                title="Reset breath cycles"
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
