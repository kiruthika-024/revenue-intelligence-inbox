import React from 'react';
import { Conversation } from '../types';

interface AnalyticsDashboardProps {
  conversations: Conversation[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ conversations }) => {
  const totalPipeline = conversations.reduce((acc, c) => acc + c.dealSize, 0);
  const atRiskCalls = conversations.filter(c => c.riskLevel === 'critical' || c.riskLevel === 'high');
  const pipelineAtRisk = atRiskCalls.reduce((acc, c) => acc + c.dealSize, 0);
  const triagedCalls = conversations.filter(c => c.routingStatus === 'verified' || c.routingStatus === 'manually_corrected').length;
  const avgRepTalk = Math.round(conversations.reduce((acc, c) => acc + c.repTalkPercent, 0) / (conversations.length || 1));

  const repStats: Record<string, { totalCalls: number; totalARR: number; avgTalk: number; coachingAlerts: number }> = {};
  conversations.forEach(c => {
    if (!repStats[c.assignedRep]) {
      repStats[c.assignedRep] = { totalCalls: 0, totalARR: 0, avgTalk: 0, coachingAlerts: 0 };
    }
    repStats[c.assignedRep].totalCalls += 1;
    repStats[c.assignedRep].totalARR += c.dealSize;
    repStats[c.assignedRep].avgTalk += c.repTalkPercent;
    if (c.repTalkPercent > 70) repStats[c.assignedRep].coachingAlerts += 1;
  });

  Object.keys(repStats).forEach(rep => {
    repStats[rep].avgTalk = Math.round(repStats[rep].avgTalk / repStats[rep].totalCalls);
  });

  const competitorStats: Record<string, { mentions: number; arrAtRisk: number }> = {};
  conversations.forEach(c => {
    c.competitorMentions.forEach(comp => {
      if (!competitorStats[comp]) competitorStats[comp] = { mentions: 0, arrAtRisk: 0 };
      competitorStats[comp].mentions += 1;
      competitorStats[comp].arrAtRisk += c.dealSize;
    });
  });

  const stageStats: Record<string, { count: number; arr: number }> = {};
  conversations.forEach(c => {
    if (!stageStats[c.dealStage]) stageStats[c.dealStage] = { count: 0, arr: 0 };
    stageStats[c.dealStage].count += 1;
    stageStats[c.dealStage].arr += c.dealSize;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h2 className="text-xl font-bold text-slate-100">
            Sales Performance Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Overview of all {conversations.length} recorded sales calls and active deals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Total Pipeline Value</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-white tabular-nums">
                ₹{totalPipeline.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-400 font-medium">8 deals</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              All active customer deals
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Deals at Risk</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
                ₹{pipelineAtRisk.toLocaleString()}
              </span>
              <span className="text-xs text-rose-400 font-medium font-mono">
                {Math.round((pipelineAtRisk / totalPipeline) * 100)}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {atRiskCalls.length} deals need attention
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Calls Reviewed</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-indigo-400 tabular-nums">
                {Math.round((triagedCalls / conversations.length) * 100)}%
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {triagedCalls}/{conversations.length} checked
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Assigned and verified
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Rep vs Customer Talk</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-slate-200 tabular-nums">
                {avgRepTalk}% / {100 - avgRepTalk}%
              </span>
              <span className="text-xs text-amber-400 font-medium">1 talks too much</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Reps should speak under 60%
            </p>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Rep Talk Time & Alerts
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Check if reps are listening to customers.
              </p>
            </div>
            <span className="text-xs text-slate-400">Target: Under 60%</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium">
                  <th className="pb-3">Sales Rep</th>
                  <th className="pb-3 text-right">Monitored Calls</th>
                  <th className="pb-3 text-right">Active ARR</th>
                  <th className="pb-3">Avg Talk Ratio</th>
                  <th className="pb-3 text-right">Coaching Alerts</th>
                  <th className="pb-3">Manager Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {Object.entries(repStats).map(([rep, stats]) => {
                  const isHigh = stats.avgTalk > 60;
                  return (
                    <tr key={rep} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 font-medium text-slate-200">{rep}</td>
                      <td className="py-3.5 text-right font-mono tabular-nums text-slate-300">{stats.totalCalls}</td>
                      <td className="py-3.5 text-right font-mono tabular-nums text-slate-300">₹{stats.totalARR.toLocaleString()}</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-28 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${isHigh ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${stats.avgTalk}%` }}
                            />
                          </div>
                          <span className={`font-mono text-[11px] tabular-nums ${isHigh ? 'text-rose-400 font-semibold' : 'text-slate-300'}`}>
                            {stats.avgTalk}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 text-right font-mono tabular-nums">
                        {stats.coachingAlerts > 0 ? (
                          <span className="text-amber-400 font-semibold">{stats.coachingAlerts} flagged</span>
                        ) : (
                          <span className="text-slate-500">None</span>
                        )}
                      </td>
                      <td className="py-3.5 text-slate-400 text-[11px]">
                        {stats.coachingAlerts > 0 ? 'Active listening 1-on-1 scheduled' : 'Nominal customer engagement'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-100 mb-1">
              Competitor Mention Radar
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Displacement attempts and competitive price matching demands.
            </p>

            <div className="space-y-3">
              {Object.entries(competitorStats).map(([comp, stats]) => (
                <div key={comp} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">{comp}</span>
                    <span className="text-[11px] text-slate-500">
                      Mentioned in {stats.mentions} {stats.mentions === 1 ? 'deal' : 'deals'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-rose-400 tabular-nums block">
                      ₹{stats.arrAtRisk.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500">ARR at risk</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-100 mb-1">
              Pipeline Stage & Call Velocity
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Conversation volume and ARR density along the sales funnel.
            </p>

            <div className="space-y-3">
              {Object.entries(stageStats).map(([stage, stats]) => (
                <div key={stage} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">{stage}</span>
                    <span className="text-[11px] text-slate-500">
                      {stats.count} {stats.count === 1 ? 'conversation' : 'conversations'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-slate-200 tabular-nums block">
                      ₹{stats.arr.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {Math.round((stats.arr / totalPipeline) * 100)}% of pipeline
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
