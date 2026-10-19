const FEED_URL = "https://aireadytips.substack.com/feed";

function decodeXml(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, code) => {
      const number = code[0].toLowerCase() === "x"
        ? parseInt(code.slice(1), 16)
        : parseInt(code, 10);
      return Number.isFinite(number) ? String.fromCodePoint(number) : "";
    })
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function tagValue(xml, tag) {
  const escapedTag = tag.replace(":", "\\:");
  const match = xml.match(new RegExp("<" + escapedTag + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + escapedTag + ">", "i"));
  return match ? decodeXml(match[1].trim()) : "";
}

function plainText(html) {
  return html
    .replace(/<script[\\s\\S]*?<\\/script>/gi, " ")
    .replace(/<style[\\s\\S]*?<\\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\\s+/g, " ")
    .trim();
}

export async function onRequestGet() {
  try {
    const response = await fetch(FEED_URL, {
      headers: { "Accept": "application/rss+xml, application/xml, text/xml" },
      cf: { cacheTtl: 900, cacheEverything: true }
    });
    if (!response.ok) throw new Error("RSS feed returned " + response.status);

    const xml = await response.text();
    const itemMatch = xml.match(/<item(?:\\s[^>]*)?>([\\s\\S]*?)<\\/item>/i);
    if (!itemMatch) throw new Error("No article found in RSS feed");

    const item = itemMatch[1];
    const title = plainText(tagValue(item, "title"));
    const link = tagValue(item, "link").replace(/<!\\[CDATA\\[|\\]\\]>/g, "").trim();
    const description = tagValue(item, "description") || tagValue(item, "content:encoded");
    const excerpt = plainText(description).slice(0, 260).replace(/\\s+\\S*$/, "") + (plainText(description).length > 260 ? "…" : "");

    if (!title || !link || !/^https:\\/\\//i.test(link) || !link.startsWith("https://aireadytips.substack.com/")) {
      throw new Error("RSS article fields were missing or invalid");
    }

    return new Response(JSON.stringify({ title, excerpt, url: link }), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=900, s-maxage=900",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Latest article is temporarily unavailable" }), {
      status: 502,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
