import { base44 } from "npm:@base44/sdk";

export default async function handler(req: Request): Promise<Response> {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Upload to Base44 public storage
    const client = base44({ appId: "69b2ee18a8e6fb58c7f0261c" });
    const result = await client.storage.uploadPublic(bytes, {
      filename: file.name || "video.mp4",
      contentType: file.type || "video/mp4",
    });

    const url = result?.url || result?.file_url || result?.public_url;
    if (!url) throw new Error("No URL returned from storage");

    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Upload error:", err?.message || err);
    return new Response(JSON.stringify({ error: err?.message || "Upload failed" }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
}
