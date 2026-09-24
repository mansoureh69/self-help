import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ShieldCheck,
  Flame,
  PieChart,
  BotMessageSquare,
  ArrowRight,
  Quote,
  CheckCircle2,
  Compass,
  Zap,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { TabType } from '../Navigation';
import { CoachPersona, DailyRitual, EvidenceEntry, LimitingBelief, LifeQualityPillar, LifeQualityCheckpoint } from '../../types';
import { COACH_PERSONAS, DAILY_WISDOM_QUOTES } from '../../data/initialData';
import { GrowthTrendsChart } from './GrowthTrendsChart';
import { GlowCard } from '../ui/GlowCard';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { CONTAINER_VARIANTS, ITEM_VARIANTS, SPRINGS } from '../../styles/tokens';

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
    <motion.div
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto px-4 py-8 space-y-7"
    >
      {/* 21st.dev Ambient Hero Quote Card */}
      <motion.div variants={ITEM_VARIANTS}>
        <GlowCard
          glowColor="amber"
          className="p-6 sm:p-8 bg-gradient-to-br from-[#12161f] via-[#0d1017] to-[#15120d] border border-white/[0.09] overflow-hidden"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between gap-4 mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/20">
                <Quote className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] uppercase font-bold tracking-widest text-amber-400">
                Core Mindset Anchor
              </span>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setQuoteIndex((prev) => prev + 1)}
              className="text-xs text-stone-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1"
            >
              <span>Next Catalyst</span>
              <span>→</span>
            </motion.button>
          </div>

          <p className="text-base sm:text-xl font-medium font-['Outfit'] text-white italic leading-relaxed max-w-3xl relative z-10">
            "{currentQuote.quote}"
          </p>
          <p className="text-xs text-stone-400 mt-3 font-semibold tracking-wide relative z-10">
            — {currentQuote.author}
          </p>
        </GlowCard>
      </motion.div>

      {/* 4 Core KPI Bento Cards with GSAP Animated Counters */}
      <motion.div variants={ITEM_VARIANTS} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Life Quality */}
        <GlowCard
          glowColor="amber"
          onClick={() => onNavigate('life-wheel')}
          className="p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-stone-400 font-medium">Life Quality</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white flex items-baseline gap-1">
            <AnimatedCounter value={lifeQualityPercent} suffix="%" />
          </div>
          <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <span>6 core domains</span>
            <ArrowRight className="w-3 h-3 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </p>
        </GlowCard>

        {/* KPI 2: Evidence Proof Vault */}
        <GlowCard
          glowColor="emerald"
          onClick={() => onNavigate('evidence')}
          className="p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-stone-400 font-medium">Proof Vault</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white flex items-baseline gap-1">
            <AnimatedCounter value={evidence.length} />
          </div>
          <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <span>Wins & proofs logged</span>
            <ArrowRight className="w-3 h-3 text-stone-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </p>
        </GlowCard>

        {/* KPI 3: Inner Critic Reframes */}
        <GlowCard
          glowColor="indigo"
          onClick={() => onNavigate('reframer')}
          className="p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-stone-400 font-medium">Reframes</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white flex items-baseline gap-1">
            <AnimatedCounter value={reframes.length} />
          </div>
          <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <span>CBT shifts executed</span>
            <ArrowRight className="w-3 h-3 text-stone-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </p>
        </GlowCard>

        {/* KPI 4: Consistency Streak */}
        <GlowCard
          glowColor="amber"
          onClick={() => onNavigate('rituals')}
          className="p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-stone-400 font-medium">Daily Streak</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4 fill-amber-400/20" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white flex items-baseline gap-1">
            <AnimatedCounter value={streakCount} suffix="d" />
          </div>
          <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <span>{completedRituals}/{rituals.length} anchors today</span>
            <ArrowRight className="w-3 h-3 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </p>
        </GlowCard>
      </motion.div>

      {/* Upgraded Growth Trends Recharts Dashboard */}
      <motion.div variants={ITEM_VARIANTS}>
        <GrowthTrendsChart
          pillars={pillars}
          checkpoints={checkpoints}
          onAddCheckpoint={onAddCheckpoint}
        />
      </motion.div>

      {/* Bento Bottom Row: AI Coaches & Quick Reframe Action */}
      <motion.div variants={ITEM_VARIANTS} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: AI Mindset Mentors Bento */}
        <GlowCard glowColor="none" className="lg:col-span-7 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                  <BotMessageSquare className="w-4 h-4 text-amber-400" />
                  <span>AI Mindset Mentors</span>
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Multi-turn guidance powered by Gemini 3.8 Flash to dismantle doubt.
                </p>
              </div>

              <motion.button
                whileHover={{ x: 2 }}
                onClick={() => onNavigate('coach')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Enter Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COACH_PERSONAS.map((coach) => (
                <motion.div
                  key={coach.id}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartCoach(coach)}
                  className="bg-[#12161f]/70 hover:bg-[#161c28] border border-white/[0.06] hover:border-amber-500/40 p-3.5 rounded-2xl cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-stone-200 group-hover:text-amber-300 transition-colors">
                      {coach.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-stone-300 font-medium">
                      {coach.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                    {coach.tagline}
                  </p>
                  <span className="text-[11px] text-amber-400 font-semibold mt-2.5 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Consult Mentor</span> →
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-stone-500" />
              <span>Gemini 3.8 Flash Active</span>
            </span>
            <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Dialogue</span>
            </span>
          </div>
        </GlowCard>

        {/* Right 5 Columns: Spontaneous Reframe & Today's Anchors */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Reframe Card */}
          <GlowCard
            glowColor="amber"
            className="p-5 bg-gradient-to-br from-[#1a140d]/80 via-[#10131a] to-[#0c0d10] border border-amber-500/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Spontaneous Reframe
              </span>
            </div>
            <h3 className="text-sm font-bold text-white font-['Outfit'] mb-1">
              Dismantle Inner Critic Traps
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Turn cognitive distortions (imposter syndrome, catastrophizing) into grounded self-trust.
            </p>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('reframer')}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-950/40"
            >
              <span>Reframe a Thought Now</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </GlowCard>

          {/* Today's Anchors Preview */}
          <GlowCard glowColor="none" className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Today's Anchors ({completedRituals}/{rituals.length})</span>
              </h3>
              <button
                onClick={() => onNavigate('rituals')}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {rituals.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-stone-300"
                >
                  <span className={`truncate mr-2 ${r.completedToday ? 'line-through text-stone-500' : 'text-stone-200'}`}>
                    {r.title}
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold whitespace-nowrap bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    {r.streak}d
                  </span>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>
      </motion.div>
    </motion.div>
  );
};
