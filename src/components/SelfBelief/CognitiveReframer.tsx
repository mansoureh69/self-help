import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Compass,
  Zap,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { LimitingBelief } from '../../types';
import { GlowCard } from '../ui/GlowCard';
import { SPRINGS } from '../../styles/tokens';

interface CognitiveReframerProps {
  reframes: LimitingBelief[];
  onAddReframe: (reframe: LimitingBelief) => void;
  onToggleAction: (id: string) => void;
}

export const CognitiveReframer: React.FC<CognitiveReframerProps> = ({
  reframes,
  onAddReframe,
  onToggleAction,
}) => {
  const [thoughtInput, setThoughtInput] = useState('');
  const [situationInput, setSituationInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(
    reframes.length > 0 ? reframes[0].id : null
  );

  const sampleThoughts = [
    'I am not qualified to lead this project or share my opinion.',
    'Everyone else is so far ahead of me, I missed my chance.',
    'If I make a mistake, people will realize I don’t know what I am doing.',
    'I keep procrastinating because deep down I know I will fail.'
  ];

  const handleReframeSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!thoughtInput.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/reframe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          limitingThought: thoughtInput,
          situation: situationInput,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to reframe thought.');
      }

      const { result } = await res.json();

      const newReframe: LimitingBelief = {
        id: `ref-${Date.now()}`,
        originalThought: thoughtInput,
        situation: situationInput || undefined,
        identifiedTrap: result.identifiedTrap || 'Cognitive Distortion',
        compassionateValidation:
          result.compassionateValidation ||
          'Your nervous system is trying to protect you from risk or judgment.',
        counterEvidenceQuestions: result.counterEvidenceQuestions || [
          'What facts contradict this extreme assumption?',
          'How would I advise my closest friend facing this exact dilemma?',
        ],
        empoweredReframe:
          result.empoweredReframe ||
          'I am learning as I go. Imperfect progress is how competence is built.',
        microActionStep:
          result.microActionStep || 'Spend 3 minutes writing 1 fact that proves your capability.',
        actionCompleted: false,
        createdAt: 'Just now',
      };

      onAddReframe(newReframe);
      setExpandedId(newReframe.id);
      setThoughtInput('');
      setSituationInput('');
    } catch (err: any) {
      console.error('Reframe error:', err);
      setErrorMsg(err.message || 'Something went wrong during reframing. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">
      {/* 21st.dev Header Banner */}
      <GlowCard glowColor="amber" className="p-6 sm:p-7">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cognitive Restructuring</span>
          </span>
          <span className="text-xs text-stone-400">CBT Distortion Dismantler</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-white mt-1">
          Inner Critic Reframer
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl leading-relaxed">
          Self-doubt is rarely truth—it is usually an archaic threat alarm. Deconstruct cognitive
          traps, ground your nervous system with evidence, and lock in an empowered belief.
        </p>
      </GlowCard>

      {/* Input Terminal Card */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0e1117]/80 backdrop-blur-xl p-6 shadow-xl space-y-5">
        <form onSubmit={handleReframeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>What is your inner critic whispering or shouting?</span>
              <span className="text-amber-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={thoughtInput}
              onChange={(e) => setThoughtInput(e.target.value)}
              placeholder="e.g., 'I am not ready to apply for this role. Everyone will see I am an imposter.'"
              className="w-full bg-[#080a0f] text-white placeholder-stone-500 border border-white/[0.1] rounded-2xl p-4 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-400 mb-1.5">
              Context or Trigger Situation (optional):
            </label>
            <input
              type="text"
              value={situationInput}
              onChange={(e) => setSituationInput(e.target.value)}
              placeholder="e.g., 'Upcoming presentation on Friday', 'Saw a peer's promotion on LinkedIn'"
              className="w-full bg-[#080a0f] text-white placeholder-stone-500 border border-white/[0.1] rounded-2xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Quick Preset Pills */}
          <div>
            <p className="text-[11px] text-stone-400 mb-2 font-medium">
              Or explore common self-limiting patterns:
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleThoughts.map((sample, idx) => (
                <motion.button
                  key={idx}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setThoughtInput(sample)}
                  className="text-[11px] text-stone-300 hover:text-white bg-[#141824] hover:bg-[#1a2030] border border-white/[0.06] hover:border-amber-500/30 rounded-full px-3 py-1 text-left transition-colors"
                >
                  "{sample}"
                </motion.button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isAnalyzing || !thoughtInput.trim()}
              className="py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-stone-950 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-950/40"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dismantling Distortion with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Reframe Thought with Cognitive Science</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>

      {/* History of Reframed Beliefs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Reframed Belief Ledger ({reframes.length})</span>
          </h2>
          <span className="text-xs text-stone-500">Tap to review cognitive blueprint</span>
        </div>

        {reframes.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/[0.1] p-8 text-center text-stone-400 text-xs">
            <p className="font-semibold text-stone-300 mb-1">Your reframe ledger is waiting</p>
            <p>Input any critical voice or self-limiting story above to construct grounded self-trust.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reframes.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/[0.08] bg-[#0e1117]/90 overflow-hidden transition-colors"
                >
                  {/* Summary Bar */}
                  <div
                    className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/25">
                          Trap: {item.identifiedTrap}
                        </span>
                        {item.situation && (
                          <span className="text-[11px] text-stone-400">
                            Context: {item.situation}
                          </span>
                        )}
                        <span className="text-[11px] text-stone-500 ml-auto">
                          {item.createdAt}
                        </span>
                      </div>

                      {/* Original Thought */}
                      <p className="text-xs text-stone-400 line-through decoration-rose-500/60 mb-1">
                        "{item.originalThought}"
                      </p>

                      {/* Empowered Reframe */}
                      <p className="text-sm font-semibold text-amber-300 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span>{item.empoweredReframe}</span>
                      </p>
                    </div>

                    <button
                      className="p-1 text-stone-400 hover:text-white"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Expanded Breakdown with AnimatePresence */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={SPRINGS.gentle}
                        className="px-5 pb-5 pt-2 border-t border-white/[0.06] space-y-4 bg-[#0a0c12]/60 text-xs overflow-hidden"
                      >
                        {/* Compassionate Validation */}
                        <div className="p-3.5 bg-[#121622]/80 rounded-2xl border border-white/[0.06]">
                          <p className="font-semibold text-stone-200 mb-1 flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-blue-400" />
                            <span>Why Your Brain Created This Thought:</span>
                          </p>
                          <p className="text-stone-400 leading-relaxed">
                            {item.compassionateValidation}
                          </p>
                        </div>

                        {/* Counter-Evidence Questions */}
                        <div>
                          <p className="font-semibold text-stone-200 mb-2 flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                            <span>Questions to Ground You in Reality:</span>
                          </p>
                          <ul className="space-y-1.5 pl-4 list-disc text-stone-300">
                            {item.counterEvidenceQuestions.map((q, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {q}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Micro Action Step with Checkbox */}
                        <div className="p-3.5 bg-[#19150e]/80 border border-amber-500/25 rounded-2xl flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              <span>3-Minute Micro-Proof Action:</span>
                            </p>
                            <p className="text-stone-300 leading-relaxed">
                              {item.microActionStep}
                            </p>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.94 }}
                            onClick={() => onToggleAction(item.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                              item.actionCompleted
                                ? 'bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20'
                                : 'bg-[#1e2333] hover:bg-[#282f44] text-stone-300 border border-white/[0.08]'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{item.actionCompleted ? 'Completed!' : 'Mark Done'}</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
