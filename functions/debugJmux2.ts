import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const sr = base44.asServiceRole;
    
    console.log("asServiceRole keys:", Object.keys(sr));
    
    return Response.json({ 
      keys: Object.keys(sr)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
