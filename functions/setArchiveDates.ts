import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Use direct fetch to Base44 API with service role
    const APP_ID = Deno.env.get("BASE44_APP_ID");
    const SERVICE_TOKEN = Deno.env.get("BASE44_SERVICE_TOKEN");
    
    const res = await fetch(`https://base44.app/api/apps/${APP_ID}/entities/SachiVideo?limit=500&sort=created_date`, {
      headers: {
        "Authorization": `Bearer ${SERVICE_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
    
    const data = await res.json();
    const items = data.items || data.records || (Array.isArray(data) ? data : []);
    
    let updated = 0;
    const errors = [];
    
    for (const v of items) {
      if (!v.archive_date && v.created_date) {
        const cd = new Date(v.created_date);
        const archiveDate = new Date(cd.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString();
        
        const upd = await fetch(`https://base44.app/api/apps/${APP_ID}/entities/SachiVideo/${v.id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${SERVICE_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ archive_date: archiveDate })
        });
        
        if (upd.ok) {
          updated++;
        } else {
          errors.push(v.id);
        }
      }
    }
    
    return Response.json({ updated, total: items.length, errors });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
