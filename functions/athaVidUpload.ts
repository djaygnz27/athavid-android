import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401, headers });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json({ error: "No file provided" }, { status: 400, headers });
    }

    // Convert to bytes for upload
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Use service role to upload
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
