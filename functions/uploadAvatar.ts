import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json().catch(() => ({}));
    const { image_base64, mime_type = "image/jpeg", entity_id } = body;

    if (!image_base64) {
      return Response.json({ error: "image_base64 required" }, { status: 400 });
    }

    let file_url: string;

    // If it's already a URL (DiceBear, existing CDN), skip upload — just update the entity
    if (image_base64.startsWith("http://") || image_base64.startsWith("https://")) {
      file_url = image_base64;
    } else {
      // It's a base64 data URL — upload to CDN
      const base64Data = image_base64.replace(/^data:[^,]+,/, "");
      const binaryStr = atob(base64Data);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mime_type });

      const form = new FormData();
      form.append("file", blob, "avatar.jpg");

      const appId = Deno.env.get("BASE44_APP_ID") || "69b2ee18a8e6fb58c7f0261c";
      const serviceToken = Deno.env.get("BASE44_SERVICE_TOKEN");

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
      try { uploadData = JSON.parse(uploadText); } catch(_) {
        throw new Error(`Upload failed: ${uploadText.slice(0, 100)}`);
      }

      if (!uploadRes.ok || uploadData.error) {
        throw new Error(uploadData.error || uploadData.message || "Upload failed");
      }

      file_url = uploadData.file_url;
    }

    // Update AthaVidUser entity via service role
    if (entity_id && file_url) {
      try {
        await base44.asServiceRole.entities.AthaVidUser.update(entity_id, { avatar_url: file_url });
      } catch(e: any) {
        console.warn("Entity update failed:", e.message);
        // Return file_url anyway — client can retry the entity update
      }
    }

    return Response.json({ file_url });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
