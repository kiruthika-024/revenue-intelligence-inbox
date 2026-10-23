import { Conversation, DuplicateTestResult, AuditEntry } from '../types';

export function previewBatchDeduplication(
  currentConversations: Conversation[],
  incomingBatch: Partial<Conversation>[]
): DuplicateTestResult {
  let identicalDuplicatesSkipped = 0;
  let conflictsDetected = 0;
  let newRecordsCreated = 0;
  const conflictDetails: DuplicateTestResult['conflictDetails'] = [];

  const existingMap = new Map<string, Conversation>();
  currentConversations.forEach(c => existingMap.set(c.meetingUid, c));

  incomingBatch.forEach(incoming => {
    if (!incoming.meetingUid) return;

    const existing = existingMap.get(incoming.meetingUid);
    if (!existing) {
      newRecordsCreated++;
      return;
    }

    const changes: { field: string; oldValue: string; newValue: string }[] = [];

    if (incoming.title && incoming.title !== existing.title) {
      changes.push({ field: 'Title', oldValue: existing.title, newValue: incoming.title });
    }
    if (incoming.dealSize !== undefined && incoming.dealSize !== existing.dealSize) {
      changes.push({ 
        field: 'Deal ARR', 
        oldValue: `₹${existing.dealSize.toLocaleString()}`, 
        newValue: `₹${incoming.dealSize.toLocaleString()}` 
      });
    }
    if (incoming.durationMinutes !== undefined && incoming.durationMinutes !== existing.durationMinutes) {
      changes.push({ 
        field: 'Call Duration', 
        oldValue: `${existing.durationMinutes} min`, 
        newValue: `${incoming.durationMinutes} min` 
      });
    }
    if (incoming.dealStage && incoming.dealStage !== existing.dealStage) {
      changes.push({ field: 'Deal Stage', oldValue: existing.dealStage, newValue: incoming.dealStage });
    }
    if (incoming.contactTitle && incoming.contactTitle !== existing.contactTitle) {
      changes.push({ field: 'Contact Title', oldValue: existing.contactTitle, newValue: incoming.contactTitle });
    }

    if (changes.length > 0) {
      conflictsDetected++;
      conflictDetails.push({
        meetingUid: incoming.meetingUid,
        conversationTitle: existing.title,
        changes,
        resolutionApplied: 'merged_kept_edits'
      });
    } else {
      identicalDuplicatesSkipped++;
    }
  });

  return {
    totalProcessed: incomingBatch.length,
    identicalDuplicatesSkipped,
    conflictsDetected,
    newRecordsCreated,
    conflictDetails
  };
}

