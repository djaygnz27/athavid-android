// api/post.js — OG tag server for shared post links
// Crawlers (WhatsApp, Twitter, iMessage) hit /post/:id → get HTML with OG tags
// Real users get redirected to the SPA which handles deep links client-side

export default async function handler(req, res) {
  const { id } = req.query;

  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const isCrawler = /whatsapp|facebookexternalhit|twitterbot|telegrambot|slackbot|linkedinbot|discordbot|applebot|googlebot|bingbot|curl|wget|python|bot|crawler|spider|preview/.test(ua);

  if (!id) return res.redirect(301, '/');

  // Real users — let the SPA handle deep linking
  if (!isCrawler) {
    return res.redirect(302, `/?post=${id}`);
  }

  const siteUrl = 'https://www.sachistream.com';
  const postUrl = `${siteUrl}/post/${id}`;

  // Fetch post from Sachi's Base44 app endpoint (no auth needed for public reads)
  let post = null;
  try {
    const apiRes = await fetch(
      `https://app.base44.com/api/apps/69e79122bcc8fb5a04cfb834/entities/SachiVideo/${id}`,
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (apiRes.ok) post = await apiRes.json();
  } catch (e) {}

  // Fallback OG if post not found
  if (!post || !post.id) {
    return res.status(200)
      .setHeader('Content-Type', 'text/html')
      .send(`<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8"/>
  <meta property="og:title" content="Watch on Sachi Stream"/>
  <meta property="og:description" content="Your stage. Share short videos with the world."/>
  <meta property="og:image" content="${siteUrl}/sachi-icon-v6.png"/>
  <meta property="og:url" content="${postUrl}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:site_name" content="Sachi — Your Stage"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta http-equiv="refresh" content="0;url=${postUrl}"/>
</head><body><script>window.location.href='${postUrl}';</script></body></html>`);
  }

  const title = post.caption
    ? post.caption.slice(0, 80) + (post.caption.length > 80 ? '…' : '')
    : 'Watch on Sachi Stream';

  const description = [
    post.username ? `@${post.username}` : null,
    post.post_city ? `📍 ${post.post_city}` : null,
    'Watch on Sachi Stream'
  ].filter(Boolean).join(' · ');

  let imageUrl = `${siteUrl}/sachi-icon-v6.png`;
  if (post.thumbnail_url) {
    imageUrl = post.thumbnail_url;
  } else if (post.is_photo && post.photo_urls && post.photo_urls.length > 0) {
    imageUrl = post.photo_urls[0];
  }

  const html = `<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8"/>
  <title>${title} — Sachi</title>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${description}"/>
  <meta property="og:image" content="${imageUrl}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:url" content="${postUrl}"/>
  <meta property="og:type" content="video.other"/>
  <meta property="og:site_name" content="Sachi — Your Stage"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:description" content="${description}"/>
  <meta name="twitter:image" content="${imageUrl}"/>
  <meta http-equiv="refresh" content="0;url=${postUrl}"/>
</head><body><script>window.location.href='${postUrl}';</script></body></html>`;

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}
