import { Conversation, DifficultRoutingCase } from '../types';

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-8821',
    meetingUid: 'ZOOM-8821-20261018',
    title: 'Acme Cloud Q4 Security & London Expansion Sync',
    accountName: 'Acme Global Holdings',
    parentAccount: 'Acme Global Holdings (US-HQ)',
    subsidiary: 'Acme Cloud Europe Ltd (UK-EMEA)',
    contactName: 'Dr. Elena Weber',
    contactTitle: 'VP of Technical Operations, EMEA',
    contactEmail: 'elena.weber@acmecloud.co.uk',
    assignedRep: 'Sarah Lin',
    dealSize: 240000,
    dealStage: 'Proposal / Negotiation',
    date: '2026-10-18',
    time: '14:00 GMT',
    durationMinutes: 42,
    platform: 'Zoom',
    riskLevel: 'critical',
    riskReason: 'Late-stage competitor displacement attempt (Clari & Gong) + Multi-entity territory dispute between EMEA and Global Enterprise reps.',
    routingStatus: 'conflict_disputed',
    routingConfidence: 54,
    routingExplanation: 'Prospect is VP of EMEA subsidiary (matches David Vance territory: UK/EMEA), but billing entity on master contract is Acme Global US-HQ (Sarah Lin territory). Transcript references both global MSA and London datacenter rollout.',
    needsAttention: true,
    attentionReason: 'Routing territory collision + Competitor price matching demand requires sales director override.',
    repTalkPercent: 59,
    prospectTalkPercent: 41,
    competitorMentions: ['Clari', 'Gong', 'Salesforce Revenue Cloud'],
    keyObjections: ['EMEA Data Residency', 'Competitor Bundle Discount (-22%)', 'Multi-tenant latency concerns'],
    executiveSummary: 'Elena Weber reviewed the proposed ₹240k expansion for 350 seats across London & Frankfurt engineering teams. However, Clari offered an aggressive 22% enterprise bundle discount. Elena requires our commitment to European data residency and requested revised pricing by Friday. Severe internal rep conflict on deal attribution.',
    transcript: [
      {
        id: 'seg-1',
        speakerName: 'Sarah Lin',
        speakerRole: 'Sales Rep',
        speakerCompany: 'RevPulse',
        timestamp: '00:15',
        seconds: 15,
        text: 'Elena, great to reconnect. We took your technical team through the sandbox last Tuesday. Today I want to walk through the commercial proposal for the EMEA rollout under Acme Global’s master service agreement.'
      },
      {
        id: 'seg-2',
        speakerName: 'Dr. Elena Weber',
        speakerRole: 'Executive Sponsor',
        speakerCompany: 'Acme Cloud Europe Ltd',
        timestamp: '02:40',
        seconds: 160,
        text: 'Thanks Sarah. Look, our engineering leads in London love the UI speed, but I have to be candid with you. We met with Clari and Gong two days ago. Gong is packaging conversation intelligence with forecast rollups at a 22% lower seat price if we sign their annual EMEA rider.',
        tags: ['pricing', 'competitor']
      },
      {
        id: 'seg-3',
        speakerName: 'Sarah Lin',
        speakerRole: 'Sales Rep',
        speakerCompany: 'RevPulse',
        timestamp: '04:10',
        seconds: 250,
        text: 'Understood. Keep in mind that Gong’s audio processing runs through US-East clusters unless you pay for their dedicated Frankfurt enclave, whereas RevPulse guarantees zero cross-border transit for EU voice streams.'
      },
      {
        id: 'seg-4',
        speakerName: 'Dr. Elena Weber',
        speakerRole: 'Executive Sponsor',
        speakerCompany: 'Acme Cloud Europe Ltd',
        timestamp: '14:22',
        seconds: 862,
        text: 'That data boundary is critical for our FCA audit. If your VP of Sales can approve matching within 10% of Gong’s proposal and give us the London datacenter SLA in writing, I can approve the signature under our UK entity before end of month.',
        tags: ['pricing', 'competitor', 'decision_maker']
      },
      {
        id: 'seg-5',
        speakerName: 'Sarah Lin',
        speakerRole: 'Sales Rep',
        speakerCompany: 'RevPulse',
        timestamp: '16:50',
        seconds: 1010,
        text: 'I will escalate this directly to our revenue director today. We will send the amended quote and the security exhibit by Thursday 10 AM BST.'
      }
    ],
    actionItems: [
      {
        id: 'act-1',
        title: 'Escalate Gong price match (-12% compromise) to Sales Director',
        assignee: 'Sarah Lin',
        dueDate: '2026-10-23',
        completed: false,
        priority: 'high'
      },
      {
        id: 'act-2',
        title: 'Attach London Datacenter SOC2 Type II and FCA compliance addendum',
        assignee: 'David Vance',
        dueDate: '2026-10-24',
        completed: false,
        priority: 'high'
      },
      {
        id: 'act-3',
        title: 'Manager Decision: Resolve attribution dispute between Sarah Lin & David Vance',
        assignee: 'Sales Manager',
        dueDate: '2026-10-23',
        completed: false,
        priority: 'high'
      }
    ],
    auditLog: [
      {
        id: 'aud-1',
        timestamp: '2026-10-18 14:48:10',
        author: 'System (Routing Rule #104)',
        action: 'Flagged Ambiguous Entity',
        previousValue: 'Unrouted Queue',
        newValue: 'Needs Manager Triage',
        reason: 'Contact email @acmecloud.co.uk conflicts with account owner Sarah Lin (Acme Global US).'
      }
    ],
    lastModified: '2026-10-18 14:48:10'
  },
  {
    id: 'conv-8819',
    meetingUid: 'TEAMS-8819-20261016',
    title: 'CloudScale Bank - Infosec Architecture Review & Data Governance',
    accountName: 'CloudScale Banking Corp',
    contactName: 'Marcus Vance',
    contactTitle: 'Chief Information Security Officer',
    contactEmail: 'm.vance@cloudscalebank.com',
    assignedRep: 'David Vance',
    dealSize: 380000,
    dealStage: 'Procurement & Legal',
    date: '2026-10-16',
    time: '11:00 EST',
    durationMinutes: 55,
    platform: 'Microsoft Teams',
    riskLevel: 'critical',
    riskReason: 'Prospect CISO halted legal signoff due to unresolved GDPR Article 28 data residency addendum. Follow-up unassigned for 6 business days.',
    routingStatus: 'verified',
    routingConfidence: 96,
    routingExplanation: 'Enterprise Strategic Account mapped to David Vance based on Tier 1 Banking territory.',
    needsAttention: true,
    attentionReason: 'Ghosting / Stall signal: 8 days with zero customer activity following security pushback.',
    repTalkPercent: 42,
    prospectTalkPercent: 58,
    competitorMentions: ['Palo Alto Networks', 'SailPoint'],
    keyObjections: ['Data Retention Policy', 'Subprocessor Audit Rights', 'Customer-Managed Encryption Keys (CMEK)'],
    executiveSummary: 'CloudScale Bank CISO Marcus Vance expressed strong hesitation regarding third-party AI subprocessor retention. If audio snippets are stored longer than 24 hours without customer-managed KMS encryption, their legal team will veto the contract. Urgent manager intervention required.',
    transcript: [
      {
        id: 'cs-1',
        speakerName: 'Marcus Vance',
        speakerRole: 'Technical Evaluator',
        speakerCompany: 'CloudScale Banking Corp',
        timestamp: '03:10',
        seconds: 190,
        text: 'David, our legal council reviewed Exhibit B. The standard policy allows 30-day retention of call transcripts on your backup snapshots. Under FINRA and NYDFS Part 500, we cannot accept that without dedicated KMS keys.',
        tags: ['security', 'objection']
      },
      {
        id: 'cs-2',
        speakerName: 'David Vance',
        speakerRole: 'Sales Rep',
        speakerCompany: 'RevPulse',
        timestamp: '07:45',
        seconds: 465,
        text: 'We do support BYOK (Bring Your Own Key) on our Enterprise Dedicated tier, Marcus. But it adds approximately ₹25,000 to the annual infrastructure fee.'
      },
      {
        id: 'cs-3',
        speakerName: 'Marcus Vance',
        speakerRole: 'Technical Evaluator',
        speakerCompany: 'CloudScale Banking Corp',
        timestamp: '12:30',
        seconds: 750,
        text: 'We are not paying extra for basic regulatory compliance. Either that is absorbed in the ₹380k proposal, or we pause the procurement cycle right here.',
        tags: ['pricing', 'objection', 'security']
      }
    ],
    actionItems: [
      {
        id: 'act-cs-1',
        title: 'Submit SecOps exception for BYOK waiver to Head of Product',
        assignee: 'David Vance',
        dueDate: '2026-10-21',
        completed: false,
        priority: 'high'
      },
      {
        id: 'act-cs-2',
        title: 'Executive check-in: VP Sales to email CloudScale CISO',
        assignee: 'Sales Manager',
        dueDate: '2026-10-22',
        completed: false,
        priority: 'high'
      }
    ],
    auditLog: [
      {
        id: 'aud-cs-1',
        timestamp: '2026-10-16 12:05:00',
        author: 'System',
        action: 'Routed to David Vance',
        newValue: 'David Vance',
        reason: 'Account named in Strategic Accounts list.'
      }
    ],
    lastModified: '2026-10-16 12:05:00'
  },
  {
    id: 'conv-8824',
    meetingUid: 'MEET-8824-20261019',
    title: 'NovaHealth - Mid-Market Expansion & Pricing Restructure',
    accountName: 'NovaHealth Systems',
    contactName: 'Claire Zhang',
    contactTitle: 'Director of Patient Experience',
    contactEmail: 'czhang@novahealth.org',
    assignedRep: 'Marcus Thorne',
    dealSize: 65000,
    dealStage: 'Solution Validation',
    date: '2026-10-19',
    time: '15:30 EST',
    durationMinutes: 38,
    platform: 'Google Meet',
    riskLevel: 'high',
    riskReason: 'Rep over-talking (76% talk time); prospect raised strong objections to tiered per-seat fee model.',
    routingStatus: 'verified',
    routingConfidence: 98,
    routingExplanation: 'Healthcare mid-market vertical routed to Marcus Thorne.',
    needsAttention: true,
    attentionReason: 'Rep coaching alert: Talk ratio 76% (manager threshold is 60%). Prospect felt unheard on pricing model.',
    repTalkPercent: 76,
    prospectTalkPercent: 24,
    competitorMentions: ['Zoom Revenue Accelerator', 'Apollo.io'],
    keyObjections: ['Per-Seat Pricing vs Usage Pool', 'Nurse Onboarding Complexity'],
    executiveSummary: 'Claire Zhang was interested in call transcription for 120 care coordinators, but voiced strong fatigue around rigid per-seat licensing. Marcus spoke 76% of the meeting presenting standard slides rather than answering her specific pool licensing question. Coaching required.',
    transcript: [
      {
        id: 'nh-1',
        speakerName: 'Marcus Thorne',
        speakerRole: 'Sales Rep',
        speakerCompany: 'RevPulse',
        timestamp: '02:00',
        seconds: 120,
        text: 'Let me show you another 8 slides on our automated sentiment classification model and how it tags emotion in patient calls.'
      },
      {
        id: 'nh-2',
        speakerName: 'Claire Zhang',
        speakerRole: 'Prospect',
        speakerCompany: 'NovaHealth Systems',
        timestamp: '08:15',
        seconds: 495,
        text: 'Marcus, sorry to interrupt, but our coordinators work staggered shifts. Can 3 shift workers share one pool license, or do we have to pay ₹8,500 per individual name?',
        tags: ['pricing', 'objection']
      },
      {
        id: 'nh-3',
        speakerName: 'Marcus Thorne',
        speakerRole: 'Sales Rep',
        speakerCompany: 'RevPulse',
        timestamp: '09:00',
        seconds: 540,
        text: 'Our terms require named users. Now moving on to slide 14, let me explain our enterprise analytics dashboard.'
      }
    ],
    actionItems: [
      {
        id: 'act-nh-1',
        title: 'Review call recording with Marcus for active listening coaching',
        assignee: 'Sales Manager',
        dueDate: '2026-10-24',
        completed: false,
        priority: 'medium'
      },
      {
        id: 'act-nh-2',
        title: 'Draft flexible concurrent user licensing proposal for NovaHealth',
        assignee: 'Marcus Thorne',
        dueDate: '2026-10-25',
        completed: false,
        priority: 'high'
      }
    ],
    auditLog: [
      {
        id: 'aud-nh-1',
        timestamp: '2026-10-19 16:15:22',
        author: 'System',
        action: 'Calculated Talk Ratio Alert',
        newValue: '76% Rep Talk Ratio',
        reason: 'Flagged for sales manager coaching.'
      }
    ],
    lastModified: '2026-10-19 16:15:22'
  },
  {
    id: 'conv-8830',
    meetingUid: 'ZOOM-8830-20261020',
    title: 'DataFlow Systems - Procurement & Final Contract Calibration',
    accountName: 'DataFlow Systems Inc',
    contactName: 'Brian Kelleher',
    contactTitle: 'VP of Engineering',
    contactEmail: 'bkelleher@dataflow.io',
    assignedRep: 'Sarah Lin',
    dealSize: 110000,
    dealStage: 'Procurement & Legal',
    date: '2026-10-20',
    time: '16:00 EST',
    durationMinutes: 30,
    platform: 'Zoom',
    riskLevel: 'low',
    riskReason: 'Nominal procurement negotiation; high executive sponsorship and positive sentiment.',
    routingStatus: 'verified',
    routingConfidence: 99,
    routingExplanation: 'Enterprise account assigned to Sarah Lin.',
    needsAttention: false,
    repTalkPercent: 48,
    prospectTalkPercent: 52,
    competitorMentions: [],
    keyObjections: ['Net 45 vs Net 30 payment terms'],
    executiveSummary: 'Smooth procurement sync. Brian agreed to standard SaaS agreement pending Net 45 payment terms adjustment. Contract expected to close by end of week.',
    transcript: [
      {
        id: 'df-1',
        speakerName: 'Brian Kelleher',
        speakerRole: 'Executive Sponsor',
        speakerCompany: 'DataFlow Systems Inc',
        timestamp: '01:10',
        seconds: 70,
        text: 'Sarah, the team is thrilled with the test results. We only need finance to confirm Net 45 terms and we will countersign.',
        tags: ['timeline']
      }
    ],
    actionItems: [
      {
        id: 'act-df-1',
        title: 'Approve Net 45 payment term modification in DocuSign',
        assignee: 'Sarah Lin',
        dueDate: '2026-10-22',
        completed: true,
        priority: 'medium'
      }
    ],
    auditLog: [],
    lastModified: '2026-10-20 16:35:00'
  },
  {
    id: 'conv-8835',
    meetingUid: 'TEAMS-8835-20261021',
    title: 'Vertex Logistics - Legal Redline Review & Liability Cap Negotiation',
    accountName: 'Vertex Logistics Group',
    contactName: 'Rachel Simmons',
    contactTitle: 'Senior Corporate Legal Counsel',
    contactEmail: 'r.simmons@vertexlogistics.com',
    assignedRep: 'David Vance',
    dealSize: 190000,
    dealStage: 'Proposal / Negotiation',
    date: '2026-10-21',
    time: '10:00 EST',
    durationMinutes: 45,
    platform: 'Microsoft Teams',
    riskLevel: 'medium',
    riskReason: 'Legal standoff on 2x vs 1x aggregate liability cap.',
    routingStatus: 'verified',
    routingConfidence: 94,
    routingExplanation: 'Logistics vertical enterprise account assigned to David Vance.',
    needsAttention: true,
    attentionReason: 'General Counsel approval needed on ₹380k mutual indemnification limit.',
    repTalkPercent: 51,
    prospectTalkPercent: 49,
    competitorMentions: ['Outreach'],
    keyObjections: ['Limitation of Liability', 'Uptime SLA Penalty Credits'],
    executiveSummary: 'Legal review went smoothly on privacy and IP terms, but Vertex legal insists on a 2x contract value liability cap for confidentiality breaches. Legal team consultation required.',
    transcript: [
      {
        id: 'vx-1',
        speakerName: 'Rachel Simmons',
        speakerRole: 'Procurement',
        speakerCompany: 'Vertex Logistics Group',
        timestamp: '05:30',
        seconds: 330,
        text: 'David, our standard commercial threshold requires 2x annual contract value for breach indemnity. If you can meet us there, we can execute before month end.',
        tags: ['objection', 'timeline']
      }
    ],
    actionItems: [
      {
        id: 'act-vx-1',
        title: 'Review 2x liability rider with General Counsel',
        assignee: 'David Vance',
        dueDate: '2026-10-23',
        completed: false,
        priority: 'high'
      }
    ],
    auditLog: [],
    lastModified: '2026-10-21 11:00:00'
  },
  {
    id: 'conv-8840',
    meetingUid: 'MEET-8840-20261021',
    title: 'Apex BioTech - Founder & CTO Discovery Call',
    accountName: 'Apex BioTech Labs',
    contactName: 'Julian Vance-Meyer',
    contactTitle: 'Co-Founder & CTO',
    contactEmail: 'julian@apexbio.io',
    assignedRep: 'Marcus Thorne',
    dealSize: 85000,
    dealStage: 'Discovery',
    date: '2026-10-21',
    time: '13:00 EST',
    durationMinutes: 28,
    platform: 'Google Meet',
    riskLevel: 'nominal',
    routingStatus: 'auto_routed',
    routingConfidence: 91,
    routingExplanation: 'Auto-routed via domain match apexbio.io to Marcus Thorne (Life Sciences portfolio).',
    needsAttention: false,
    repTalkPercent: 38,
    prospectTalkPercent: 62,
    competitorMentions: [],
    keyObjections: [],
    executiveSummary: 'Excellent discovery meeting. Julian shared pain points around manual CRM note taking across their 45 genomics researchers. Scheduled live workflow demo for next Tuesday.',
    transcript: [
      {
        id: 'ap-1',
        speakerName: 'Julian Vance-Meyer',
        speakerRole: 'Executive Sponsor',
        speakerCompany: 'Apex BioTech Labs',
        timestamp: '03:15',
        seconds: 195,
        text: 'Our team spends 6 hours a week typing notes into HubSpot. If you can extract compliance markers automatically, we will deploy this across the entire scientific relations division.',
        tags: ['decision_maker']
      }
    ],
    actionItems: [
      {
        id: 'act-ap-1',
        title: 'Prepare customized HubSpot bidirectional sync demo',
        assignee: 'Marcus Thorne',
        dueDate: '2026-10-26',
        completed: false,
        priority: 'medium'
      }
    ],
    auditLog: [],
    lastModified: '2026-10-21 13:35:00'
  },
  {
    id: 'conv-8845',
    meetingUid: 'ZOOM-8845-20261022',
    title: 'SwiftPay - Inbound Qualification Call',
    accountName: 'SwiftPay Micro-Credit',
    contactName: 'Tamara Woods',
    contactTitle: 'Head of Operations',
    contactEmail: 't.woods@swiftpay.cc',
    assignedRep: 'Sarah Lin',
    dealSize: 30000,
    dealStage: 'Closed Lost',
    date: '2026-10-22',
    time: '09:30 EST',
    durationMinutes: 18,
    platform: 'Zoom',
    riskLevel: 'low',
    riskReason: 'Disqualified due to unaccredited micro-lending compliance restrictions.',
    routingStatus: 'verified',
    routingConfidence: 95,
    routingExplanation: 'Inbound pool assigned to Sarah Lin.',
    needsAttention: false,
    repTalkPercent: 50,
    prospectTalkPercent: 50,
    competitorMentions: [],
    keyObjections: ['Compliance Eligibility'],
    executiveSummary: 'SwiftPay does not meet our minimum customer security profile (no active SOC2 or registered financial charter). Disqualified in accordance with company risk policy.',
    transcript: [
      {
        id: 'sp-1',
        speakerName: 'Sarah Lin',
        speakerRole: 'Sales Rep',
        speakerCompany: 'RevPulse',
        timestamp: '12:00',
        seconds: 720,
        text: 'Because your credit entity is offshore without registered audit oversight, our compliance policy prevents us from hosting sensitive transaction audio.'
      }
    ],
    actionItems: [],
    auditLog: [
      {
        id: 'aud-sp-1',
        timestamp: '2026-10-22 10:00:00',
        author: 'Sarah Lin',
        action: 'Stage Changed to Closed Lost',
        previousValue: 'Discovery',
        newValue: 'Closed Lost',
        reason: 'Failed minimum risk charter.'
      }
    ],
    lastModified: '2026-10-22 10:00:00'
  },
  {
    id: 'conv-8850',
    meetingUid: 'ZOOM-8850-20261022',
    title: 'Horizon Retail Group - Annual Multi-Year Renewal & Enterprise Add-on',
    accountName: 'Horizon Retail Group',
    contactName: 'Arthur Pendelton',
    contactTitle: 'VP of Commercial Technology',
    contactEmail: 'a.pendelton@horizonretail.com',
    assignedRep: 'David Vance',
    dealSize: 310000,
    dealStage: 'Proposal / Negotiation',
    date: '2026-10-22',
    time: '11:00 EST',
    durationMinutes: 48,
    platform: 'Zoom',
    riskLevel: 'medium',
    riskReason: 'Competitor mention (Apollo.io and Outreach) during renewal pricing negotiation.',
    routingStatus: 'verified',
    routingConfidence: 97,
    routingExplanation: 'Strategic Enterprise account assigned to David Vance.',
    needsAttention: true,
    attentionReason: 'Multi-year discount request (15% concession) requires manager signoff.',
    repTalkPercent: 47,
    prospectTalkPercent: 53,
    competitorMentions: ['Apollo.io', 'Outreach.io'],
    keyObjections: ['Annual price escalation cap (3% vs 5%)', 'Multi-year commitment discount'],
    executiveSummary: 'Arthur wants to commit to a 3-year agreement for 400 seats if we cap annual renewal inflators at 3% and grant a 12% multi-year prepayment concession. Strong renewal candidate.',
    transcript: [
      {
        id: 'hr-1',
        speakerName: 'Arthur Pendelton',
        speakerRole: 'Executive Sponsor',
        speakerCompany: 'Horizon Retail Group',
        timestamp: '06:10',
        seconds: 370,
        text: 'Outreach offered to lock our rate for 36 months with zero annual escalator. David, if you can cap our escalation at 3%, I will countersign before noon tomorrow.',
        tags: ['pricing', 'competitor', 'timeline']
      }
    ],
    actionItems: [
      {
        id: 'act-hr-1',
        title: 'Issue 3-year MSA rider with 3% escalator cap',
        assignee: 'David Vance',
        dueDate: '2026-10-23',
        completed: false,
        priority: 'high'
      }
    ],
    auditLog: [],
    lastModified: '2026-10-22 12:10:00'
  }
];