export function applyBatchImport(
  currentConversations: Conversation[],
  incomingBatch: Partial<Conversation>[],
  strategy: 'smart_merge' | 'overwrite' | 'skip_existing'
): { updatedList: Conversation[]; summary: string } {
  const existingMap = new Map<string, Conversation>();
  currentConversations.forEach(c => existingMap.set(c.meetingUid, { ...c }));

  let inserted = 0;
  let merged = 0;
  let overwritten = 0;
  let skipped = 0;

  incomingBatch.forEach(incoming => {
    if (!incoming.meetingUid) return;

    const existing = existingMap.get(incoming.meetingUid);

    if (!existing) {
      const newConv: Conversation = {
        id: `conv-imported-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        meetingUid: incoming.meetingUid,
        title: incoming.title || 'Untitled Sync Call',
        accountName: incoming.accountName || 'Unassigned Account',
        contactName: incoming.contactName || 'Unassigned Contact',
        contactTitle: incoming.contactTitle || 'Unknown Title',
        contactEmail: incoming.contactEmail || 'unknown@domain.com',
        assignedRep: incoming.assignedRep || 'Sarah Lin',
        dealSize: incoming.dealSize || 50000,
        dealStage: incoming.dealStage || 'Discovery',
        date: incoming.date || new Date().toISOString().split('T')[0],
        time: incoming.time || '10:00 EST',
        durationMinutes: incoming.durationMinutes || 30,
        platform: incoming.platform || 'Zoom',
        riskLevel: incoming.riskLevel || 'nominal',
        routingStatus: 'auto_routed',
        routingConfidence: 90,
        routingExplanation: 'Imported via automated webhook/CSV sync.',
        needsAttention: false,
        repTalkPercent: incoming.repTalkPercent || 50,
        prospectTalkPercent: incoming.prospectTalkPercent || 50,
        competitorMentions: incoming.competitorMentions || [],
        keyObjections: incoming.keyObjections || [],
        executiveSummary: incoming.executiveSummary || 'Synchronized call metadata.',
        transcript: incoming.transcript || [
          {
            id: `seg-imp-${Date.now()}`,
            speakerName: incoming.assignedRep || 'Sales Rep',
            speakerRole: 'Sales Rep',
            speakerCompany: 'RevPulse',
            timestamp: '00:10',
            seconds: 10,
            text: 'Welcome everyone, thank you for joining today.'
          }
        ],
        actionItems: incoming.actionItems || [],
        auditLog: [
          {
            id: `aud-imp-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            author: 'Sync Engine',
            action: 'Record Created via Batch Import',
            newValue: incoming.meetingUid,
            reason: 'New record ingested from batch source.'
          }
        ],
        lastModified: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      existingMap.set(incoming.meetingUid, newConv);
      inserted++;
      return;
    }

    if (strategy === 'skip_existing') {
      skipped++;
      return;
    }

    const hasChanges = 
      (incoming.dealSize !== undefined && incoming.dealSize !== existing.dealSize) ||
      (incoming.durationMinutes !== undefined && incoming.durationMinutes !== existing.durationMinutes) ||
      (incoming.title && incoming.title !== existing.title) ||
      (incoming.dealStage && incoming.dealStage !== existing.dealStage);

    if (!hasChanges) {
      skipped++;
      return;
    }

    if (strategy === 'smart_merge') {
      const auditEntry: AuditEntry = {
        id: `aud-merge-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        author: 'Sync Engine (Smart Merge)',
        action: 'Updated via Webhook Sync',
        previousValue: `ARR: ₹${existing.dealSize}, Dur: ${existing.durationMinutes}m`,
        newValue: `ARR: ₹${incoming.dealSize ?? existing.dealSize}, Dur: ${incoming.durationMinutes ?? existing.durationMinutes}m`,
        reason: 'Automated 3-way merge preserved existing manager audit history.'
      };

      existing.dealSize = incoming.dealSize ?? existing.dealSize;
      existing.durationMinutes = incoming.durationMinutes ?? existing.durationMinutes;
      existing.title = incoming.title ?? existing.title;
      if (incoming.contactTitle) existing.contactTitle = incoming.contactTitle;
      existing.auditLog = [auditEntry, ...existing.auditLog];
      existing.lastModified = new Date().toISOString().replace('T', ' ').substring(0, 19);

      existingMap.set(incoming.meetingUid, existing);
      merged++;
    } else if (strategy === 'overwrite') {
      const auditEntry: AuditEntry = {
        id: `aud-ovr-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        author: 'Sync Engine (Full Overwrite)',
        action: 'Overwrote Record with Incoming Batch',
        reason: 'Manager selected full overwrite mode.'
      };

      const overwrittenConv: Conversation = {
        ...existing,
        ...incoming,
        auditLog: [auditEntry, ...existing.auditLog],
        lastModified: new Date().toISOString().replace('T', ' ').substring(0, 19)
      } as Conversation;

      existingMap.set(incoming.meetingUid, overwrittenConv);
      overwritten++;
    }
  });

  const updatedList = Array.from(existingMap.values());
  const summary = `Batch complete: ${inserted} created, ${merged} smart-merged, ${overwritten} overwritten, ${skipped} identical records skipped.`;

  return { updatedList, summary };
}
