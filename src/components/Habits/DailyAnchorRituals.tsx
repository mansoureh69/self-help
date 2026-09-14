import React, { useState, useEffect } from 'react';
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
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 mb-6 text-stone-100 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                1% Atomic Consistency
              </span>
              <span className="text-xs text-stone-400">Daily Anchors</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-['Outfit'] mt-1">
              Daily Anchors & Habit Protocol
            </h1>
            <p className="text-xs md:text-sm text-stone-400 mt-1 max-w-2xl">
              Confidence is built through kept promises to yourself. Complete your foundational
              micro-actions and reset your autonomic nervous system with guided breathing.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-stone-800/80 px-4 py-3 rounded-2xl border border-stone-700/80">
            <Award className="w-6 h-6 text-amber-400" />
            <div>
              <p className="text-xs text-stone-400 font-medium">Today's Progress</p>
              <p className="text-sm font-bold text-stone-100">
                {completedCount} of {rituals.length} Anchors
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Daily Habits Checklist */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-stone-100 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Today's Non-Negotiable Rituals</span>
              </h2>

              <button
                onClick={() => setIsAdding(!isAdding)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ritual</span>
              </button>
            </div>

            {/* Add Ritual Inline Form */}
            {isAdding && (
              <form
                onSubmit={handleCreateRitual}
                className="bg-stone-800/80 border border-stone-700 p-3.5 rounded-xl mb-4 space-y-2 text-xs"
              >
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., '10 minutes phone-free walk', 'Drink 500ml water'"
                  className="w-full bg-stone-900 text-stone-100 placeholder-stone-400 border border-stone-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />

                <div className="flex items-center justify-between">
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as DailyRitual['category'])}
                    className="bg-stone-900 text-stone-300 border border-stone-700 rounded-lg px-2 py-1.5 text-xs"
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
                      className="px-2.5 py-1 text-stone-400 hover:text-stone-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-amber-500 text-stone-950 font-bold rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Rituals List */}
            <div className="space-y-3">
              {rituals.map((ritual) => (
                <div
                  key={ritual.id}
                  onClick={() => onToggleRitual(ritual.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                    ritual.completedToday
                      ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
                      : 'bg-stone-800/50 border-stone-700/60 hover:bg-stone-800 text-stone-200'
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
                        className={`text-xs font-semibold ${
                          ritual.completedToday
                            ? 'line-through text-stone-400'
                            : 'text-stone-100'
                        }`}
                      >
                        {ritual.title}
                      </p>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                        {ritual.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800/90 border border-stone-700 text-[11px] font-bold text-amber-300">
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{ritual.streak}d</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-stone-400 mt-4 pt-3 border-t border-stone-800 text-center">
            Tip: Consistency trumps intensity. Checking off one micro-anchor maintains your identity.
          </p>
        </div>

        {/* Right Column: Somatic Physiological Reset (4-7-8 Breathing) */}
        <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md flex flex-col justify-between items-center text-center">
          <div className="w-full">
            <div className="flex items-center justify-between mb-4 text-xs">
              <span className="font-semibold text-stone-300 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-sky-400" />
                <span>Somatic Vagus Nerve Reset</span>
              </span>
              <span className="text-stone-400">4-7-8 Protocol</span>
            </div>

            <p className="text-xs text-stone-400 mb-6 leading-relaxed">
              When imposter syndrome triggers sympathetic panic, diaphragmatic breathing activates
              the vagus nerve to restore cognitive calm and self-trust.
            </p>

            {/* Pulsing Visual Sphere */}
            <div className="relative w-44 h-44 mx-auto my-2 flex items-center justify-center">
              {/* Outer Pulsing Glow */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                  breathingActive
                    ? breathPhase === 'inhale'
                      ? 'scale-110 bg-sky-500/20 ring-4 ring-sky-400/40'
                      : breathPhase === 'hold'
                      ? 'scale-105 bg-amber-500/20 ring-4 ring-amber-400/40'
                      : 'scale-95 bg-emerald-500/20 ring-4 ring-emerald-400/40'
                    : 'scale-90 bg-stone-800/60 ring-1 ring-stone-700'
                }`}
              />

              {/* Core Circle with Instructions */}
              <div className="relative z-10 flex flex-col items-center justify-center w-36 h-36 rounded-full bg-stone-950 border border-stone-800 shadow-inner">
                {breathingActive ? (
                  <>
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                      {breathPhase === 'inhale' && 'Inhale'}
                      {breathPhase === 'hold' && 'Hold'}
                      {breathPhase === 'exhale' && 'Slow Exhale'}
                    </span>
                    <span className="text-3xl font-extrabold text-stone-100 font-['Outfit'] my-1">
                      {phaseSecondsLeft}s
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Cycles: {cyclesCompleted}
                    </span>
                  </>
                ) : (
                  <>
                    <Wind className="w-6 h-6 text-sky-400 mb-1" />
                    <span className="text-xs font-bold text-stone-200">Start Reset</span>
                    <span className="text-[10px] text-stone-500">3-min Calm</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={toggleBreathing}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                breathingActive
                  ? 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                  : 'bg-sky-500 hover:bg-sky-400 text-stone-950 shadow-sky-950/30'
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
            </button>

            {breathingActive && (
              <button
                onClick={resetBreathing}
                className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200"
                title="Reset breath cycles"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
