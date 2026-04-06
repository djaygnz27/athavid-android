const JAMENDO_CLIENT_ID = "c9f4d87f";

const GENRE_TAG_MAP: Record<string, string> = {
  "All":        "",
  "Lo-Fi":      "lounge",
  "Hip-Hop":    "hiphop",
  "Electronic": "electronic",
  "R&B":        "rnb",
  "Pop":        "pop",
  "Chill":      "relaxation",
  "Afrobeats":  "afrobeats",
  "Jazz":       "jazz",
  "Rock":       "rock",
  "Acoustic":   "acoustic",
  "Classical":  "classical",
};

const GENRE_EMOJI: Record<string, string> = {
  "lounge":"🌆","hiphop":"🔥","electronic":"⚡","rnb":"❤️","pop":"🌈",
  "relaxation":"🌊","afrobeats":"🌍","jazz":"🎷","rock":"🎸","acoustic":"🎸","classical":"🎻",
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const genre  = url.searchParams.get("genre")  || "All";
  const search = url.searchParams.get("search") || "";
  const order  = url.searchParams.get("order")  || "popularity_week";
  const limit  = url.searchParams.get("limit")  || "30";

  const tag = GENRE_TAG_MAP[genre] ?? "";

  const params = new URLSearchParams({
    client_id:   JAMENDO_CLIENT_ID,
    format:      "json",
    limit,
    order,
    include:     "musicinfo",
    audioformat: "mp31",
    imagesize:   "100",
    ...(tag    ? { tags: tag }    : {}),
    ...(search ? { namesearch: search } : {}),
  });

  const apiUrl = `https://api.jamendo.com/v3.0/tracks/?${params.toString()}`;

  try {
    const resp = await fetch(apiUrl);
    if (!resp.ok) throw new Error(`Jamendo error: ${resp.status}`);
    const data = await resp.json();

    const tracks = (data.results || []).map((t: any) => ({
      id:     `j_${t.id}`,
      title:  t.name,
      artist: t.artist_name,
      url:    t.audio,
      genre:  genre === "All" ? (t.musicinfo?.tags?.genres?.[0] || "Music") : genre,
      emoji:  GENRE_EMOJI[tag] || "🎵",
      duration: t.duration,
      image:  t.image,
    })).filter((t: any) => t.url);

    return new Response(JSON.stringify({ tracks }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message, tracks: [] }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}
