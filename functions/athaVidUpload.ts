import { createClientFromRequest, createServiceRoleClient } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  // ── GET /api/functions/athaVidUpload?feed=1  →  public feed ──
  if (req.method === "GET") {
    try {
      const base44 = createServiceRoleClient();
      const records = await base44.entities.SachiVideo.filter(
        { is_approved: true, is_archived: false },
        { sort: "-created_date", limit: 100 }
      );
      return Response.json(Array.isArray(records) ? records : records?.records || [], { headers });
    } catch (err) {
      return Response.json({ error: String(err) }, { status: 500, headers });
    }
  }

  // ── POST /api/functions/athaVidUpload  →  file upload ──
  try {
    const base44 = createClientFromRequest(req);

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json({ error: "No file provided" }, { status: 400, headers });
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const result = await base44.asServiceRole.storage.uploadPublic(bytes, {
      filename: file.name || "upload.mp4",
      contentType: file.type || "video/mp4",
    });

    const url = result?.url || result?.file_url || result?.public_url || result;
    if (!url) throw new Error("No URL returned from storage");

    return Response.json({ file_url: url }, { headers });

  } catch (error) {
    console.error("Upload error:", error?.message || error);
    return Response.json({ error: error.message || "Upload failed" }, { status: 500, headers });
  }
});
