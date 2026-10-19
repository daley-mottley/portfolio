const FEED_URL = 'https://aireadytips.substack.com/feed';
const CACHE_SECONDS = 900;

function decodeEntities(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function readTag(xml, tag) {
  const match = xml.match(new RegExp('<' + tag + '(?:\s[^>]*)?>([\s\S]*?)<\/' + tag + '>', 'i'));
  if (!match) return '';
  return decodeEntities(match[1].replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1').trim());
}

function toPlainText(value) {
  return decodeEntities(value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' '))
    .trim();
}

export async function onRequestGet({ request }) {
  try {
    const response = await fetch(FEED_URL, {
      headers: { Accept: 'application/rss+xml, application/xml, text/xml' }
    });
    if (!response.ok) throw new Error('Substack feed returned ' + response.status);
    const xml = await response.text();
    const itemMatch = xml.match(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/i);
    if (!itemMatch) throw new Error('No RSS item found');
    const item = itemMatch[1];
    const title = toPlainText(readTag(item, 'title'));
    const articleUrl = readTag(item, 'link').trim();
    const date = readTag(item, 'pubDate');
    const rawDescription = readTag(item, 'description') || readTag(item, 'content:encoded');
    const excerpt = toPlainText(rawDescription).slice(0, 320);
    const url = new URL(articleUrl);
    if (url.hostname !== 'aireadytips.substack.com' || !title) throw new Error('Unexpected feed item');
    return new Response(JSON.stringify({ title, url: url.href, date, excerpt }), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=' + CACHE_SECONDS + ', stale-while-revalidate=3600',
        'Access-Control-Allow-Origin': new URL(request.url).origin,
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Latest article temporarily unavailable' }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  }
}
