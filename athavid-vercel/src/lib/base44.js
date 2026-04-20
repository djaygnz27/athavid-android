// src/lib/base44.js
//
// Base44 SDK singleton. One instance for the whole app.
// Phase 2 of the auth migration — instantiates the SDK so AuthModal can
// use base44.auth.* for login. Phase 3 will migrate api.js to use
// base44.entities.* / base44.functions.invoke() through this same client.
//
// App ID is hardcoded here intentionally (matches the style of AuthModal.jsx
// and api.js today). If we ever need separate dev/prod Base44 apps, move
// this to import.meta.env.VITE_BASE44_APP_ID in one place.

import { createClient } from "@base44/sdk";

export const BASE44_APP_ID = "69b2ee18a8e6fb58c7f0261c";

export const base44 = createClient({ appId: BASE44_APP_ID });

export default base44;
