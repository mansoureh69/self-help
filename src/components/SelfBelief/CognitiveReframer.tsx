import React, { useState } from 'react';
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
  BookmarkCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { LimitingBelief } from '../../types';

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
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header Info */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 mb-6 text-stone-100 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CBT & Growth Mindset
              </span>
              <span className="text-xs text-stone-400">Cognitive Restructuring</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-['Outfit'] mt-1 text-stone-100">
              Inner Critic Reframer
            </h1>
            <p className="text-xs md:text-sm text-stone-400 mt-1 max-w-2xl">
              Self-belief is not about suppressing doubts; it is about examining the evidence.
              Deconstruct automatic negative thoughts and convert them into grounded, empowering truths.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-stone-800/80 px-4 py-2.5 rounded-xl border border-stone-700/80">
            <BookmarkCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs text-stone-400 font-medium">Reframed Beliefs</p>
              <p className="text-lg font-bold text-stone-100">{reframes.length} Transformed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Input Generator Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 mb-8 shadow-xl">
        <h2 className="text-base font-bold text-stone-100 mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Capture an Active Limiting Thought</span>
        </h2>
        <p className="text-xs text-stone-400 mb-4">
          What is your inner critic whispering to you right now? Be as raw and candid as you need.
        </p>

        <form onSubmit={handleReframeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">
              The Limiting Thought / Self-Doubt:
            </label>
            <textarea
              id="limiting-thought-input"
              rows={3}
              value={thoughtInput}
              onChange={(e) => setThoughtInput(e.target.value)}
              placeholder="e.g., 'I will never be as competent as my peers, I always stumble when it counts...'"
              className="w-full bg-stone-800 text-stone-100 placeholder-stone-400 border border-stone-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">
              Optional Context / Triggering Situation:
            </label>
            <input
              type="text"
              id="situation-input"
              value={situationInput}
              onChange={(e) => setSituationInput(e.target.value)}
              placeholder="e.g., 'Upcoming presentation tomorrow morning', 'Saw a rejected application'"
              className="w-full bg-stone-800 text-stone-100 placeholder-stone-400 border border-stone-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>

          {/* Quick Inspirations */}
          <div>
            <p className="text-[11px] text-stone-400 mb-1.5">Or test with a common cognitive trap:</p>
            <div className="flex flex-wrap gap-2">
              {sampleThoughts.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setThoughtInput(sample)}
                  className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 rounded-lg px-2.5 py-1 text-left transition-colors"
                >
                  "{sample.slice(0, 42)}..."
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              id="submit-reframe-btn"
              disabled={!thoughtInput.trim() || isAnalyzing}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm rounded-xl flex items-center gap-2 transition-all shadow-md shadow-amber-950/40 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Restructuring with Gemini CBT...</span>
                </>
              ) : (
                <>
                  <span>Transform into Empowered Belief</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Reframed Beliefs Library */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-stone-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Your Transformed Belief Library</span>
          </h2>
          <span className="text-xs text-stone-400">
            Click any entry to view counter-evidence and micro-actions
          </span>
        </div>

        {reframes.length === 0 ? (
          <div className="bg-stone-900 border border-dashed border-stone-800 rounded-2xl p-8 text-center text-stone-400">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 text-stone-500" />
            <p className="text-sm font-medium text-stone-300">No reframed thoughts yet.</p>
            <p className="text-xs mt-1">
              Submit a limiting thought above to dismantle your inner critic with psychological evidence.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reframes.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden transition-all shadow-md hover:border-stone-700"
                >
                  {/* Header Row */}
                  <div
                    className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-950/60 text-rose-300 border border-rose-900/60">
                          Trap: {item.identifiedTrap}
                        </span>
                        {item.situation && (
                          <span className="text-[11px] text-stone-400">
                            Context: {item.situation}
                          </span>
                        )}
                        <span className="text-[11px] text-stone-400 ml-auto">
                          {item.createdAt}
                        </span>
                      </div>

                      {/* Original Limiting Thought */}
                      <p className="text-xs text-stone-400 line-through decoration-rose-500/70 mb-1">
                        "{item.originalThought}"
                      </p>

                      {/* Empowered Reframe Preview */}
                      <p className="text-sm font-semibold text-amber-300 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span>{item.empoweredReframe}</span>
                      </p>
                    </div>

                    <button
                      className="p-1 text-stone-400 hover:text-stone-200"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Expanded Breakdown */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-stone-800 space-y-4 bg-stone-950/40 text-xs">
                      {/* Compassionate Validation */}
                      <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800">
                        <p className="font-semibold text-stone-300 mb-1 flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-blue-400" />
                          <span>Why Your Brain Created This Thought:</span>
                        </p>
                        <p className="text-stone-400 leading-relaxed">
                          {item.compassionateValidation}
                        </p>
                      </div>

                      {/* Counter-Evidence Questions */}
                      <div>
                        <p className="font-semibold text-stone-300 mb-2 flex items-center gap-1.5">
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
                      <div className="p-3.5 bg-amber-950/30 border border-amber-800/50 rounded-xl flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>3-Minute Micro-Proof Action:</span>
                          </p>
                          <p className="text-stone-300 leading-relaxed">
                            {item.microActionStep}
                          </p>
                        </div>

                        <button
                          onClick={() => onToggleAction(item.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            item.actionCompleted
                              ? 'bg-emerald-600 text-stone-950'
                              : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{item.actionCompleted ? 'Completed!' : 'Mark Done'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
