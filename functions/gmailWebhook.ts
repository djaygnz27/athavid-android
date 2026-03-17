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
    const existing = await base44.asServiceRole.entities.SyncState.list();
    const syncRecord = existing.length > 0 ? existing[0] : null;

    if (!syncRecord) {
      await base44.asServiceRole.entities.SyncState.create({ history_id: currentHistoryId });
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

    if (historyData.history) {
      for (const hist of historyData.history) {
        if (hist.messagesAdded) {
          for (const item of hist.messagesAdded) {
            const msgId = item.message.id;
            const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgId}`, { headers: authHeader });
            const msg = await msgRes.json();
            
            // Check headers for JMUX project senders
            const from = msg.payload.headers.find(h => h.name === 'From')?.value || '';
            const subject = msg.payload.headers.find(h => h.name === 'Subject')?.value || '';
            
            const projectSenders = ['burnsmcd.com', 'hawkeye', 'nokia.com', 'pseg.com'];
            if (projectSenders.some(sender => from.toLowerCase().includes(sender))) {
                // Trigger notification to user
                await fetch('https://api.base44.com/v1/broadcast', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${process.env.BASE44_SERVICE_TOKEN}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: `New Project Email: ${subject}\nFrom: ${from}\n\nI'll parse the details now.`,
                        channels: ['whatsapp']
                    })
                });
            }
          }
        }
      }
    }

    // 5. Update sync state
    await base44.asServiceRole.entities.SyncState.update(syncRecord.id, { history_id: currentHistoryId });
    
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
