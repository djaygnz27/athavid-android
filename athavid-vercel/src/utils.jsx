import { uploadFile, request } from "./post/upload.js";
// ⛔ LOCKED — utils.jsx
// Shared utility functions used across components.
// DO NOT MODIFY unless fixing a utility-specific bug.
// Last verified working: 2026-05-23

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric", timeZone:"America/New_York" });
}

function formatCount(n) {
  if (!n) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

const resolveMediaUrl = (url, isVideo) => {
  if (!url) return url;
  const match = url.match(/\/files\/mp\/public\/([^/]+)\/(.+)$/);
  if (match) {
    const filename = match[2];
    const isVideoFile = isVideo || /\.(mp4|mov|webm|avi|mkv|m4v)$/i.test(filename);
    const bucket = isVideoFile ? 'videos' : 'images';
    return `https://media.base44.com/${bucket}/public/${match[1]}/${match[2]}`;
  }
  return url;
};
// Get user's location for post geo-tagging
export async function getPostLocation() {
  const savedCode = localStorage.getItem('sachi_country_code');
  const savedRegion = localStorage.getItem('sachi_region');
  const savedCity = localStorage.getItem('sachi_city');
  const savedCountry = localStorage.getItem('sachi_country');
  // Use cached data if available
  if (savedCode) {
    return { post_country: savedCode, post_region: savedRegion || null, post_city: savedCity || null };
  }
  if (savedCountry) {
    return { post_country: savedCountry, post_region: savedRegion || null, post_city: savedCity || null };
  }
  // Fallback: try GPS reverse geocode
  try {
    const pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
    );
    const { latitude, longitude } = pos.coords;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    const data = await res.json();
    const addr = data.address || {};
    const country = addr.country_code ? addr.country_code.toUpperCase() : null;
    const city = addr.city || addr.town || addr.village || addr.county || null;
    const region = addr.state || addr.region || null;
    if (country) localStorage.setItem('sachi_country_code', country);
    if (region) localStorage.setItem('sachi_region', region);
    if (city) localStorage.setItem('sachi_city', city);
    return { post_country: country, post_region: region, post_city: city };
  } catch {
    // Final fallback: IP geolocation
    try {
      const r = await fetch('https://ipapi.co/json/');
      const d = await r.json();
      const country = d.country_code || null;
      const region = d.region || null;
      const city = d.city || null;
      if (country) localStorage.setItem('sachi_country_code', country);
      if (region) localStorage.setItem('sachi_region', region);
      if (city) localStorage.setItem('sachi_city', city);
      return { post_country: country, post_region: region, post_city: city };
    } catch {
      return {};
    }
  }
}

// US/AU/CA state abbreviation helper
function getStateAbbr(state, countryCode) {
  if (!state) return '';
  const US_STATES = {
    'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
    'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
    'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA',
    'Kansas':'KS','Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD',
    'Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO',
    'Montana':'MT','Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ',
    'New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH',
    'Oklahoma':'OK','Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC',
    'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT',
    'Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY',
    'District of Columbia':'DC'
  };
  const AU_STATES = {
    'New South Wales':'NSW','Victoria':'VIC','Queensland':'QLD','South Australia':'SA',
    'Western Australia':'WA','Tasmania':'TAS','Northern Territory':'NT',
    'Australian Capital Territory':'ACT'
  };
  const CA_PROVINCES = {
    'Ontario':'ON','Quebec':'QC','British Columbia':'BC','Alberta':'AB',
    'Manitoba':'MB','Saskatchewan':'SK','Nova Scotia':'NS','New Brunswick':'NB',
    'Newfoundland and Labrador':'NL','Prince Edward Island':'PE','Northwest Territories':'NT',
    'Nunavut':'NU','Yukon':'YT'
  };
  if (countryCode === 'US' && US_STATES[state]) return US_STATES[state];
  if (countryCode === 'AU' && AU_STATES[state]) return AU_STATES[state];
  if (countryCode === 'CA' && CA_PROVINCES[state]) return CA_PROVINCES[state];
  // For other countries, return state as-is (already short)
  if (state.length <= 4) return state;
  return state; // Return full state name for others
}

