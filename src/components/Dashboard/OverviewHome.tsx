import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Flame,
  PieChart,
  BotMessageSquare,
  ArrowRight,
  Quote,
  CheckCircle2,
  Brain,
  Compass,
  Trophy,
  Zap,
  Target
} from 'lucide-react';
import { TabType } from '../Navigation';
import { CoachPersona, DailyRitual, EvidenceEntry, LimitingBelief, LifeQualityPillar, LifeQualityCheckpoint } from '../../types';
import { COACH_PERSONAS, DAILY_WISDOM_QUOTES } from '../../data/initialData';
import { GrowthTrendsChart } from './GrowthTrendsChart';

interface OverviewHomeProps {
  onNavigate: (tab: TabType) => void;
  onSelectCoachPersona: (persona: CoachPersona) => void;
  pillars: LifeQualityPillar[];
  evidence: EvidenceEntry[];
  reframes: LimitingBelief[];
  rituals: DailyRitual[];
  streakCount: number;
  checkpoints: LifeQualityCheckpoint[];
  onAddCheckpoint: (note: string) => void;
}

export const OverviewHome: React.FC<OverviewHomeProps> = ({
  onNavigate,
  onSelectCoachPersona,
  pillars,
  evidence,
  reframes,
  rituals,
  streakCount,
  checkpoints,
  onAddCheckpoint,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const totalScore = pillars.reduce((sum, p) => sum + p.score, 0);
  const lifeQualityPercent = Math.round((totalScore / (pillars.length * 10)) * 100);

  const completedRituals = rituals.filter((r) => r.completedToday).length;

  const currentQuote = DAILY_WISDOM_QUOTES[quoteIndex % DAILY_WISDOM_QUOTES.length];

  const handleStartCoach = (persona: CoachPersona) => {
    onSelectCoachPersona(persona);
    onNavigate('coach');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Daily Mindset Anchor Quote Card */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-stone-800 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Quote className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
              Daily Anchor for Self-Belief
            </span>
          </div>

          <button
            onClick={() => setQuoteIndex((prev) => prev + 1)}
            className="text-xs text-stone-400 hover:text-amber-300 transition-colors"
          >
            Next Insight →
          </button>
        </div>

        <p className="text-base sm:text-xl font-medium font-['Outfit'] text-stone-100 italic leading-relaxed max-w-3xl">
          "{currentQuote.quote}"
        </p>
        <p className="text-xs text-stone-400 mt-2 font-semibold tracking-wide">
          — {currentQuote.author}
        </p>
      </div>

      {/* 4 Core Vital Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Life Quality Index */}
        <div
          onClick={() => onNavigate('life-wheel')}
          className="bg-stone-900 border border-stone-800 hover:border-stone-700 p-5 rounded-2xl cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-stone-400 font-medium">Life Quality</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-['Outfit'] text-stone-100">
            {lifeQualityPercent}%
          </div>
          <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <span>6 foundational domains</span>
            <ArrowRight className="w-3 h-3 text-stone-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </p>
        </div>

        {/* Stat 2: Undeniable Proof Logged */}
        <div
          onClick={() => onNavigate('evidence')}
          className="bg-stone-900 border border-stone-800 hover:border-stone-700 p-5 rounded-2xl cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-stone-400 font-medium">Proof Vault</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-['Outfit'] text-stone-100">
            {evidence.length}
          </div>
          <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <span>Real wins & courage logged</span>
            <ArrowRight className="w-3 h-3 text-stone-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
          </p>
        </div>

        {/* Stat 3: Inner Critic Reframes */}
        <div
          onClick={() => onNavigate('reframer')}
          className="bg-stone-900 border border-stone-800 hover:border-stone-700 p-5 rounded-2xl cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-stone-400 font-medium">Reframed Beliefs</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-['Outfit'] text-stone-100">
            {reframes.length}
          </div>
          <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <span>Traps dismantled with CBT</span>
            <ArrowRight className="w-3 h-3 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
          </p>
        </div>

        {/* Stat 4: Consistency Streak */}
        <div
          onClick={() => onNavigate('rituals')}
          className="bg-stone-900 border border-stone-800 hover:border-stone-700 p-5 rounded-2xl cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-stone-400 font-medium">Daily Streak</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-['Outfit'] text-stone-100">
            {streakCount} Days
          </div>
          <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <span>{completedRituals}/{rituals.length} anchors done today</span>
            <ArrowRight className="w-3 h-3 text-stone-500 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all" />
          </p>
        </div>
      </div>

      {/* Growth Trends Recharts Dashboard */}
      <GrowthTrendsChart
        pillars={pillars}
        checkpoints={checkpoints}
        onAddCheckpoint={onAddCheckpoint}
      />

      {/* Quick Launchpad: Mindset Mentors & Cognitive Reframer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Meet Your AI Coaches */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-stone-100 font-['Outfit'] flex items-center gap-2">
                  <BotMessageSquare className="w-5 h-5 text-amber-400" />
                  <span>Your Dedicated Gemini Mindset Mentors</span>
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Multi-turn personalized guidance to reprogram self-doubt and enhance your life balance.
                </p>
              </div>

              <button
                onClick={() => onNavigate('coach')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Open Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COACH_PERSONAS.map((coach) => (
                <div
                  key={coach.id}
                  onClick={() => handleStartCoach(coach)}
                  className="bg-stone-800/50 hover:bg-stone-800 border border-stone-700/60 hover:border-amber-500/60 p-3.5 rounded-xl cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                      {coach.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-700/80 text-stone-300 font-medium">
                      {coach.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                    {coach.tagline}
                  </p>
                  <span className="text-[11px] text-amber-400 font-semibold mt-2 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Consult Coach</span> →
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
            <span>Powered by Gemini 3.8 Flash</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Ready to converse
            </span>
          </div>
        </div>

        {/* Right 5 Columns: Quick Reframer & Today's Rituals */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Limiting Thought Prompt Card */}
          <div className="bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-900 border border-amber-900/40 rounded-2xl p-5 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Spontaneous Reframe
              </span>
            </div>
            <h3 className="text-sm font-bold text-stone-100 font-['Outfit'] mb-1">
              Dismantle Inner Critic Traps
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Turn cognitive distortions (imposter syndrome, catastrophizing) into grounded self-trust.
            </p>

            <button
              onClick={() => onNavigate('reframer')}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-950/30"
            >
              <span>Reframe a Limiting Thought Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Today's Anchors Preview */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Today's Anchors ({completedRituals}/{rituals.length})</span>
              </h3>
              <button
                onClick={() => onNavigate('rituals')}
                className="text-[11px] text-amber-400 hover:text-amber-300"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {rituals.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-stone-800/40 border border-stone-800 text-stone-300"
                >
                  <span className={`truncate mr-2 ${r.completedToday ? 'line-through text-stone-500' : ''}`}>
                    {r.title}
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold whitespace-nowrap">
                    {r.streak}d streak
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