export const DIFFICULT_ROUTING_CASE: DifficultRoutingCase = {
  id: 'case-8821',
  conversationId: 'conv-8821',
  title: 'Acme Cloud Q4 Security & London Expansion Sync (Meeting #ZOOM-8821)',
  summary: 'A ₹240,000 deal involving Dr. Elena Weber. Collision between EMEA Territory Rep (David Vance) and Global Parent Account Rep (Sarah Lin).',
  primaryCandidate: {
    rep: 'Sarah Lin',
    account: 'Acme Global Holdings (US-HQ)',
    territory: 'US Enterprise Strategic Accounts',
    rationale: 'Holds the existing Master Services Agreement (MSA #AG-2024-88) signed at corporate headquarters in Delaware. Billing and global vendor risk reviews run through US procurement.',
    score: 54
  },
  secondaryCandidate: {
    rep: 'David Vance',
    account: 'Acme Cloud Europe Ltd (UK-EMEA)',
    territory: 'EMEA Enterprise Accounts (UK/EU)',
    rationale: 'Prospect contact Dr. Elena Weber is based in London. The deal is funded out of the European operating budget, requires UK FCA data sovereignty exhibits, and requires local deployment.',
    score: 46
  },
  conflictFactors: [
    'Parent/Subsidiary Hierarchy: Master MSA belongs to US Global Parent, but budget authorization originates from UK operating subsidiary.',
    'Domain Discrepancy: Invitee domain @acmecloud.co.uk is registered to EMEA entity, while CRM parent record is @acme-global.com.',
    'Territory Inequity: Both reps worked this cycle — Sarah negotiated the corporate rate rider, while David hosted the London security deep dive.',
    'Commission Disincentive: Zero-sum 100% attribution will demotivate whichever rep loses credit for the ₹240k ARR.'
  ],
  recommendedAction: 'Apply Dual-Credit Split Attribution (60% EMEA / 40% Global Parent) or Reassign Subsidiary Account ownership to David Vance while crediting Sarah Lin with Global Parent quota relief.',
  status: 'pending_manager'
};