// Country name or code -> emoji flag
function countryFlag(code) {
  if (!code) return "";
  // Map full country names to codes
  const nameToCode = {
    "australia": "AU", "united states": "US", "usa": "US", "us": "US",
    "sri lanka": "LK", "new zealand": "NZ", "india": "IN", "canada": "CA",
    "united kingdom": "GB", "uk": "GB", "germany": "DE", "france": "FR",
    "japan": "JP", "china": "CN", "brazil": "BR", "mexico": "MX",
    "singapore": "SG", "malaysia": "MY", "philippines": "PH",
    "indonesia": "ID", "thailand": "TH", "south africa": "ZA",
    "nigeria": "NG", "kenya": "KE", "pakistan": "PK", "bangladesh": "BD",
    "united arab emirates": "AE", "uae": "AE", "saudi arabia": "SA",
    "italy": "IT", "spain": "ES", "netherlands": "NL", "sweden": "SE",
    "norway": "NO", "denmark": "DK", "finland": "FI", "switzerland": "CH",
    "austria": "AT", "portugal": "PT", "poland": "PL", "russia": "RU",
    "south korea": "KR", "korea": "KR", "taiwan": "TW", "hong kong": "HK",
    "ireland": "IE", "belgium": "BE", "greece": "GR", "turkey": "TR",
    "argentina": "AR", "colombia": "CO", "chile": "CL", "peru": "PE",
    "egypt": "EG", "israel": "IL", "iran": "IR", "iraq": "IQ",
    "myanmar": "MM", "vietnam": "VN", "cambodia": "KH",
  };
  try {
    const lower = code.toLowerCase().trim();
    const iso = nameToCode[lower] || (code.length === 2 ? code.toUpperCase() : null);
    if (!iso || iso.length !== 2) return "🌍";
    return iso.toUpperCase().replace(/./g, c =>
      String.fromCodePoint(127397 + c.charCodeAt(0))
    );
  } catch(e) { return "🌍"; }
}



async function captureThumbnail(file) {
  // Try multiple seek times in case the first frame is black
  const tryCapture = (videoEl, canvas, seekTime) => new Promise((resolve) => {
    const ctx = canvas.getContext("2d");
    const done = () => {
      try {
        const vw = videoEl.videoWidth, vh = videoEl.videoHeight;
        if (!vw || !vh) return resolve(null);
        const targetRatio = 500 / 888, srcRatio = vw / vh;
        let sx = 0, sy = 0, sw = vw, sh = vh;
        if (srcRatio > targetRatio) { sw = vh * targetRatio; sx = (vw - sw) / 2; }
        else { sh = vw / targetRatio; sy = (vh - sh) / 2; }
        ctx.clearRect(0, 0, 500, 888);
        ctx.drawImage(videoEl, sx, sy, sw, sh, 0, 0, 500, 888);
        // Check if frame is not pure black
        const d = ctx.getImageData(0, 0, 50, 50).data;
        let sum = 0;
        for (let i = 0; i < d.length; i += 4) sum += d[i] + d[i+1] + d[i+2];
        if (sum < 1000) return resolve(null); // frame is black, skip
        resolve("ok");
      } catch { resolve(null); }
    };
    videoEl.onseeked = done;
    videoEl.onerror = () => resolve(null);
    try { videoEl.currentTime = seekTime; } catch { resolve(null); }
  });

  return new Promise(async (resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    const canvas = document.createElement("canvas");
    canvas.width = 500; canvas.height = 888;

    const cleanup = () => { try { URL.revokeObjectURL(objectUrl); } catch {} };

    // Timeout safety — 8 seconds max
    const timeout = setTimeout(() => { cleanup(); resolve(null); }, 8000);

    video.onloadedmetadata = async () => {
      const dur = video.duration || 0;
      // Try 3 different seek points: 10%, 25%, 50% of video
      const seekPoints = [
        Math.min(0.5, dur * 0.1),
        Math.min(2, dur * 0.25),
        Math.min(5, dur * 0.5),
      ];
      let captured = false;
      for (const t of seekPoints) {
        const result = await tryCapture(video, canvas, t);
        if (result === "ok") { captured = true; break; }
      }
      clearTimeout(timeout);
      cleanup();
      if (!captured) return resolve(null);
      canvas.toBlob(async (blob) => {
        if (!blob) return resolve(null);
        const thumbFile = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
        try { const url = await uploadFile(thumbFile); resolve(url); }
        catch { resolve(null); }
      }, "image/jpeg", 0.85);
    };

    video.onerror = () => { clearTimeout(timeout); cleanup(); resolve(null); };
    video.src = objectUrl;
    video.load();
  });
}

// ── Auth Modal ────────────────────────────────────────────────────────────────

// ── Comment Sheet ─────────────────────────────────────────────────────────────
const createNotif = (data) => {
  request("POST", "/apps/69e79122bcc8fb5a04cfb834/entities/SachiNotification", { is_read: false, ...data }).catch(() => {});
};


export { formatDate, formatCount, getStateAbbr, countryFlag, resolveMediaUrl, createNotif };
