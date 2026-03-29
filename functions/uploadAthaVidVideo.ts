import base44 from "../app/base44_client.ts";

export default async function handler(req: Request): Promise<Response> {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400, headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    // Upload to base44 storage
    const uploadResult = await base44.storage.upload(file);

    return new Response(JSON.stringify({ file_url: uploadResult.file_url || uploadResult.url }), {
      status: 200, headers: { ...headers, "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Upload failed" }), {
      status: 500, headers: { ...headers, "Content-Type": "application/json" }
    });
  }
}
