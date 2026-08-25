/**
 * src/lib/scrapers/socialScraper.ts
 *
 * Módulo especializado en la extracción de huella digital en redes sociales
 * y crawling de agregadores de bio-links (Linktree, Beacons, Bio.site).
 */

export interface SocialLinksResult {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  pinterest?: string;
  linkedin?: string;
  twitter?: string;
  whatsappChannel?: string;
}

export async function extractSocialLinks(html: string): Promise<SocialLinksResult> {
  const socialLinks: SocialLinksResult = {};
  if (!html) return socialLinks;

  const cleanedHtml = html.replace(/\\\//g, "/");
  const rawUrlMatches = cleanedHtml.match(/(?:https?:)?\/\/[^\s"'<>()\\]+/gi) || [];

  for (let rawUrl of rawUrlMatches) {
    if (rawUrl.startsWith("//")) rawUrl = `https:${rawUrl}`;
    const url = rawUrl.replace(/[",;)>]+$/, "").trim();

    // YouTube
    if (
      (url.includes("youtube.com/") || url.includes("youtu.be/")) &&
      !url.includes("/embed/") &&
      !url.includes("/iframe_api") &&
      !url.includes("/player_api") &&
      !socialLinks.youtube
    ) {
      socialLinks.youtube = url;
    }
    // Facebook
    else if (
      (url.includes("facebook.com/") || url.includes("fb.com/") || url.includes("fb.me/")) &&
      !url.includes("/sharer") &&
      !url.includes("/share.php") &&
      !url.includes("/dialog/") &&
      !url.includes("/tr/") &&
      !url.includes("/login") &&
      !socialLinks.facebook
    ) {
      socialLinks.facebook = url;
    }
    // Instagram
    else if (
      (url.includes("instagram.com/") || url.includes("instagr.am/")) &&
      !url.includes("/sharer") &&
      !socialLinks.instagram
    ) {
      socialLinks.instagram = url;
    }
    // TikTok
    else if (url.includes("tiktok.com/@") && !socialLinks.tiktok) {
      socialLinks.tiktok = url;
    }
    // LinkedIn
    else if (url.includes("linkedin.com/") && !socialLinks.linkedin) {
      socialLinks.linkedin = url;
    }
    // Pinterest
    else if ((url.includes("pinterest.com/") || url.includes("pinterest.es/")) && !socialLinks.pinterest) {
      socialLinks.pinterest = url;
    }
    // Twitter / X
    else if (
      (url.includes("twitter.com/") || url.includes("x.com/")) &&
      !url.includes("/intent/") &&
      !url.includes("/share") &&
      !socialLinks.twitter
    ) {
      socialLinks.twitter = url;
    }
    // WhatsApp Channel
    else if (
      (url.includes("whatsapp.com/channel/") || url.includes("chat.whatsapp.com/")) &&
      !socialLinks.whatsappChannel
    ) {
      socialLinks.whatsappChannel = url;
    }
  }

  // Deep Crawl de Bio-links (Linktree, Beacons, Bio.site)
  for (const rawUrl of rawUrlMatches) {
    if (
      (rawUrl.includes("linktr.ee/") || rawUrl.includes("beacons.ai/") || rawUrl.includes("bio.site/")) &&
      !rawUrl.includes("/sitemap")
    ) {
      try {
        const bioRes = await fetch(rawUrl, {
          signal: AbortSignal.timeout(3000),
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        if (bioRes.ok) {
          const bioHtml = await bioRes.text();
          const bioCleaned = bioHtml.replace(/\\\//g, "/");
          const bioUrls = bioCleaned.match(/(?:https?:)?\/\/[^\s"'<>()\\]+/gi) || [];
          for (let bUrl of bioUrls) {
            bUrl = bUrl.replace(/[",;)>]+$/, "").trim();
            if (bUrl.includes("youtube.com/") && !socialLinks.youtube && !bUrl.includes("/embed/")) {
              socialLinks.youtube = bUrl;
            } else if (bUrl.includes("facebook.com/") && !socialLinks.facebook && !bUrl.includes("/sharer")) {
              socialLinks.facebook = bUrl;
            } else if (bUrl.includes("tiktok.com/@") && !socialLinks.tiktok) {
              socialLinks.tiktok = bUrl;
            }
          }
        }
      } catch {
        // Fallback silencioso
      }
    }
  }

  return socialLinks;
}

export function generateSocialDorks(businessName: string, foundSocials: SocialLinksResult) {
  const cleanQuery = businessName.trim();
  const encodedQuery = encodeURIComponent(cleanQuery);

  return [
    {
      platform: "YouTube Canal Oficial",
      searchUrl: foundSocials.youtube || `https://www.google.com/search?q=site:youtube.com+${encodedQuery}+mallorca`,
    },
    {
      platform: "Facebook Página Oficial",
      searchUrl: foundSocials.facebook || `https://www.google.com/search?q=site:facebook.com+${encodedQuery}+mallorca`,
    },
    {
      platform: "Instagram Official",
      searchUrl:
        foundSocials.instagram || `https://www.google.com/search?q=site:instagram.com+${encodedQuery}+mallorca`,
    },
    {
      platform: "TikTok Oficial",
      searchUrl: foundSocials.tiktok || `https://www.google.com/search?q=site:tiktok.com+${encodedQuery}+mallorca`,
    },
    {
      platform: "LinkedIn Empresa",
      searchUrl: foundSocials.linkedin || `https://www.google.com/search?q=site:linkedin.com+${encodedQuery}+mallorca`,
    },
    {
      platform: "Pinterest Tableros",
      searchUrl:
        foundSocials.pinterest || `https://www.google.com/search?q=site:pinterest.com+${encodedQuery}+mallorca`,
    },
  ];
}
