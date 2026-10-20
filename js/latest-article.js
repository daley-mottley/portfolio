document.addEventListener("DOMContentLoaded", async () => {
  const card = document.querySelector(".latest-article-card");
  const title = document.getElementById("latest-article-title");
  const excerpt = document.getElementById("latest-article-excerpt");
  const date = document.getElementById("latest-article-date");
  const link = document.getElementById("latest-article-link");
  if (!card || !title || !excerpt || !date || !link) return;
  const newsletterUrl = "https://aireadytips.substack.com";
  try {
    const response = await fetch("/api/latest-article", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Article feed unavailable");
    const article = await response.json();
    const articleUrl = new URL(article.url);
    if (articleUrl.hostname !== "aireadytips.substack.com") throw new Error("Unexpected article URL");
    title.textContent = article.title;
    excerpt.textContent = article.excerpt || "Open the latest article from AI Ready Tips.";
    link.href = articleUrl.toString();
    link.setAttribute("aria-label", "Read article: " + article.title);
    if (article.publishedAt) {
      const published = new Date(article.publishedAt);
      date.textContent = "LATEST ARTICLE · " + published.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    } else {
      date.textContent = "LATEST ARTICLE · AI READY TIPS";
    }
  } catch (_) {
    title.textContent = "Explore the latest from AI Ready Tips.";
    excerpt.textContent = "The newest article could not be loaded right now. Visit the newsletter to read the latest practical AI guidance.";
    date.textContent = "AI READY TIPS NEWSLETTER";
    link.href = newsletterUrl;
    link.setAttribute("aria-label", "Visit the AI Ready Tips newsletter");
  } finally {
    card.setAttribute("aria-busy", "false");
  }
});
