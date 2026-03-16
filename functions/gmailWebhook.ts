import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    
    // 1. Decode Pub/Sub notification
    const decoded = JSON.parse(atob(body.message.data));
    const currentHistoryId = String(decoded.historyId);

    // 2. Get Gmail access token
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // 3. Load previous historyId
    const existing = await base44.asServiceRole.entities.SyncState.list({ app_id: Deno.env.get('BASE44_APP_ID') });
    const syncRecord = existing.length > 0 ? existing[0] : null;

    if (!syncRecord) {
      await base44.asServiceRole.entities.SyncState.create({ app_id: Deno.env.get('BASE44_APP_ID'), history_id: currentHistoryId });
      return Response.json({ status: 'initialized' });
    }

    // 4. Fetch changes
    const prevHistoryId = syncRecord.history_id;
    const historyRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/history?startHistoryId=${prevHistoryId}&historyTypes=messageAdded`,
      { headers: authHeader }
    );
    if (!historyRes.ok) return Response.json({ status: 'history_error' });
    const historyData = await historyRes.json();

    // 5. Process messages
    if (historyData.history) {
      for (const hist of historyData.history) {
        if (hist.messagesAdded) {
          for (const item of hist.messagesAdded) {
            const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.message.id}?format=full`, { headers: authHeader });
            const msg = await msgRes.json();
            
            const from = msg.payload.headers.find(h => h.name === 'From')?.value || '';
            const subject = msg.payload.headers.find(h => h.name === 'Subject')?.value || '';
            
            // Filter: BMcD, Hawkeye, Nokia
            if (/Burns.*McDonnell|Hawkeye|Nokia|JMUX/i.test(from) || /JMUX/i.test(subject)) {
               // Send notification
               await fetch(`https://sachi-c7f0261c.base44.app/functions/notifyUser`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ message: `New JMUX project email from ${from}: ${subject}` })
               });
            }
          }
        }
      }
    }

    // 6. Update historyId
    await base44.asServiceRole.entities.SyncState.update(syncRecord.id, { app_id: Deno.env.get('BASE44_APP_ID'), history_id: currentHistoryId });
    return Response.json({ status: 'ok' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
