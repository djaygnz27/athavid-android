import { createClient } from 'npm:@base44/sdk';

Deno.serve(async (req) => {
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });

  const body = await req.json().catch(() => ({}));
  const { entityName, records } = body;
  if (!entityName || !records) return Response.json({ error: "entityName and records required" }, { status: 400 });

  try {
    // Use createClient with env vars — works from external callers
    const base44 = createClient({
      appId: Deno.env.get("BASE44_APP_ID"),
      token: Deno.env.get("BASE44_SERVICE_TOKEN"),
      serverUrl: Deno.env.get("BASE44_API_URL"),
    });

    const created = await base44.asServiceRole.entities[entityName].bulkCreate(records);
    return Response.json({ created, count: created?.length ?? 0 });
  } catch (err) {
    return Response.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
});
