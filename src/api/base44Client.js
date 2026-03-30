import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { token, functionsVersion, appBaseUrl } = appParams;

export const base44 = createClient({
  appId: "69b2ee18a8e6fb58c7f0261c",
  token,
  functionsVersion,
  requiresAuth: false,
  appBaseUrl
});
