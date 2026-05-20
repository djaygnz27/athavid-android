import base44 from "npm:@base44/sdk";

const app = base44.init({ appId: "69e79122bcc8fb5a04cfb834" });

export default async function handler(req: Request): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return new Response(JSON.stringify({ error: "Email and code required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Find matching OTP record
    const records = await app.asServiceRole.entities.PasswordReset.filter({ email, code });

    if (!records || records.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "Invalid code" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const record = records[0];

    // Check expiry
    if (new Date(record.expiry) < new Date()) {
      await app.asServiceRole.entities.PasswordReset.delete(record.id);
      return new Response(JSON.stringify({ success: false, error: "Code expired" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Valid — delete used code
    await app.asServiceRole.entities.PasswordReset.delete(record.id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error("verifyOTP error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
