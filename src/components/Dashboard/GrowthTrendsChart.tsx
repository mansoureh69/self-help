import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp,
  Activity,
  Calendar,
  Sparkles,
  Layers,
  BarChart3,
  Award,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  HelpCircle,
  Clock
} from 'lucide-react';
import { LifeQualityPillar, LifeQualityCheckpoint } from '../../types';

interface GrowthTrendsChartProps {
  pillars: LifeQualityPillar[];
  checkpoints: LifeQualityCheckpoint[];
  onAddCheckpoint: (note: string) => void;
}

export const GrowthTrendsChart: React.FC<GrowthTrendsChartProps> = ({
  pillars,
  checkpoints,
  onAddCheckpoint,
}) => {
  const [viewMode, setViewMode] = useState<'composite' | 'pillars' | 'comparison'>('composite');
  const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);
  const [snapshotNote, setSnapshotNote] = useState('');

  // 1. Calculate current live overall score
  const currentTotal = pillars.reduce((sum, p) => sum + p.score, 0);
  const currentOverallScore = Math.round((currentTotal / (pillars.length * 10)) * 100);

  // Pillar color mapping
  const pillarColors: Record<string, string> = {
    mindset: '#10b981', // emerald
    vitality: '#f59e0b', // amber
    purpose: '#3b82f6', // blue
    relationships: '#f43f5e', // rose
    peace: '#6366f1', // indigo
    joy: '#8b5cf6', // violet
  };

  const pillarNames: Record<string, string> = {
    mindset: 'Mindset & Self-Belief',
    vitality: 'Physical Vitality',
    purpose: 'Meaningful Work',
    relationships: 'Relationships',
    peace: 'Peace of Mind',
    joy: 'Joy & Play',
  };

  // Build live today snapshot object
  const currentPillarsMap: Record<string, number> = {};
  pillars.forEach((p) => {
    currentPillarsMap[p.id] = p.score;
  });

  // Combine checkpoints with Current Live data point
  const combinedTimelineData = [
    ...checkpoints.map((chk) => ({
      date: chk.date,
      overallScore: chk.overallScore,
      note: chk.reflectionNote,
      isLive: false,
      mindset: chk.pillars['mindset'] ?? 5,
      vitality: chk.pillars['vitality'] ?? 5,
      purpose: chk.pillars['purpose'] ?? 5,
      relationships: chk.pillars['relationships'] ?? 5,
      peace: chk.pillars['peace'] ?? 5,
      joy: chk.pillars['joy'] ?? 5,
    })),
    {
      date: 'Today (Live)',
      overallScore: currentOverallScore,
      note: 'Active calibrated state',
      isLive: true,
      mindset: currentPillarsMap['mindset'] ?? 7,
      vitality: currentPillarsMap['vitality'] ?? 6,
      purpose: currentPillarsMap['purpose'] ?? 8,
      relationships: currentPillarsMap['relationships'] ?? 7,
      peace: currentPillarsMap['peace'] ?? 6,
      joy: currentPillarsMap['joy'] ?? 5,
    },
  ];

  // Starting baseline score from first checkpoint
  const baselineScore = checkpoints.length > 0 ? checkpoints[0].overallScore : currentOverallScore;
  const netGrowth = currentOverallScore - baselineScore;

  // Comparison data: baseline vs current for each pillar
  const baselinePillars = checkpoints.length > 0 ? checkpoints[0].pillars : currentPillarsMap;
  const comparisonData = pillars.map((p) => {
    const startVal = baselinePillars[p.id] ?? p.score;
    const currentVal = p.score;
    const diff = currentVal - startVal;
    return {
      pillarId: p.id,
      name: p.name.split('&')[0].trim(),
      fullName: p.name,
      Baseline: startVal,
      Current: currentVal,
      Gains: diff,
    };
  });

  // Find top velocity pillar
  const topGainer = [...comparisonData].sort((a, b) => b.Gains - a.Gains)[0];

  const handleSnapshotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCheckpoint(snapshotNote.trim() || 'Milestone checkpoint');
    setSnapshotNote('');
    setIsSnapshotOpen(false);
  };

  // Custom sleek tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-900/95 border border-stone-700 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs">
          <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-stone-800">
            <span className="font-bold text-stone-200 font-['Outfit']">{label}</span>
            {payload[0]?.payload?.isLive && (
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                Live State
              </span>
            )}
          </div>

          <div className="space-y-1">
            {payload.map((entry: any, index: number) => {
              const displayName = pillarNames[entry.dataKey] || entry.name || 'Life Quality';
              return (
                <div key={index} className="flex items-center justify-between gap-3 text-[11px]">
                  <span className="flex items-center gap-1.5 text-stone-300">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: entry.stroke || entry.fill || entry.color }}
                    />
                    <span>{displayName}:</span>
                  </span>
                  <span className="font-bold text-stone-100 font-['Outfit']">
                    {entry.value}
                    {entry.dataKey === 'overallScore' ? '%' : '/10'}
                  </span>
                </div>
              );
            })}
          </div>

          {payload[0]?.payload?.note && (
            <p className="mt-2 pt-1.5 border-t border-stone-800/80 text-[10px] text-stone-400 italic">
              "{payload[0].payload.note}"
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Growth Trends</span>
            </span>
            <span className="text-xs text-stone-400">Recharts Visualization</span>
          </div>

          <h2 className="text-lg md:text-xl font-bold font-['Outfit'] text-stone-100">
            Life Quality & Self-Belief Evolution
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Track how deliberate habit rituals and cognitive reframing elevate your holistic equilibrium over time.
          </p>
        </div>

        {/* View Switcher & Snapshot Action */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-stone-800/90 rounded-xl p-1 border border-stone-700/80">
            <button
              onClick={() => setViewMode('composite')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'composite'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:text-stone-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Overall Index</span>
            </button>

            <button
              onClick={() => setViewMode('pillars')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'pillars'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:text-stone-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pillars Breakdown</span>
            </button>

            <button
              onClick={() => setViewMode('comparison')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'comparison'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:text-stone-100'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Baseline vs Now</span>
            </button>
          </div>

          <button
            onClick={() => setIsSnapshotOpen(!isSnapshotOpen)}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Log current scores as a permanent milestone"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Milestone</span>
          </button>
        </div>
      </div>

      {/* Snapshot Modal / Form */}
      {isSnapshotOpen && (
        <form
          onSubmit={handleSnapshotSubmit}
          className="bg-stone-800/80 border border-stone-700 rounded-2xl p-4 animate-in fade-in duration-200 text-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Record a Milestone Checkpoint</span>
            </span>
            <button
              type="button"
              onClick={() => setIsSnapshotOpen(false)}
              className="text-stone-400 hover:text-stone-200 text-xs"
            >
              ✕ Cancel
            </button>
          </div>

          <p className="text-stone-400 text-[11px]">
            This saves your current scores (LQ: {currentOverallScore}%) into the permanent historical timeline.
          </p>

          <input
            type="text"
            value={snapshotNote}
            onChange={(e) => setSnapshotNote(e.target.value)}
            placeholder="Add a milestone note (e.g. 'Overcame presentation anxiety with Leo', '1 week of 4-7-8 breathing')"
            className="w-full bg-stone-900 text-stone-100 placeholder-stone-500 border border-stone-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
          />

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs shadow-md shadow-amber-950/40"
            >
              Confirm & Save Checkpoint
            </button>
          </div>
        </form>
      )}

      {/* 4 Summary Highlight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-stone-800/40 border border-stone-800 rounded-2xl p-3.5">
          <span className="text-[11px] text-stone-400 block font-medium">Starting Baseline</span>
          <span className="text-lg font-bold font-['Outfit'] text-stone-200 mt-0.5 block">
            {baselineScore}%
          </span>
          <span className="text-[10px] text-stone-500">First recorded score</span>
        </div>

        <div className="bg-stone-800/40 border border-stone-800 rounded-2xl p-3.5">
          <span className="text-[11px] text-stone-400 block font-medium">Current Index</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-lg font-bold font-['Outfit'] text-amber-300">
              {currentOverallScore}%
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-[10px] text-stone-500">Live calibrated state</span>
        </div>

        <div className="bg-stone-800/40 border border-stone-800 rounded-2xl p-3.5">
          <span className="text-[11px] text-stone-400 block font-medium">Net Growth Trajectory</span>
          <span
            className={`text-lg font-bold font-['Outfit'] mt-0.5 flex items-center gap-1 ${
              netGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {netGrowth >= 0 ? `+${netGrowth}%` : `${netGrowth}%`}
            <ArrowUpRight className="w-4 h-4" />
          </span>
          <span className="text-[10px] text-stone-500">Across recorded span</span>
        </div>

        <div className="bg-stone-800/40 border border-stone-800 rounded-2xl p-3.5">
          <span className="text-[11px] text-stone-400 block font-medium">Highest Velocity Domain</span>
          <span className="text-sm font-bold font-['Outfit'] text-stone-200 mt-1 block truncate">
            {topGainer?.name || 'Mindset'}
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold">
            +{topGainer?.Gains ?? 2} pts improvement
          </span>
        </div>
      </div>

      {/* Main Recharts Area Container */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'composite' ? (
            /* Mode 1: Composite Overall Life Quality (AreaChart with Gradient) */
            <AreaChart data={combinedTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="lqGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#78716c"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#44403c' }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#78716c"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#44403c' }}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={75}
                stroke="#10b981"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
                label={{ value: 'Equilibrium (75%)', fill: '#10b981', fontSize: 10, position: 'insideTopRight' }}
              />
              <Area
                type="monotone"
                dataKey="overallScore"
                name="Life Quality Index"
                stroke="#f59e0b"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#lqGradient)"
                activeDot={{ r: 6, fill: '#fbbf24', stroke: '#1c1917', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : viewMode === 'pillars' ? (
            /* Mode 2: Multi-Line Pillar Breakdown */
            <LineChart data={combinedTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#78716c"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#44403c' }}
              />
              <YAxis
                domain={[1, 10]}
                stroke="#78716c"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#44403c' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 10, fontSize: 11 }}
                formatter={(value) => pillarNames[value] || value}
              />
              <Line
                type="monotone"
                dataKey="mindset"
                stroke={pillarColors.mindset}
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="vitality"
                stroke={pillarColors.vitality}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="purpose"
                stroke={pillarColors.purpose}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="relationships"
                stroke={pillarColors.relationships}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="peace"
                stroke={pillarColors.peace}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="joy"
                stroke={pillarColors.joy}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          ) : (
            /* Mode 3: Baseline vs Current Pillar Gains (BarChart) */
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#78716c"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#44403c' }}
              />
              <YAxis
                domain={[0, 10]}
                stroke="#78716c"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#44403c' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 10, fontSize: 11 }} />
              <Bar dataKey="Baseline" fill="#57534e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Current" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Insight Note */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-stone-800 text-xs text-stone-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Real-time link: Modifying scores in the Life Quality Wheel updates the live trend point.</span>
        </span>
        <span className="text-[11px] text-stone-500">
          {checkpoints.length} saved checkpoints in timeline
        </span>
      </div>
    </div>
  );
};