export const UPDATE_TEST_BATCH: Partial<Conversation>[] = [
  {
    meetingUid: 'ZOOM-8830-20261020',
    title: 'DataFlow Systems - Procurement & Final Contract Calibration',
    accountName: 'DataFlow Systems Inc',
    contactName: 'Brian Kelleher',
    contactTitle: 'VP of Engineering',
    contactEmail: 'bkelleher@dataflow.io',
    assignedRep: 'Sarah Lin',
    dealSize: 110000,
    dealStage: 'Procurement & Legal',
    date: '2026-10-20',
    durationMinutes: 30,
    platform: 'Zoom'
  },
  {
    meetingUid: 'ZOOM-8821-20261018',
    title: 'Acme Cloud Q4 Security & London Expansion Sync [UPDATED AUDIO BATCH]',
    accountName: 'Acme Global Holdings',
    contactName: 'Dr. Elena Weber',
    contactTitle: 'VP of Technical Operations, EMEA',
    contactEmail: 'elena.weber@acmecloud.co.uk',
    assignedRep: 'Sarah Lin',
    dealSize: 265000,
    dealStage: 'Proposal / Negotiation',
    date: '2026-10-18',
    durationMinutes: 48,
    platform: 'Zoom'
  },
  {
    meetingUid: 'MEET-8824-20261019',
    title: 'NovaHealth - Mid-Market Expansion & Pricing Restructure',
    accountName: 'NovaHealth Systems',
    contactName: 'Claire Zhang',
    contactTitle: 'VP of Care Operations',
    contactEmail: 'czhang@novahealth.org',
    assignedRep: 'Marcus Thorne',
    dealSize: 78000,
    dealStage: 'Proposal / Negotiation',
    date: '2026-10-19',
    durationMinutes: 38,
    platform: 'Google Meet'
  },
  {
    meetingUid: 'ZOOM-8860-20261022',
    title: 'Krypton Cyber - Zero-Trust RevOps Architecture Deep Dive',
    accountName: 'Krypton Cyber Systems',
    contactName: 'Sanjay Patel',
    contactTitle: 'VP of Revenue Operations',
    contactEmail: 'sanjay@kryptoncyber.com',
    assignedRep: 'Sarah Lin',
    dealSize: 155000,
    dealStage: 'Technical Evaluation',
    date: '2026-10-22',
    time: '16:00 EST',
    durationMinutes: 40,
    platform: 'Zoom'
  }
];
