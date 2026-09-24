import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Activity,
  Compass,
  Heart,
  CloudSun,
  SunMedium,
  Sparkles,
  Zap,
  TrendingUp,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { LifeQualityPillar } from '../../types';
import { GlowCard } from '../ui/GlowCard';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { SPRINGS } from '../../styles/tokens';

interface LifeQualityWheelProps {
  pillars: LifeQualityPillar[];
  onUpdateScore: (pillarId: string, newScore: number) => void;
  onSaveBoostPlan: (pillarId: string, plan: NonNullable<LifeQualityPillar['boostPlan']>) => void;
}

export const LifeQualityWheel: React.FC<LifeQualityWheelProps> = ({
  pillars,
  onUpdateScore,
  onSaveBoostPlan,
}) => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>(pillars[0].id);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [challengeText, setChallengeText] = useState('');

  const selectedPillar = pillars.find((p) => p.id === selectedPillarId) || pillars[0];

  // Calculate overall life quality score (0 - 100)
  const totalScore = pillars.reduce((sum, p) => sum + p.score, 0);
  const overallQualityPercent = Math.round((totalScore / (pillars.length * 10)) * 100);

  // Lowest and highest pillars
  const sortedPillars = [...pillars].sort((a, b) => a.score - b.score);
  const lowestPillar = sortedPillars[0];

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Activity':
        return Activity;
      case 'Compass':
        return Compass;
      case 'Heart':
        return Heart;
      case 'CloudSun':
        return CloudSun;
      case 'SunMedium':
        return SunMedium;
      default:
        return Sparkles;
    }
  };

  const handleGenerateBoost = async (pillar: LifeQualityPillar) => {
    setIsGenerating(pillar.id);
    try {
      const res = await fetch('/api/pillar-boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pillarName: pillar.name,
          currentScore: pillar.score,
          challenge: challengeText.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate boost plan');
      const data = await res.json();
      onSaveBoostPlan(pillar.id, data.result);
      setChallengeText('');
    } catch (err) {
      console.error('Boost plan error:', err);
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-7">
      {/* 21st.dev Header Overview */}
      <GlowCard glowColor="amber" className="p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/25 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                <span>Holistic Equilibrium</span>
              </span>
              <span className="text-xs text-stone-400">Pillar Assessment</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-white mt-1">
              Life Quality Wheel & Diagnostics
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl leading-relaxed">
              High self-belief is fueled by sustained life quality. Calibrate your foundational domains
              and eliminate energy leaks with targeted micro-interventions.
            </p>
          </div>

          {/* Holistic Quality Circular Gauge */}
          <div className="flex items-center gap-4 bg-[#121622] p-4 rounded-3xl border border-white/[0.08] shadow-inner">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-stone-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-400 transition-all duration-500"
                  strokeDasharray={`${overallQualityPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <AnimatedCounter
                  value={overallQualityPercent}
                  suffix="%"
                  className="text-sm font-extrabold text-white font-['Outfit']"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-stone-200">Equilibrium Index</p>
              <p className="text-[11px] text-stone-400">
                Growth Focus:{' '}
                <span className="text-amber-300 font-semibold">{lowestPillar.name}</span>
              </p>
            </div>
          </div>
        </div>
      </GlowCard>

      {/* Main Grid: Pillar Sliders and Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Pillar Sliders */}
        <div className="lg:col-span-7 rounded-3xl border border-white/[0.08] bg-[#0e1117]/80 backdrop-blur-xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Assess Your Current State (1 - 10)</span>
            </h2>
            <span className="text-xs text-stone-400">Drag to calibrate</span>
          </div>

          <div className="space-y-3.5">
            {pillars.map((pillar) => {
              const Icon = getPillarIcon(pillar.iconName);
              const isSelected = selectedPillar.id === pillar.id;

              return (
                <div
                  key={pillar.id}
                  onClick={() => setSelectedPillarId(pillar.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#181d2a] border-amber-500/60 shadow-lg shadow-amber-950/20'
                      : 'bg-[#11141c]/60 border-white/[0.05] hover:bg-[#141824]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 shadow-sm'
                            : 'bg-white/[0.06] text-stone-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {pillar.name}
                        </span>
                        <span className="text-[10px] text-stone-400 line-clamp-1">
                          {pillar.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 font-['Outfit'] font-bold text-sm text-amber-300">
                      <span>{pillar.score}</span>
                      <span className="text-[10px] text-stone-500 font-normal">/10</span>
                    </div>
                  </div>

                  {/* Slider Control */}
                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={pillar.score}
                      onChange={(e) => onUpdateScore(pillar.id, Number(e.target.value))}
                      className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep-Dive Plan & AI Boost */}
        <div className="lg:col-span-5 rounded-3xl border border-white/[0.08] bg-[#0e1117]/80 backdrop-blur-xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#131722] border border-white/[0.08] text-stone-300 font-medium">
                Domain Blueprint
              </span>
              <span className="text-xs font-bold text-amber-400">
                Score: {selectedPillar.score}/10
              </span>
            </div>

            <h3 className="text-lg font-bold font-['Outfit'] text-white mb-1">
              {selectedPillar.name}
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed mb-4">
              {selectedPillar.description}
            </p>

            {/* If AI Boost Plan is present */}
            {selectedPillar.boostPlan ? (
              <div className="bg-[#121622] border border-white/[0.08] rounded-2xl p-4 space-y-3 text-xs mb-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>AI Elevation Protocol</span>
                  </span>
                  <button
                    onClick={() => handleGenerateBoost(selectedPillar)}
                    className="text-[10px] text-stone-400 hover:text-amber-300"
                  >
                    Regenerate
                  </button>
                </div>

                <div>
                  <p className="font-semibold text-emerald-400 flex items-center gap-1 mb-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Quick 2-Minute Win:
                  </p>
                  <p className="text-stone-300 pl-4">{selectedPillar.boostPlan.quickWin}</p>
                </div>

                <div>
                  <p className="font-semibold text-amber-400 flex items-center gap-1 mb-0.5">
                    <Zap className="w-3 h-3" /> Daily Anchor Habit:
                  </p>
                  <p className="text-stone-300 pl-4">{selectedPillar.boostPlan.dailyRitual}</p>
                </div>

                <div>
                  <p className="font-semibold text-blue-400 flex items-center gap-1 mb-0.5">
                    <Compass className="w-3 h-3" /> Mindset Shift:
                  </p>
                  <p className="text-stone-300 pl-4">{selectedPillar.boostPlan.mindsetShift}</p>
                </div>

                <div>
                  <p className="font-semibold text-stone-400 mb-0.5">Journal Prompt:</p>
                  <p className="text-stone-300 italic pl-4">
                    "{selectedPillar.boostPlan.reflectionPrompt}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white/[0.02] border border-dashed border-white/[0.08] rounded-2xl p-4 text-xs text-stone-400 mb-4">
                <p className="font-medium text-stone-200 mb-1">No Custom Protocol Active</p>
                <p>
                  Generate an AI-powered, low-friction action plan to elevate your score in{' '}
                  <span className="text-amber-300 font-semibold">{selectedPillar.name}</span>.
                </p>
              </div>
            )}

            {/* Input for specific barrier */}
            <div>
              <label className="block text-[11px] font-medium text-stone-400 mb-1">
                Specific obstacle or barrier in this area (optional):
              </label>
              <input
                type="text"
                value={challengeText}
                onChange={(e) => setChallengeText(e.target.value)}
                placeholder="e.g. 'Difficulty winding down before sleep', 'Saying yes to too many projects'"
                className="w-full bg-[#080a0f] text-white placeholder-stone-500 border border-white/[0.1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400 mb-3"
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleGenerateBoost(selectedPillar)}
            disabled={isGenerating === selectedPillar.id}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-stone-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-950/40"
          >
            {isGenerating === selectedPillar.id ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Designing Protocol with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Micro-Boost with Gemini</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
