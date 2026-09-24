import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  BotMessageSquare,
  ShieldCheck,
  Sparkles,
  PieChart,
  CheckCircle2,
  Flame,
  Activity
} from 'lucide-react';
import { AnimatedCounter } from './ui/AnimatedCounter';
import { SPRINGS } from '../styles/tokens';

export type TabType = 'overview' | 'coach' | 'reframer' | 'evidence' | 'life-wheel' | 'rituals';

interface NavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  streakCount: number;
  lifeQualityScore: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  streakCount,
  lifeQualityScore,
}) => {
  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'coach' as TabType, label: 'Mindset Coach', icon: BotMessageSquare, badge: 'AI' },
    { id: 'reframer' as TabType, label: 'Reframer', icon: Sparkles },
    { id: 'evidence' as TabType, label: 'Evidence Locker', icon: ShieldCheck },
    { id: 'life-wheel' as TabType, label: 'Life Wheel', icon: PieChart },
    { id: 'rituals' as TabType, label: 'Daily Anchors', icon: CheckCircle2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#08090a]/80 backdrop-blur-2xl border-b border-white/[0.07] text-stone-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => onSelectTab('overview')}
            id="brand-logo"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-emerald-400 p-[1px] shadow-lg shadow-amber-950/20">
              <div className="w-full h-full bg-[#0d1017] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-white font-['Outfit'] flex items-center gap-1">
                Belief<span className="text-amber-400">Craft</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-sans font-semibold ml-1">
                  2.0
                </span>
              </span>
              <p className="text-[10px] text-stone-400 font-medium tracking-wide uppercase">
                Life Quality & Self-Belief
              </p>
            </div>
          </motion.div>

          {/* Desktop Floating Pill Navigation */}
          <nav
            className="hidden md:flex items-center bg-[#10131a]/90 p-1.5 rounded-2xl border border-white/[0.08] shadow-inner"
            aria-label="Main Navigation"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-btn-${tab.id}`}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 select-none ${
                    isActive ? 'text-stone-950' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {/* Morphing Active Pill Background */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      transition={SPRINGS.snappy}
                      className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl shadow-md shadow-amber-500/25"
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                          isActive
                            ? 'bg-stone-950/20 text-stone-950'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Vital Badges (Streak & Live Quality Score with Animated Counters) */}
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#12161f] border border-amber-500/20 text-xs font-semibold text-amber-300 shadow-sm"
              title="Consecutive Days of Empirical Growth"
              id="streak-badge"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <AnimatedCounter value={streakCount} suffix="d" />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.04 }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0d1815] border border-emerald-500/25 text-xs font-semibold text-emerald-300 shadow-sm"
              title="Overall Life Quality Equilibrium Index"
              id="life-quality-badge"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>LQ:</span>
              <AnimatedCounter value={lifeQualityScore} suffix="%" className="font-bold text-white" />
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation Scroll */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1.5 scrollbar-none border-t border-white/[0.06]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors select-none ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-300 hover:text-white bg-[#10131a] border border-white/[0.06]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
