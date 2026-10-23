import React, { useState } from 'react';
import { Conversation, DifficultRoutingCase } from '../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  Building,
  Globe,
  Award,
  Sparkles
} from 'lucide-react';

interface RoutingWorkbenchProps {
  conversations: Conversation[];
  routingCase: DifficultRoutingCase;
  onResolveCase: (
    caseId: string, 
    resolutionType: 'split_attributed' | 'assigned_emea' | 'assigned_global',
    rationale: string
  ) => void;
}

export const RoutingWorkbench: React.FC<RoutingWorkbenchProps> = ({
  conversations,
  routingCase,
  onResolveCase
}) => {
  const [resolutionStatus, setResolutionStatus] = useState<string>(routingCase.status);
  const [customRationale, setCustomRationale] = useState<string>('');
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

  const handleApplyResolution = (type: 'split_attributed' | 'assigned_emea' | 'assigned_global') => {
    let rationale = customRationale.trim();
    if (!rationale) {
      if (type === 'split_attributed') {
        rationale = 'Sales Manager applied Dual-Credit Split Attribution: 60% EMEA execution quota to David Vance, 40% corporate MSA framework quota to Sarah Lin.';
      } else if (type === 'assigned_emea') {
        rationale = 'Assigned 100% to David Vance based on UK operating budget and London datacenter deployment requirements.';
      } else {
        rationale = 'Assigned 100% to Sarah Lin based on existing Master Services Agreement at US Global Headquarters.';
      }
    }

    onResolveCase(routingCase.id, type, rationale);
    setResolutionStatus(type);
    setIsSuccessMessageVisible(true);
    setTimeout(() => setIsSuccessMessageVisible(false), 5000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Conflicting Rep Assignment</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              {routingCase.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {routingCase.summary}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${
              resolutionStatus === 'pending_manager' 
                ? 'bg-amber-950/70 text-amber-300 border-amber-800/80' 
                : 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80'
            }`}>
              {resolutionStatus === 'pending_manager' ? 'Needs Your Decision' : 'Assigned & Saved'}
            </span>
          </div>
        </div>

        {isSuccessMessageVisible && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Attribution dispute resolved successfully! Immutable audit entry written to conversation record #REV-8821.</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-xl border transition-all ${
            resolutionStatus === 'assigned_global' 
              ? 'bg-indigo-950/40 border-indigo-500 shadow-md' 
              : 'bg-slate-900/70 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-300">Route A: Corporate Global MSA</span>
              </div>
              <span className="font-mono text-xs text-indigo-400 font-bold">54% Match</span>
            </div>

            <h3 className="text-base font-bold text-slate-100">
              {routingCase.primaryCandidate.rep}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {routingCase.primaryCandidate.account} · {routingCase.primaryCandidate.territory}
            </p>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 mb-4 leading-relaxed">
              <strong>Territory Argument:</strong> {routingCase.primaryCandidate.rationale}
            </div>

            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>• Active Master Agreement: MSA #AG-2024-88</li>
              <li>• Billing entity: Delaware US Corporate Corp</li>
              <li>• Pre-negotiated enterprise terms: 18% master discount tier</li>
            </ul>
          </div>

          <div className={`p-6 rounded-xl border transition-all ${
            resolutionStatus === 'assigned_emea' 
              ? 'bg-emerald-950/40 border-emerald-500 shadow-md' 
              : 'bg-slate-900/70 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-300">Route B: EMEA Operating Entity</span>
              </div>
              <span className="font-mono text-xs text-emerald-400 font-bold">46% Match</span>
            </div>

            <h3 className="text-base font-bold text-slate-100">
              {routingCase.secondaryCandidate.rep}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {routingCase.secondaryCandidate.account} · {routingCase.secondaryCandidate.territory}
            </p>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 mb-4 leading-relaxed">
              <strong>Territory Argument:</strong> {routingCase.secondaryCandidate.rationale}
            </div>

            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>• Invitee email domain: @acmecloud.co.uk</li>
              <li>• Decision Maker: Dr. Elena Weber based in London</li>
              <li>• Funding source: European Tech Ops Capex budget</li>
            </ul>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Why This Deal Needs Your Decision
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {routingCase.conflictFactors.map((factor, index) => (
              <div key={index} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                <span className="font-mono text-indigo-400 mr-1.5">{index + 1}.</span>
                {factor}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800" id="routing-override-modal">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Pick Who Gets This Deal
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Choose how to assign this deal. This updates deal ownership and saves your reason to the audit history.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => handleApplyResolution('split_attributed')}
              className="p-4 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/80 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-indigo-300">Split Deal (60% to David / 40% to Sarah)</span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Give ₹144k credit to David Vance (local team) and ₹96k to Sarah Lin (global agreement). Best option.
              </p>
            </button>

            <button
              onClick={() => handleApplyResolution('assigned_emea')}
              className="p-4 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">100% to David Vance</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Attributed entirely to EMEA operating subsidiary based on local data residency and budget ownership.
              </p>
            </button>

            <button
              onClick={() => handleApplyResolution('assigned_global')}
              className="p-4 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">100% to Sarah Lin</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Attributed entirely to Global Enterprise AE based on master MSA terms and corporate procurement.
              </p>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 block">
              Optional Manager Justification Notes (appended to audit trail)
            </label>
            <input
              type="text"
              placeholder="e.g. Approved 60/40 split with VP RevOps to incentivize joint EMEA deployment..."
              value={customRationale}
              onChange={e => setCustomRationale(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
