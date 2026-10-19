const FEED_URL = "https://aireadytips.substack.com/feed";

function decodeXml(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}
function tagValue(xml, tag) {
  const match = xml.match(new RegExp("<" + tag + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + tag + ">", "i"));
  return match ? decodeXml(match[1]).trim() : "";
}
function plainText(html) {
  return decodeXml(html.replace(/<script[\\s\\S]*?<\\/script>/gi, " ")
    .replace(/<style[\\s\\S]*?<\\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\\s+/g, " ")).trim();
}
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=3600");
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const response = await fetch(FEED_URL, { headers: { "User-Agent": "AI-Ready-Tips-Portfolio/1.0" } });
    if (!response.ok) throw new Error("Substack feed returned " + response.status);
    const xml = await response.text();
    const item = xml.match(/<item(?:\\s[^>]*)?>([\\s\\S]*?)<\\/item>/i);
    if (!item) throw new Error("No article was found in the feed");
    const itemXml = item[1];
    const title = plainText(tagValue(itemXml, "title"));
    const link = tagValue(itemXml, "link").replace(/<!\\[CDATA\\[|\\]\\]>/g, "").trim();
    const published = tagValue(itemXml, "pubDate");
    const description = tagValue(itemXml, "description") || tagValue(itemXml, "content:encoded");
    const excerpt = plainText(description).slice(0, 360);
    const parsedUrl = new URL(link);
    if (parsedUrl.hostname !== "aireadytips.substack.com" || !title) throw new Error("The feed item was invalid");
    return res.status(200).json({
      title,
      url: parsedUrl.toString(),
      publishedAt: published && !Number.isNaN(Date.parse(published)) ? new Date(published).toISOString() : null,
      excerpt: excerpt ? excerpt + (plainText(description).length > 360 ? "…" : "") : "Open the latest article from AI Ready Tips."
    });
  } catch (error) {
    return res.status(502).json({ error: "The latest article is temporarily unavailable." });
  }
};
