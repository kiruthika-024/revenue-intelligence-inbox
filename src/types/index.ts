export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'nominal';

export type DealStage = 
  | 'Discovery'
  | 'Solution Validation'
  | 'Technical Evaluation'
  | 'Proposal / Negotiation'
  | 'Procurement & Legal'
  | 'Closed Won'
  | 'Closed Lost';

export type RoutingStatus = 
  | 'verified'
  | 'needs_review'
  | 'auto_routed'
  | 'conflict_disputed'
  | 'manually_corrected';

export interface SpeakerSegment {
  id: string;
  speakerName: string;
  speakerRole: 'Sales Rep' | 'Prospect' | 'Executive Sponsor' | 'Technical Evaluator' | 'Procurement';
  speakerCompany: string;
  timestamp: string;
  seconds: number;
  text: string;
  tags?: ('pricing' | 'competitor' | 'objection' | 'timeline' | 'decision_maker' | 'security')[];
}

export interface ActionItem {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  author: string;
  action: string;
  previousValue?: string;
  newValue?: string;
  reason: string;
}

export interface Conversation {
  id: string;
  meetingUid: string;
  title: string;
  accountName: string;
  parentAccount?: string;
  subsidiary?: string;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  assignedRep: string;
  dealSize: number;
  dealStage: DealStage;
  date: string;
  time: string;
  durationMinutes: number;
  platform: 'Zoom' | 'Google Meet' | 'Microsoft Teams';
  riskLevel: RiskLevel;
  riskReason?: string;
  routingStatus: RoutingStatus;
  routingConfidence: number;
  routingExplanation: string;
  needsAttention: boolean;
  attentionReason?: string;
  repTalkPercent: number;
  prospectTalkPercent: number;
  competitorMentions: string[];
  keyObjections: string[];
  executiveSummary: string;
  transcript: SpeakerSegment[];
  actionItems: ActionItem[];
  auditLog: AuditEntry[];
  lastModified: string;
}

export interface DifficultRoutingCase {
  id: string;
  conversationId: string;
  title: string;
  summary: string;
  primaryCandidate: {
    rep: string;
    account: string;
    territory: string;
    rationale: string;
    score: number;
  };
  secondaryCandidate: {
    rep: string;
    account: string;
    territory: string;
    rationale: string;
    score: number;
  };
  conflictFactors: string[];
  recommendedAction: string;
  status: 'pending_manager' | 'resolved_override' | 'split_attributed';
  resolutionNotes?: string;
}

export interface DuplicateTestResult {
  totalProcessed: number;
  identicalDuplicatesSkipped: number;
  conflictsDetected: number;
  newRecordsCreated: number;
  conflictDetails: {
    meetingUid: string;
    conversationTitle: string;
    changes: {
      field: string;
      oldValue: string;
      newValue: string;
    }[];
    resolutionApplied: 'merged_kept_edits' | 'overwritten' | 'skipped';
  }[];
}

export interface ExportManifest {
  manifestVersion: string;
  generatedAt: string;
  generatedBy: string;
  workspaceId: string;
  exportFormat: string;
  totalConversations: number;
  totalPipelineValue: number;
  checksum: string;
  files: {
    filename: string;
    mimeType: string;
    recordCount: number;
    description: string;
    schemaFields: string[];
  }[];
  summaryMetrics: {
    triagedCount: number;
    atRiskDealsCount: number;
    pipelineAtRisk: number;
    averageTalkRatio: string;
    topCompetitors: string[];
  };
}
