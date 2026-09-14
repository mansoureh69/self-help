import React, { useState } from 'react';
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
  CheckCircle2,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { LifeQualityPillar } from '../../types';

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
  const highestPillar = sortedPillars[sortedPillars.length - 1];

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
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header Overview */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 mb-6 text-stone-100 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Holistic Equilibrium
              </span>
              <span className="text-xs text-stone-400">Pillar Assessment</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-['Outfit'] mt-1">
              Life Quality Wheel & Diagnostics
            </h1>
            <p className="text-xs md:text-sm text-stone-400 mt-1 max-w-2xl">
              High self-belief is fueled by sustained life quality. Balance your foundational domains
              and eliminate energy leaks with targeted micro-interventions.
            </p>
          </div>

          {/* Holistic Quality Gauge */}
          <div className="flex items-center gap-4 bg-stone-800/80 p-4 rounded-2xl border border-stone-700/80">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-stone-700"
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
                <span className="text-sm font-extrabold text-stone-100 font-['Outfit']">
                  {overallQualityPercent}%
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-stone-300">Life Quality Index</p>
              <p className="text-[11px] text-stone-400">
                Growth Area:{' '}
                <span className="text-amber-300 font-semibold">{lowestPillar.name}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Pillar Sliders and Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Pillar Sliders */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-100 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Assess Your Current State (1 - 10)</span>
            </h2>
            <span className="text-xs text-stone-400">Drag to calibrate</span>
          </div>

          <div className="space-y-4">
            {pillars.map((pillar) => {
              const Icon = getPillarIcon(pillar.iconName);
              const isSelected = selectedPillar.id === pillar.id;

              return (
                <div
                  key={pillar.id}
                  onClick={() => setSelectedPillarId(pillar.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-stone-800 border-amber-500/80 shadow-sm ring-1 ring-amber-500/30'
                      : 'bg-stone-800/40 border-stone-800 hover:bg-stone-800/70 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950'
                            : 'bg-stone-700/80 text-stone-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-100 block">
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
                      className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep-Dive Plan & AI Boost */}
        <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-800 border border-stone-700 text-stone-300 font-medium">
                Pillar Deep Dive
              </span>
              <span className="text-xs font-bold text-amber-400">
                Score: {selectedPillar.score}/10
              </span>
            </div>

            <h3 className="text-lg font-bold font-['Outfit'] text-stone-100 mb-1">
              {selectedPillar.name}
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed mb-4">
              {selectedPillar.description}
            </p>

            {/* If AI Boost Plan is present */}
            {selectedPillar.boostPlan ? (
              <div className="bg-stone-800/70 border border-stone-700/80 rounded-xl p-4 space-y-3.5 text-xs mb-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-700">
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
              <div className="bg-stone-800/40 border border-dashed border-stone-700/80 rounded-xl p-4 text-xs text-stone-400 mb-4">
                <p className="font-medium text-stone-200 mb-1">No Micro-Boost Plan Active</p>
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
                placeholder="e.g., 'Trouble falling asleep before 1 AM', 'Struggling to say no'"
                className="w-full bg-stone-800 text-stone-100 placeholder-stone-400 border border-stone-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 mb-3"
              />
            </div>
          </div>

          <button
            onClick={() => handleGenerateBoost(selectedPillar)}
            disabled={isGenerating === selectedPillar.id}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-950/30"
          >
            {isGenerating === selectedPillar.id ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Designing Custom Protocol...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Micro-Boost with Gemini</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
