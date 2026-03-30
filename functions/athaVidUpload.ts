import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      }
    });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, {
        status: 401,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json({ error: "No file provided" }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    // Upload the file using Base44 storage
    const uploadedUrl = await base44.storage.upload(file);

    return Response.json({ file_url: uploadedUrl }, {
      headers: { "Access-Control-Allow-Origin": "*" }
    });

  } catch (error) {
    return Response.json({ error: error.message }, {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }
});
