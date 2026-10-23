import React, { useState } from 'react';
import { Conversation, DifficultRoutingCase } from './types';
import { INITIAL_CONVERSATIONS, DIFFICULT_ROUTING_CASE } from './data/mockData';
import { TopNav, NavTab } from './components/TopNav';
import { InboxView } from './components/InboxView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { RoutingWorkbench } from './components/RoutingWorkbench';
import { ImportDeduplicationModal } from './components/ImportDeduplicationModal';

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [routingCase, setRoutingCase] = useState<DifficultRoutingCase>(DIFFICULT_ROUTING_CASE);
  const [activeTab, setActiveTab] = useState<NavTab>('inbox');

  const handleUpdateConversation = (updated: Conversation) => {
    setConversations(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleResolveRoutingCase = (
    caseId: string,
    resolutionType: 'split_attributed' | 'assigned_emea' | 'assigned_global',
    rationale: string
  ) => {
    setRoutingCase(prev => ({
      ...prev,
      status: resolutionType === 'split_attributed' ? 'split_attributed' : 'resolved_override',
      resolutionNotes: rationale
    }));

    setConversations(prev => prev.map(c => {
      if (c.id === routingCase.conversationId) {
        let newRep = c.assignedRep;
        let newRoutingStatus = c.routingStatus;

        if (resolutionType === 'split_attributed') {
          newRep = 'David Vance (60%) & Sarah Lin (40%)';
          newRoutingStatus = 'manually_corrected';
        } else if (resolutionType === 'assigned_emea') {
          newRep = 'David Vance';
          newRoutingStatus = 'manually_corrected';
        } else if (resolutionType === 'assigned_global') {
          newRep = 'Sarah Lin';
          newRoutingStatus = 'verified';
        }

        const newAudit = {
          id: `aud-route-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          author: 'Sales Manager',
          action: `Assigned: ${resolutionType}`,
          previousValue: c.assignedRep,
          newValue: newRep,
          reason: rationale
        };

        return {
          ...c,
          assignedRep: newRep,
          routingStatus: newRoutingStatus,
          needsAttention: false,
          routingExplanation: `Assigned by manager: ${rationale}`,
          auditLog: [newAudit, ...c.auditLog],
          lastModified: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
      }
      return c;
    }));
  };

  const handleApplyBatchUpdate = (updatedList: Conversation[]) => {
    setConversations(updatedList);
  };

  const handleResetBaseline = () => {
    setConversations(INITIAL_CONVERSATIONS);
    setRoutingCase(DIFFICULT_ROUTING_CASE);
  };

  const needsAttentionCount = conversations.filter(c => c.needsAttention).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <TopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        needsAttentionCount={needsAttentionCount}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'inbox' && (
          <InboxView
            conversations={conversations}
            onUpdateConversation={handleUpdateConversation}
            onNavigateToRoutingCase={() => setActiveTab('routing')}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard conversations={conversations} />
        )}

        {activeTab === 'routing' && (
          <RoutingWorkbench
            conversations={conversations}
            routingCase={routingCase}
            onResolveCase={handleResolveRoutingCase}
          />
        )}

        {activeTab === 'imports' && (
          <ImportDeduplicationModal
            conversations={conversations}
            onApplyBatchUpdate={handleApplyBatchUpdate}
            onResetBaseline={handleResetBaseline}
          />
        )}
      </main>
    </div>
  );
}
