import React, { useState } from 'react';
import { Conversation, DuplicateTestResult } from '../types';
import { UPDATE_TEST_BATCH } from '../data/mockData';
import { previewBatchDeduplication, applyBatchImport } from '../utils/deduplicationEngine';
import { 
  RefreshCw, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

interface ImportDeduplicationModalProps {
  conversations: Conversation[];
  onApplyBatchUpdate: (updatedList: Conversation[]) => void;
  onResetBaseline: () => void;
}

export const ImportDeduplicationModal: React.FC<ImportDeduplicationModalProps> = ({
  conversations,
  onApplyBatchUpdate,
  onResetBaseline
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<'smart_merge' | 'overwrite' | 'skip_existing'>('smart_merge');
  const [previewResult, setPreviewResult] = useState<DuplicateTestResult | null>(() => 
    previewBatchDeduplication(conversations, UPDATE_TEST_BATCH)
  );
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  const handleExecuteImport = () => {
    const { updatedList, summary } = applyBatchImport(conversations, UPDATE_TEST_BATCH, selectedStrategy);
    onApplyBatchUpdate(updatedList);
    setExecutionMessage(summary);
    setPreviewResult(previewBatchDeduplication(updatedList, UPDATE_TEST_BATCH));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-8" id="import-sync-modal">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium mb-1">
              <RefreshCw className="w-4 h-4" />
              <span>Import & Duplicate Check</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              Upload Calls & Check for Duplicates
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Test how new call uploads are handled. The system automatically skips duplicate calls and highlights any changed details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onResetBaseline}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Reset to Original 8 Calls
            </button>
          </div>
        </div>

        {executionMessage && (
          <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-xs text-emerald-200 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{executionMessage}</span>
            </div>
          </div>
        )}

        {previewResult && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Total Uploaded Calls</span>
              <span className="text-2xl font-bold font-mono text-white tabular-nums">
                {previewResult.totalProcessed}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Calls in this batch</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Duplicate Calls Skipped</span>
              <span className="text-2xl font-bold font-mono text-slate-400 tabular-nums">
                {previewResult.identicalDuplicatesSkipped}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Exact match (No changes)</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Calls with Changes</span>
              <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                {previewResult.conflictsDetected}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Numbers or stages updated</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Brand New Calls</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {previewResult.newRecordsCreated}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Added to your inbox</p>
            </div>
          </div>
        )}

        <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800" id="conflict-diff-viewer">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Changes Found in Uploaded Calls
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review what changed between your current calls and the new upload.
              </p>
            </div>
            <span className="font-mono text-xs text-slate-400">
              {previewResult?.conflictDetails.length || 0} calls changed
            </span>
          </div>

          <div className="space-y-4">
            {previewResult?.conflictDetails.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs bg-slate-950 rounded-lg border border-slate-800">
                All uploaded calls are already up to date. No changes needed.
              </div>
            ) : (
              previewResult?.conflictDetails.map(conflict => (
                <div key={conflict.meetingUid} className="p-4 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
                    <div>
                      <span className="font-semibold text-xs text-slate-200">{conflict.conversationTitle}</span>
                      <span className="text-[11px] font-mono text-slate-500 ml-2">ID: {conflict.meetingUid}</span>
                    </div>
                    <span className="text-[11px] font-medium text-amber-400 bg-amber-950/40 border border-amber-900/40 px-2 py-0.5 rounded">
                      {conflict.changes.length} changed items
                    </span>
                  </div>

                  <div className="space-y-2">
                    {conflict.changes.map((ch, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs p-2 rounded bg-slate-900/50">
                        <span className="font-medium text-slate-400">{ch.field}</span>
                        <div className="text-rose-400 font-mono text-[11px]">
                          <span className="text-slate-600 mr-1">Current:</span>
                          <del className="line-through">{ch.oldValue}</del>
                        </div>
                        <div className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                          <span className="text-slate-600 mr-1">New:</span>
                          <span className="font-bold">{ch.newValue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-100 mb-1">
            How to Handle These Updates
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Choose what to do with the changed calls.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setSelectedStrategy('smart_merge')}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                selectedStrategy === 'smart_merge'
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-indigo-300">Smart Update (Recommended)</span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Updates deal amount and call duration, but keeps your custom notes and rep assignments safe.
              </p>
            </button>

            <button
              onClick={() => setSelectedStrategy('overwrite')}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                selectedStrategy === 'overwrite'
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">Replace Everything</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Overwrites all call information with the incoming upload data.
              </p>
            </button>

            <button
              onClick={() => setSelectedStrategy('skip_existing')}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                selectedStrategy === 'skip_existing'
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">Skip Existing Calls</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Only adds brand new calls and ignores any changes to existing calls.
              </p>
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 font-mono">
              Ready to process {UPDATE_TEST_BATCH.length} items
            </span>

            <button
              onClick={handleExecuteImport}
              className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm shadow-indigo-950"
            >
              Save & Update Calls
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
