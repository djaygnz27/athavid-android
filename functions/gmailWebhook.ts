
import { createClientFromRequest } from '@base44/sdk';

export default async function handler(req: Request): Promise<Response> {
  const body = await req.json();
  const base44 = createClientFromRequest(req);

  // 1. Decode Pub/Sub notification
  const decoded = JSON.parse(atob(body.data.message.data));
  const currentHistoryId = String(decoded.historyId);

  // 2. Get Gmail access token
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
  const authHeader = { Authorization: `Bearer ${accessToken}` };

  // 3. Load previous historyId from SyncState entity
  const existing = await base44.asServiceRole.entities.SyncState.list();
  const syncRecord = existing.length > 0 ? existing[0] : null;

  if (!syncRecord) {
    await base44.asServiceRole.entities.SyncState.create({ history_id: currentHistoryId });
    return Response.json({ status: 'initialized' });
  }

  const prevHistoryId = syncRecord.history_id;

  // 4. Fetch changes since last known historyId
  const historyRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/history?startHistoryId=${prevHistoryId}&historyTypes=messageAdded`,
    { headers: authHeader }
  );

  if (!historyRes.ok) {
    await base44.asServiceRole.entities.SyncState.update(syncRecord.id, { history_id: currentHistoryId });
    return Response.json({ status: 'history_error' });
  }

  const historyData = await historyRes.json();

  if (!historyData.history || historyData.history.length === 0) {
    await base44.asServiceRole.entities.SyncState.update(syncRecord.id, { history_id: currentHistoryId });
    return Response.json({ status: 'no_new_messages' });
  }

  // 5. Process each new message
  const messageIds: string[] = [];
  for (const h of historyData.history) {
    if (h.messagesAdded) {
      for (const m of h.messagesAdded) {
        messageIds.push(m.message.id);
      }
    }
  }

  const projectKeywords = ['jmux', 'burns', 'mcdonnell', 'b&m', 'hawkeye', 'nokia', 'pseg', 'lipa', 'schedule', 'invoice', 'sow', 'ifr', 'ifc', 'bgp', 'nsp'];
  const projectSenders = ['mcdonnell', 'burnsmcd', 'hawkeye', 'elecnor', 'nokia'];

  for (const msgId of messageIds) {
    const msgRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgId}?format=full`,
      { headers: authHeader }
    );
    if (!msgRes.ok) continue;
    const msg = await msgRes.json();

    const headers = msg.payload?.headers || [];
    const subject = headers.find((h: any) => h.name === 'Subject')?.value || '(no subject)';
    const from = headers.find((h: any) => h.name === 'From')?.value || '';
    const date = headers.find((h: any) => h.name === 'Date')?.value || '';

    // Check if this is a project-relevant email
    const subjectLower = subject.toLowerCase();
    const fromLower = from.toLowerCase();
    const isProjectEmail =
      projectKeywords.some(k => subjectLower.includes(k)) ||
      projectSenders.some(s => fromLower.includes(s));

    if (!isProjectEmail) continue;

    // Get email body
    let body = '';
    const parts = msg.payload?.parts || [];
    const textPart = parts.find((p: any) => p.mimeType === 'text/plain');
    if (textPart?.body?.data) {
      body = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
    } else if (msg.payload?.body?.data) {
      body = atob(msg.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
    }

    // Check for attachments
    const attachments = parts
      .filter((p: any) => p.filename && p.filename.length > 0)
      .map((p: any) => p.filename);

    const attachmentNote = attachments.length > 0
      ? `\n📎 Attachments: ${attachments.join(', ')}`
      : '';

    const snippet = body.substring(0, 400).trim();

    // Notify via agent message
    await base44.asServiceRole.agent.sendMessage(
      `📧 New project email received!\n\n**From:** ${from}\n**Subject:** ${subject}\n**Date:** ${date}${attachmentNote}\n\n**Preview:**\n${snippet}${body.length > 400 ? '...' : ''}\n\nShould I log this or take any action?`
    );
  }

  // 6. Update stored historyId
  await base44.asServiceRole.entities.SyncState.update(syncRecord.id, { history_id: currentHistoryId });

  return Response.json({ status: 'ok', processed: messageIds.length });
}
