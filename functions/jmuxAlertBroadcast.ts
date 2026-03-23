import { createClient } from 'npm:@base44/sdk@0.8.20';

const base44 = createClient({
  appId: Deno.env.get("BASE44_APP_ID")!,
  token: Deno.env.get("BASE44_SERVICE_TOKEN")!,
  serverUrl: Deno.env.get("BASE44_API_URL")!,
});

export default async function jmuxAlertBroadcast(message: string, channels?: string[]) {
  const targetChannels = channels || ["web", "whatsapp"];
  
  await base44.asServiceRole.messaging.broadcast({
    message: message,
    channels: targetChannels
  });
  
  return { success: true, delivered: true };
}
