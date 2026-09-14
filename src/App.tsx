import React, { useState, useEffect } from 'react';
import { Navigation, TabType } from './components/Navigation';
import { OverviewHome } from './components/Dashboard/OverviewHome';
import { CoachChat } from './components/Chat/CoachChat';
import { CognitiveReframer } from './components/SelfBelief/CognitiveReframer';
import { EvidenceLocker } from './components/SelfBelief/EvidenceLocker';
import { LifeQualityWheel } from './components/LifeQuality/LifeQualityWheel';
import { DailyAnchorRituals } from './components/Habits/DailyAnchorRituals';
import {
  INITIAL_PILLARS,
  INITIAL_EVIDENCE,
  INITIAL_REFRAMES,
  INITIAL_RITUALS,
  INITIAL_CHECKPOINTS,
  COACH_PERSONAS,
} from './data/initialData';
import { CoachPersona, DailyRitual, EvidenceEntry, LimitingBelief, LifeQualityPillar, LifeQualityCheckpoint } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Pillars State
  const [pillars, setPillars] = useState<LifeQualityPillar[]>(() => {
    const saved = localStorage.getItem('beliefcraft_pillars');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse pillars', e);
      }
    }
    return INITIAL_PILLARS;
  });

  // Checkpoints State for Growth Trends
  const [checkpoints, setCheckpoints] = useState<LifeQualityCheckpoint[]>(() => {
    const saved = localStorage.getItem('beliefcraft_checkpoints');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse checkpoints', e);
      }
    }
    return INITIAL_CHECKPOINTS;
  });

  // Evidence Ledger State
  const [evidence, setEvidence] = useState<EvidenceEntry[]>(() => {
    const saved = localStorage.getItem('beliefcraft_evidence');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse evidence', e);
      }
    }
    return INITIAL_EVIDENCE;
  });

  // Reframes State
  const [reframes, setReframes] = useState<LimitingBelief[]>(() => {
    const saved = localStorage.getItem('beliefcraft_reframes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse reframes', e);
      }
    }
    return INITIAL_REFRAMES;
  });

  // Daily Rituals State
  const [rituals, setRituals] = useState<DailyRitual[]>(() => {
    const saved = localStorage.getItem('beliefcraft_rituals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse rituals', e);
      }
    }
    return INITIAL_RITUALS;
  });

  // Streak state
  const [streakCount, setStreakCount] = useState<number>(() => {
    const saved = localStorage.getItem('beliefcraft_streak');
    return saved ? Number(saved) : 5;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('beliefcraft_pillars', JSON.stringify(pillars));
  }, [pillars]);

  useEffect(() => {
    localStorage.setItem('beliefcraft_evidence', JSON.stringify(evidence));
  }, [evidence]);

  useEffect(() => {
    localStorage.setItem('beliefcraft_reframes', JSON.stringify(reframes));
  }, [reframes]);

  useEffect(() => {
    localStorage.setItem('beliefcraft_rituals', JSON.stringify(rituals));
  }, [rituals]);

  useEffect(() => {
    localStorage.setItem('beliefcraft_streak', String(streakCount));
  }, [streakCount]);

  useEffect(() => {
    localStorage.setItem('beliefcraft_checkpoints', JSON.stringify(checkpoints));
  }, [checkpoints]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleAddCheckpoint = (note: string) => {
    const currentTotal = pillars.reduce((sum, p) => sum + p.score, 0);
    const currentOverall = Math.round((currentTotal / (pillars.length * 10)) * 100);
    const pillarsMap: Record<string, number> = {};
    pillars.forEach((p) => {
      pillarsMap[p.id] = p.score;
    });

    const newCheckpoint: LifeQualityCheckpoint = {
      id: `chk-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      overallScore: currentOverall,
      pillars: pillarsMap,
      reflectionNote: note,
    };

    setCheckpoints((prev) => [...prev, newCheckpoint]);
    showToast('📈 Milestone checkpoint saved to Growth Trends!');
  };

  const handleAddEvidence = (entry: Omit<EvidenceEntry, 'id'>) => {
    const newEntry: EvidenceEntry = {
      ...entry,
      id: `ev-${Date.now()}`,
    };
    setEvidence((prev) => [newEntry, ...prev]);
    showToast('✨ New capability proof deposited in your Evidence Locker!');
  };

  const handleDeleteEvidence = (id: string) => {
    setEvidence((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddReframe = (reframe: LimitingBelief) => {
    setReframes((prev) => [reframe, ...prev]);
    showToast('🛡️ Limiting thought reframed into grounded self-belief!');
  };

  const handleToggleAction = (id: string) => {
    setReframes((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, actionCompleted: !r.actionCompleted } : r
      )
    );
    showToast('⭐ Micro-action step updated!');
  };

  const handleUpdatePillarScore = (pillarId: string, newScore: number) => {
    setPillars((prev) =>
      prev.map((p) => (p.id === pillarId ? { ...p, score: newScore } : p))
    );
  };

  const handleSaveBoostPlan = (
    pillarId: string,
    plan: NonNullable<LifeQualityPillar['boostPlan']>
  ) => {
    setPillars((prev) =>
      prev.map((p) => (p.id === pillarId ? { ...p, boostPlan: plan } : p))
    );
    showToast('🚀 Custom elevation plan ready for this life domain!');
  };

  const handleToggleRitual = (id: string) => {
    setRituals((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextCompleted = !r.completedToday;
          return {
            ...r,
            completedToday: nextCompleted,
            streak: nextCompleted ? r.streak + 1 : Math.max(0, r.streak - 1),
          };
        }
        return r;
      })
    );
  };

  const handleAddRitual = (title: string, category: DailyRitual['category']) => {
    const newRitual: DailyRitual = {
      id: `rit-${Date.now()}`,
      title,
      category,
      streak: 1,
      completedToday: false,
    };
    setRituals((prev) => [...prev, newRitual]);
    showToast('🌱 Daily anchor ritual established!');
  };

  const handleSelectCoachPersona = (persona: CoachPersona) => {
    setActiveTab('coach');
  };

  // Calculate overall life quality index (0 - 100)
  const totalScore = pillars.reduce((sum, p) => sum + p.score, 0);
  const lifeQualityPercent = Math.round((totalScore / (pillars.length * 10)) * 100);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-amber-500 selection:text-stone-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 border-2 border-amber-500/80 text-amber-300 text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        streakCount={streakCount}
        lifeQualityScore={lifeQualityPercent}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'overview' && (
          <OverviewHome
            onNavigate={setActiveTab}
            onSelectCoachPersona={handleSelectCoachPersona}
            pillars={pillars}
            evidence={evidence}
            reframes={reframes}
            rituals={rituals}
            streakCount={streakCount}
            checkpoints={checkpoints}
            onAddCheckpoint={handleAddCheckpoint}
          />
        )}

        {activeTab === 'coach' && (
          <CoachChat onSaveInsightToEvidence={handleAddEvidence} />
        )}

        {activeTab === 'reframer' && (
          <CognitiveReframer
            reframes={reframes}
            onAddReframe={handleAddReframe}
            onToggleAction={handleToggleAction}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceLocker
            evidence={evidence}
            onAddEvidence={handleAddEvidence}
            onDeleteEvidence={handleDeleteEvidence}
          />
        )}

        {activeTab === 'life-wheel' && (
          <LifeQualityWheel
            pillars={pillars}
            onUpdateScore={handleUpdatePillarScore}
            onSaveBoostPlan={handleSaveBoostPlan}
          />
        )}

        {activeTab === 'rituals' && (
          <DailyAnchorRituals
            rituals={rituals}
            onToggleRitual={handleToggleRitual}
            onAddRitual={handleAddRitual}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 py-6 text-center text-xs text-stone-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BeliefCraft • Grounded Self-Belief & Holistic Life Quality</span>
          <span>Crafted with Gemini 3.8 Flash • CBT & Growth Mindset</span>
        </div>
      </footer>
    </div>
  );
}
