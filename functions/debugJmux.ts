import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    console.log("Base44 object keys:", Object.keys(base44));
    console.log("Has messenger?", "messenger" in base44);
    console.log("Has asServiceRole?", "asServiceRole" in base44);
    
    if ("asServiceRole" in base44) {
      const sr = base44.asServiceRole;
      console.log("asServiceRole keys:", Object.keys(sr));
    }
    
    return Response.json({ 
      keys: Object.keys(base44),
      hasMessenger: "messenger" in base44,
      hasServiceRole: "asServiceRole" in base44
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
