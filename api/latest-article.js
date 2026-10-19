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
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=300");
  try {
    const response = await fetch(FEED_URL, {
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error("RSS feed returned " + response.status);

    const xml = await response.text();
    const itemMatch = xml.match(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/i);
    if (!itemMatch) throw new Error("No article found in RSS feed");

    const item = itemMatch[1];
    const title = plainText(tagValue(item, "title"));
    const link = tagValue(item, "link").trim();
    const description = tagValue(item, "description") || tagValue(item, "content:encoded");
    const cleanDescription = plainText(description);
    const excerpt = cleanDescription.length > 260
      ? cleanDescription.slice(0, 260).replace(/\s+\S*$/, "") + "…"
      : cleanDescription;

    if (!title || !link || !/^https:\/\//i.test(link) || !link.startsWith("https://aireadytips.substack.com/")) {
      throw new Error("RSS article fields were missing or invalid");
    }

    res.status(200).json({ title, excerpt, url: link });
  } catch (_) {
    res.setHeader("Cache-Control", "no-store");
    res.status(502).json({ error: "Latest article is temporarily unavailable" });
  }
};
