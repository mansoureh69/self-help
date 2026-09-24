import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { SPRINGS } from './styles/tokens';

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
    localStorage.setItem('beliefcraft_checkpoints', JSON.stringify(checkpoints));
  }, [checkpoints]);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleUpdatePillarScore = (pillarId: string, newScore: number) => {
    setPillars((prev) =>
      prev.map((p) => (p.id === pillarId ? { ...p, score: newScore } : p))
    );
    showToast('✨ Pillar score calibrated.');
  };

  const handleSaveBoostPlan = (
    pillarId: string,
    plan: NonNullable<LifeQualityPillar['boostPlan']>
  ) => {
    setPillars((prev) =>
      prev.map((p) => (p.id === pillarId ? { ...p, boostPlan: plan } : p))
    );
    showToast('🚀 Custom elevation plan activated!');
  };

  const handleAddEvidence = (entry: Omit<EvidenceEntry, 'id'>) => {
    const newEntry: EvidenceEntry = {
      id: `ev-${Date.now()}`,
      ...entry,
    };
    setEvidence((prev) => [newEntry, ...prev]);
    showToast('🛡️ Undeniable proof deposited in Locker!');
  };

  const handleDeleteEvidence = (id: string) => {
    setEvidence((prev) => prev.filter((e) => e.id !== id));
    showToast('Proof entry removed.');
  };

  const handleAddReframe = (reframe: LimitingBelief) => {
    setReframes((prev) => [reframe, ...prev]);
    showToast('💡 Inner critic distortion dismantled & reframed!');
  };

  const handleToggleAction = (reframeId: string) => {
    setReframes((prev) =>
      prev.map((r) =>
        r.id === reframeId ? { ...r, actionCompleted: !r.actionCompleted } : r
      )
    );
    showToast('🎯 Micro-action status updated!');
  };

  const handleAddCheckpoint = (note: string) => {
    const totalScore = pillars.reduce((sum, p) => sum + p.score, 0);
    const overallScore = Math.round((totalScore / (pillars.length * 10)) * 100);

    const pillarsMap: Record<string, number> = {};
    pillars.forEach((p) => {
      pillarsMap[p.id] = p.score;
    });

    const now = new Date();
    const dateFormatted = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}`;

    const newCheckpoint: LifeQualityCheckpoint = {
      id: `chk-${Date.now()}`,
      date: dateFormatted,
      overallScore,
      pillars: pillarsMap,
      reflectionNote: note,
    };

    setCheckpoints((prev) => [...prev, newCheckpoint]);
    showToast('📈 Milestone checkpoint saved to Growth Trends!');
  };

  const handleToggleRitual = (ritualId: string) => {
    setRituals((prev) =>
      prev.map((r) => {
        if (r.id === ritualId) {
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
    <div className="min-h-screen bg-[#08090a] text-stone-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-amber-400 selection:text-stone-950 ambient-glow-mesh relative">
      {/* Toast Notification with Spring Physics */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={SPRINGS.snappy}
            className="fixed bottom-6 right-6 z-50 bg-[#121622]/95 border border-amber-500/60 text-amber-300 text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-2"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        streakCount={streakCount}
        lifeQualityScore={lifeQualityPercent}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={SPRINGS.gentle}
            >
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
            </motion.div>
          )}

          {activeTab === 'coach' && (
            <motion.div
              key="coach"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={SPRINGS.gentle}
            >
              <CoachChat onSaveInsightToEvidence={handleAddEvidence} />
            </motion.div>
          )}

          {activeTab === 'reframer' && (
            <motion.div
              key="reframer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={SPRINGS.gentle}
            >
              <CognitiveReframer
                reframes={reframes}
                onAddReframe={handleAddReframe}
                onToggleAction={handleToggleAction}
              />
            </motion.div>
          )}

          {activeTab === 'evidence' && (
            <motion.div
              key="evidence"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={SPRINGS.gentle}
            >
              <EvidenceLocker
                evidence={evidence}
                onAddEvidence={handleAddEvidence}
                onDeleteEvidence={handleDeleteEvidence}
              />
            </motion.div>
          )}

          {activeTab === 'life-wheel' && (
            <motion.div
              key="life-wheel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={SPRINGS.gentle}
            >
              <LifeQualityWheel
                pillars={pillars}
                onUpdateScore={handleUpdatePillarScore}
                onSaveBoostPlan={handleSaveBoostPlan}
              />
            </motion.div>
          )}

          {activeTab === 'rituals' && (
            <motion.div
              key="rituals"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={SPRINGS.gentle}
            >
              <DailyAnchorRituals
                rituals={rituals}
                onToggleRitual={handleToggleRitual}
                onAddRitual={handleAddRitual}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 21st.dev Footer */}
      <footer className="border-t border-white/[0.06] py-7 text-center text-xs text-stone-500 bg-[#08090a]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-stone-400">
            BeliefCraft 2.0 • Grounded Self-Belief & Holistic Life Quality
          </span>
          <span className="text-stone-500">
            21st.dev Motion Design System • GSAP & Framer Motion v12
          </span>
        </div>
      </footer>
    </div>
  );
}
