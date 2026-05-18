import { createServiceRoleClient } from 'npm:@base44/sdk@0.8.25';

const ALLOWED_ENTITIES = [
  "SachiVideo","SachiComment","SachiLike","SachiHype","SachiBookmark",
  "Follow","UserInterest","FoundingCreator","SachiPodcastEpisode",
  "AthaVidUser","SachiPodcast","SachiReport","SachiNotification","SachiBlock","SachiMessage",
];

Deno.serve(async (req: Request) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

  try {
    const url = new URL(req.url);
    const entityName = url.searchParams.get("entity");
    const pageSize = Math.min(parseInt(url.searchParams.get("limit") || "500"), 500);

    if (!entityName) {
      return Response.json({ error: "Missing ?entity= param", allowed: ALLOWED_ENTITIES }, { status: 400, headers: cors });
    }
    if (!ALLOWED_ENTITIES.includes(entityName)) {
      return Response.json({ error: `Not allowed: ${entityName}`, allowed: ALLOWED_ENTITIES }, { status: 400, headers: cors });
    }

    const base44 = createServiceRoleClient();
    const db = base44.entities as any;

    // Paginate all records
    const allRecords: any[] = [];
    let skip = 0;
    for (let page = 0; page < 100; page++) {
      const batch = await db[entityName].list({ limit: pageSize, skip });
      const records = Array.isArray(batch) ? batch : (batch?.records || []);
      if (!records.length) break;
      allRecords.push(...records);
      if (records.length < pageSize) break;
      skip += pageSize;
    }

    // Serialize
    const payload = {
      entity: entityName,
      exported_at: new Date().toISOString(),
      total_records: allRecords.length,
      records: allRecords,
    };
    const bytes = new TextEncoder().encode(JSON.stringify(payload, null, 2));
    const filename = `export_${entityName}_${Date.now()}.json`;

    // Upload to Base44 public storage
    const uploadResult = await (base44 as any).storage.uploadPublic(bytes, {
      filename,
      contentType: "application/json",
    });
    const fileUrl = uploadResult?.url || uploadResult?.file_url || uploadResult?.public_url || uploadResult;

    if (!fileUrl || typeof fileUrl !== "string") {
      throw new Error(`Storage returned no URL: ${JSON.stringify(uploadResult)}`);
    }

    return Response.json({
      success: true,
      entity: entityName,
      total_records: allRecords.length,
      file_url: fileUrl,
      filename,
    }, { headers: cors });

  } catch (err: any) {
    return Response.json({ error: err?.message || String(err) }, { status: 500, headers: cors });
  }
});
