import React from 'react';
import {
  LayoutDashboard,
  BotMessageSquare,
  ShieldCheck,
  Sparkles,
  PieChart,
  CheckCircle2,
  Flame
} from 'lucide-react';

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
    { id: 'coach' as TabType, label: 'AI Mindset Coach', icon: BotMessageSquare, badge: 'Gemini' },
    { id: 'reframer' as TabType, label: 'Cognitive Reframer', icon: Sparkles },
    { id: 'evidence' as TabType, label: 'Evidence Locker', icon: ShieldCheck },
    { id: 'life-wheel' as TabType, label: 'Life Quality Wheel', icon: PieChart },
    { id: 'rituals' as TabType, label: 'Daily Anchors', icon: CheckCircle2 },
  ];

  return (
    <header className="sticky top-0 z-30 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onSelectTab('overview')}
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-amber-900/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-stone-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-stone-100 font-['Outfit']">
                Belief<span className="text-amber-400">Craft</span>
              </span>
              <p className="text-[11px] text-stone-400 font-medium tracking-wide uppercase">
                Life Quality & Self-Belief
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-btn-${tab.id}`}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-stone-800 text-amber-300 shadow-sm'
                      : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Vitals Badges */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800 border border-stone-700/80 text-xs font-medium text-amber-300"
              title="Consecutive Days of Active Growth"
              id="streak-badge"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{streakCount}d streak</span>
            </div>

            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-xs font-medium text-emerald-300"
              title="Overall Life Quality Score (out of 100)"
              id="life-quality-badge"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LQ: {lifeQualityScore}%</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 scrollbar-none border-t border-stone-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-stone-800 text-amber-400 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
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
