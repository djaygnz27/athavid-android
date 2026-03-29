import base44 from "npm:@base44/sdk";

const client = base44({ appId: "69b2ee18a8e6fb58c7f0261c" });

export default async function handler(req: Request): Promise<Response> {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return new Response(JSON.stringify({ error: "No file provided" }), { status: 400, headers });

    // Convert file to buffer and upload via SDK
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Use base44 storage upload
    const result = await (client as any).storage.upload(file.name, uint8Array, file.type);

    return new Response(JSON.stringify({ url: result.url || result.file_url || result.public_url }), { status: 200, headers });
  } catch (err: any) {
    console.error("Upload error:", err);
    return new Response(JSON.stringify({ error: err.message || "Upload failed" }), { status: 500, headers });
  }
}
