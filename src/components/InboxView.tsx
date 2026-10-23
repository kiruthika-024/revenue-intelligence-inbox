import React, { useState } from 'react';
import { 
  Conversation, 
  DealStage, 
  ActionItem
} from '../types';
import { 
  Search, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Edit3, 
  History, 
  Plus, 
  ExternalLink,
  Volume2
} from 'lucide-react';

interface InboxViewProps {
  conversations: Conversation[];
  onUpdateConversation: (updated: Conversation) => void;
  onNavigateToRoutingCase?: (caseId: string) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  conversations,
  onUpdateConversation,
  onNavigateToRoutingCase
}) => {
  const [selectedQueue, setSelectedQueue] = useState<'attention' | 'all' | 'enterprise' | 'coaching'>('attention');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [repFilter, setRepFilter] = useState<string>('all');
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentPlaybackSeconds, setCurrentPlaybackSeconds] = useState(0);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRep, setEditRep] = useState('');
  const [editStage, setEditStage] = useState<DealStage>('Discovery');
  const [editDealSize, setEditDealSize] = useState<number>(0);
  const [editReason, setEditReason] = useState('');

  const [isAddingAction, setIsAddingAction] = useState(false);
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState('');
  const [newActionDueDate, setNewActionDueDate] = useState('');

  const selectedConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  const filteredConversations = conversations.filter(conv => {
    if (selectedQueue === 'attention' && !conv.needsAttention) return false;
    if (selectedQueue === 'enterprise' && conv.dealSize < 100000) return false;
    if (selectedQueue === 'coaching' && conv.repTalkPercent < 65) return false;

    if (repFilter !== 'all' && conv.assignedRep !== repFilter) return false;

    if (stageFilter !== 'all' && conv.dealStage !== stageFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = conv.title.toLowerCase().includes(q);
      const matchAccount = conv.accountName.toLowerCase().includes(q);
      const matchContact = conv.contactName.toLowerCase().includes(q);
      const matchRep = conv.assignedRep.toLowerCase().includes(q);
      const matchCompetitor = conv.competitorMentions.some(c => c.toLowerCase().includes(q));
      const matchObjection = conv.keyObjections.some(o => o.toLowerCase().includes(q));
      if (!matchTitle && !matchAccount && !matchContact && !matchRep && !matchCompetitor && !matchObjection) {
        return false;
      }
    }

    return true;
  });

  const handleSelectConv = (id: string) => {
    setSelectedConvId(id);
    setIsPlayingAudio(false);
    setCurrentPlaybackSeconds(0);
    setActiveSegmentIndex(0);
  };

  const handleToggleActionItem = (itemId: string) => {
    if (!selectedConv) return;
    const updatedActions = selectedConv.actionItems.map(item => {
      if (item.id === itemId) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    const updated = {
      ...selectedConv,
      actionItems: updatedActions,
      lastModified: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    onUpdateConversation(updated);
  };

  const handleAddActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle.trim() || !selectedConv) return;

    const newItem: ActionItem = {
      id: `act-${Date.now()}`,
      title: newActionTitle.trim(),
      assignee: newActionAssignee.trim() || selectedConv.assignedRep,
      dueDate: newActionDueDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      completed: false,
      priority: 'high'
    };

    const updated = {
      ...selectedConv,
      actionItems: [...selectedConv.actionItems, newItem],
      lastModified: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    onUpdateConversation(updated);
    setNewActionTitle('');
    setNewActionAssignee('');
    setNewActionDueDate('');
    setIsAddingAction(false);
  };

  const openCorrectionModal = () => {
    if (!selectedConv) return;
    setEditRep(selectedConv.assignedRep);
    setEditStage(selectedConv.dealStage);
    setEditDealSize(selectedConv.dealSize);
    setEditReason('');
    setIsEditModalOpen(true);
  };

  const handleSaveCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv) return;

    const auditChanges: string[] = [];
    if (editRep !== selectedConv.assignedRep) auditChanges.push(`Rep: ${selectedConv.assignedRep} → ${editRep}`);
    if (editStage !== selectedConv.dealStage) auditChanges.push(`Stage: ${selectedConv.dealStage} → ${editStage}`);
    if (editDealSize !== selectedConv.dealSize) auditChanges.push(`ARR: ₹${selectedConv.dealSize} → ₹${editDealSize}`);

    const newAuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      author: 'Sales Manager (Manual Correction)',
      action: 'Manager Deal Correction',
      previousValue: `Rep: ${selectedConv.assignedRep}, Stage: ${selectedConv.dealStage}, ARR: ₹${selectedConv.dealSize}`,
      newValue: auditChanges.join(', ') || 'No value changes',
      reason: editReason.trim() || 'Manager operational adjustment following conversation review.'
    };

    const updated: Conversation = {
      ...selectedConv,
      assignedRep: editRep,
      dealStage: editStage,
      dealSize: Number(editDealSize),
      routingStatus: 'manually_corrected',
      auditLog: [newAuditEntry, ...selectedConv.auditLog],
      lastModified: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    onUpdateConversation(updated);
    setIsEditModalOpen(false);
  };

  const handleJumpToTimestamp = (seconds: number, index: number) => {
    setCurrentPlaybackSeconds(seconds);
    setActiveSegmentIndex(index);
    setIsPlayingAudio(true);
  };

  const uniqueReps = Array.from(new Set(conversations.map(c => c.assignedRep)));

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 bg-slate-900/60 px-6 py-3 shrink-0">
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setSelectedQueue('attention')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedQueue === 'attention'
                ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Needs Attention ({conversations.filter(c => c.needsAttention).length})
          </button>

          <button
            onClick={() => setSelectedQueue('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedQueue === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Calls ({conversations.length})
          </button>

          <button
            onClick={() => setSelectedQueue('enterprise')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedQueue === 'enterprise'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Big Deals (₹100k+)
          </button>

          <button
            onClick={() => setSelectedQueue('coaching')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedQueue === 'coaching'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rep Talks Too Much
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search rep, account, competitor..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-56 md:w-64 pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <select
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Stages</option>
            <option value="Discovery">Discovery</option>
            <option value="Solution Validation">Solution Validation</option>
            <option value="Proposal / Negotiation">Proposal / Negotiation</option>
            <option value="Procurement & Legal">Procurement & Legal</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>

          <select
            value={repFilter}
            onChange={e => setRepFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Sales Reps</option>
            {uniqueReps.map(rep => (
              <option key={rep} value={rep}>{rep}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-full md:w-[420px] shrink-0 border-r border-slate-800/80 bg-slate-950 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No conversations found matching criteria.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {filteredConversations.map(conv => {
                const isSelected = conv.id === selectedConvId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConv(conv.id)}
                    className={`w-full text-left p-4 transition-colors cursor-pointer block ${
                      isSelected 
                        ? 'bg-slate-900/90 border-l-2 border-indigo-500' 
                        : 'hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-slate-100 truncate">
                          {conv.accountName}
                        </h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {conv.title}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-200 tabular-nums shrink-0">
                        ₹{conv.dealSize.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-normal mb-2 flex-wrap">
                      <span>{conv.assignedRep}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>{conv.dealStage}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>{conv.date}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>{conv.durationMinutes} min</span>
                    </div>

                    {conv.needsAttention && (
                      <div className="mt-2 text-[11px] text-amber-300 bg-amber-950/40 border border-amber-900/50 rounded p-2 flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed">{conv.attentionReason || conv.riskReason}</span>
                      </div>
                    )}

                    {conv.competitorMentions.length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-300">
                        <span className="text-slate-500">Threat:</span>
                        <span>{conv.competitorMentions.join(', ')}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selectedConv ? (
          <div className="flex-1 overflow-y-auto bg-slate-950 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                      <span>Meeting UID: {selectedConv.meetingUid}</span>
                      <span aria-hidden="true">·</span>
                      <span>Platform: {selectedConv.platform}</span>
                      <span aria-hidden="true">·</span>
                      <span>Recorded: {selectedConv.date} at {selectedConv.time}</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-100">
                      {selectedConv.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
                      <span className="font-medium text-white">{selectedConv.accountName}</span>
                      {selectedConv.subsidiary && (
                        <span className="text-slate-400">({selectedConv.subsidiary})</span>
                      )}
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>Contact: {selectedConv.contactName} ({selectedConv.contactTitle})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={openCorrectionModal}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Correct / Reassign</span>
                    </button>

                    {selectedConv.id === 'conv-8821' && onNavigateToRoutingCase && (
                      <button
                        onClick={() => onNavigateToRoutingCase('case-8821')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-200 bg-amber-950/80 hover:bg-amber-900/80 border border-amber-800/80 rounded-lg transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Fix Rep Conflict</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Deal ARR</span>
                    <span className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                      ₹{selectedConv.dealSize.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Deal Stage</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {selectedConv.dealStage}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Assigned AE</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {selectedConv.assignedRep}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Talk / Listen Balance</span>
                    <span className={`text-sm font-semibold font-mono tabular-nums ${
                      selectedConv.repTalkPercent > 70 ? 'text-rose-400' : 'text-slate-200'
                    }`}>
                      {selectedConv.repTalkPercent}% Rep / {selectedConv.prospectTalkPercent}% Cust
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-slate-800/60">
                  <span className="text-xs font-semibold text-slate-300 block mb-1">
                    Call Summary
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedConv.executiveSummary}
                  </p>
                </div>

                <div className="mt-4 p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Routing Status: <strong className="text-slate-200">{selectedConv.routingStatus}</strong> ({selectedConv.routingConfidence}% confidence)</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {selectedConv.routingExplanation}
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800" id="transcript-player-acme">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-slate-100">
                      Call Transcript ({selectedConv.transcript.length} parts)
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                    >
                      {isPlayingAudio ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Play Recording</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPlaybackSeconds(0);
                        setActiveSegmentIndex(0);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-200"
                      title="Rewind to start"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      {Math.floor(currentPlaybackSeconds / 60)}:{(currentPlaybackSeconds % 60).toString().padStart(2, '0')} / {selectedConv.durationMinutes}:00
                    </span>
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {selectedConv.transcript.map((seg, idx) => {
                    const isRep = seg.speakerRole === 'Sales Rep';
                    const isHighlighted = idx === activeSegmentIndex && isPlayingAudio;
                    return (
                      <div
                        key={seg.id}
                        className={`p-3 rounded-lg border transition-all ${
                          isHighlighted
                            ? 'bg-indigo-950/40 border-indigo-500/60 shadow-sm'
                            : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold ${isRep ? 'text-indigo-400' : 'text-emerald-400'}`}>
                              {seg.speakerName}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              · {seg.speakerRole} ({seg.speakerCompany})
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleJumpToTimestamp(seg.seconds, idx)}
                            className="font-mono text-[11px] text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer"
                          >
                            [{seg.timestamp}]
                          </button>
                        </div>

                        <p className="text-xs text-slate-200 leading-relaxed">
                          {seg.text}
                        </p>

                        {seg.tags && seg.tags.length > 0 && (
                          <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                            <span>Key moment:</span>
                            {seg.tags.map(t => (
                              <span key={t} className="text-amber-300 font-mono">#{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800" id="action-items-editor">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">
                      Tasks & Next Steps ({selectedConv.actionItems.filter(a => a.completed).length}/{selectedConv.actionItems.length} done)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Check off completed promises and follow-ups.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setIsAddingAction(true)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                {isAddingAction && (
                  <form onSubmit={handleAddActionItem} className="p-3 bg-slate-950 rounded-lg border border-slate-800 mb-3 space-y-2">
                    <input
                      type="text"
                      placeholder="Action item description..."
                      value={newActionTitle}
                      onChange={e => setNewActionTitle(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-slate-100"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Assignee (e.g. Sarah Lin)"
                        value={newActionAssignee}
                        onChange={e => setNewActionAssignee(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-slate-100"
                      />
                      <input
                        type="date"
                        value={newActionDueDate}
                        onChange={e => setNewActionDueDate(e.target.value)}
                        className="w-36 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-slate-100"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingAction(false)}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {selectedConv.actionItems.length === 0 ? (
                    <p className="text-xs text-slate-500">No action items recorded.</p>
                  ) : (
                    selectedConv.actionItems.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleActionItem(item.id)}
                            className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                          >
                            {item.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-500" />
                            )}
                          </button>
                          <span className={`text-xs ${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {item.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <span>{item.assignee}</span>
                          <span aria-hidden="true">·</span>
                          <span>Due {item.dueDate}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-semibold text-slate-100">
                    Change History
                  </h3>
                </div>

                <div className="space-y-2">
                  {selectedConv.auditLog.length === 0 ? (
                    <p className="text-xs text-slate-500">No modifications recorded yet. Original source values active.</p>
                  ) : (
                    selectedConv.auditLog.map(audit => (
                      <div key={audit.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                        <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                          <span className="font-medium text-slate-200">{audit.action}</span>
                          <span className="font-mono">{audit.timestamp}</span>
                        </div>
                        <p className="text-slate-300 text-[11px]">
                          <strong>Author:</strong> {audit.author}
                        </p>
                        {audit.previousValue && (
                          <p className="text-slate-400 text-[11px] mt-0.5">
                            <strong>Previous:</strong> {audit.previousValue} → <strong>New:</strong> {audit.newValue}
                          </p>
                        )}
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          <strong>Reason:</strong> {audit.reason}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
            Select a conversation to inspect.
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100 mb-1">
              Manual Deal Correction & Reassignment
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Override automatically extracted sales fields. All changes are permanently recorded in the deal audit trail.
            </p>

            <form onSubmit={handleSaveCorrection} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Assigned Sales Representative
                </label>
                <select
                  value={editRep}
                  onChange={e => setEditRep(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100"
                >
                  <option value="Sarah Lin">Sarah Lin (US Strategic)</option>
                  <option value="David Vance">David Vance (EMEA Enterprise)</option>
                  <option value="Marcus Thorne">Marcus Thorne (Mid-Market)</option>
                  <option value="Unassigned">Unassigned Pool</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Deal Stage
                </label>
                <select
                  value={editStage}
                  onChange={e => setEditStage(e.target.value as DealStage)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100"
                >
                  <option value="Discovery">Discovery</option>
                  <option value="Solution Validation">Solution Validation</option>
                  <option value="Technical Evaluation">Technical Evaluation</option>
                  <option value="Proposal / Negotiation">Proposal / Negotiation</option>
                  <option value="Procurement & Legal">Procurement & Legal</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Deal ARR (₹ Rupees)
                </label>
                <input
                  type="number"
                  value={editDealSize}
                  onChange={e => setEditDealSize(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono"
                  step="1000"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Manager Rationale & Audit Note (Required)
                </label>
                <textarea
                  value={editReason}
                  onChange={e => setEditReason(e.target.value)}
                  placeholder="e.g., Reassigned to David Vance based on EMEA headquarters address and local data residency clause..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
                >
                  Confirm & Commit to Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
