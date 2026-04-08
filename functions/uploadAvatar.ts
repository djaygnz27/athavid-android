import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json().catch(() => ({}));
    const { image_base64, mime_type = "image/jpeg", entity_id } = body;

    if (!image_base64) {
      return Response.json({ error: "image_base64 required" }, { status: 400 });
    }

    // Strip data URL prefix if present
    const base64Data = image_base64.replace(/^data:[^,]+,/, "");

    // Convert base64 to binary
    const binaryStr = atob(base64Data);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mime_type });

    // Upload to Base44 CDN using service role
    const form = new FormData();
    form.append("file", blob, "avatar.jpg");

    const serviceToken = Deno.env.get("BASE44_SERVICE_TOKEN");
    const appId = Deno.env.get("BASE44_APP_ID") || "69b2ee18a8e6fb58c7f0261c";

    const uploadRes = await fetch(
      `https://sachi-c7f0261c.base44.app/api/apps/${appId}/integration-endpoints/Core/UploadFile`,
      {
        method: "POST",
        headers: serviceToken ? { "Authorization": `Bearer ${serviceToken}` } : {},
        body: form
      }
    );

    const uploadText = await uploadRes.text();
    let uploadData: any;
    try { uploadData = JSON.parse(uploadText); } catch(_) { throw new Error(`Upload failed: ${uploadText.slice(0, 100)}`); }

    if (!uploadRes.ok || uploadData.error) {
      throw new Error(uploadData.error || uploadData.message || "Upload failed");
    }

    const file_url = uploadData.file_url;

    // If entity_id provided, update AthaVidUser record directly via service role
    if (entity_id && file_url) {
      try {
        await base44.asServiceRole.entities.AthaVidUser.update(entity_id, { avatar_url: file_url });
      } catch(e: any) {
        console.warn("Entity update failed:", e.message);
        // Don't fail the whole request — file_url is still valid
      }
    }

    return Response.json({ file_url });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
