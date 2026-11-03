export interface WordPressMedia {
  source_url?: string;
  alt_text?: string;
}

export interface WordPressAuthor {
  id: number;
  name: string;
  slug: string;
  description?: string;
  avatar_urls?: Record<string, string>;
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  jetpack_featured_media_url?: string;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: WordPressAuthor[];
    "wp:featuredmedia"?: WordPressMedia[];
    "wp:term"?: WordPressCategory[][];
  };
}

const WP_SITE = process.env.WORDPRESS_SITE_DOMAIN || "heyrewire.wordpress.com";
const WP_BASE_API = `https://public-api.wordpress.com/wp/v2/sites/${WP_SITE}`;

/**
 * Strips HTML tags from strings for clean excerpts and metadata.
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").trim();
}

/**
 * Decodes common HTML entities returned by WordPress REST API.
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return "";
  return text
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8230;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
}

/**
 * Calculates approximate reading time in minutes.
 */
export function calculateReadingTime(content: string): number {
  const plainText = stripHtml(content);
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Extracts featured image URL from a WordPress post.
 */
export function getFeaturedImageUrl(post: WordPressPost): string | null {
  if (post.jetpack_featured_media_url && post.jetpack_featured_media_url.trim()) {
    return post.jetpack_featured_media_url;
  }
  const media = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  if (media && media.trim()) {
    return media;
  }
  return null;
}

/**
 * Extracts author name from a WordPress post.
 */
export function getAuthorName(post: WordPressPost): string {
  return post._embedded?.author?.[0]?.name || "HeyRewire Mental Health Team";
}

/**
 * Extracts categories from a WordPress post.
 */
export function getCategories(post: WordPressPost): WordPressCategory[] {
  const terms = post._embedded?.["wp:term"]?.[0];
  if (Array.isArray(terms)) {
    return terms.filter((term) => term.slug !== "uncategorized");
  }
  return [];
}

/**
 * Fetches all published posts from the WordPress.com REST API.
 * Uses Incremental Static Regeneration (revalidate: 3600).
 */
export async function getWordPressPosts(options: {
  page?: number;
  perPage?: number;
  category?: number;
} = {}): Promise<WordPressPost[]> {
  const { page = 1, perPage = 20, category } = options;
  const url = new URL(`${WP_BASE_API}/posts`);
  url.searchParams.set("_embed", "true");
  url.searchParams.set("status", "publish");
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));
  if (category) {
    url.searchParams.set("categories", String(category));
  }

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.warn(`[WordPress API] Failed to fetch posts (${res.status} ${res.statusText})`);
      return [];
    }

    const posts = (await res.json()) as WordPressPost[];
    return Array.isArray(posts) ? posts : [];
  } catch (error) {
    console.warn("[WordPress API] Network error while fetching posts:", error);
    return [];
  }
}

/**
 * Fetches a single WordPress post by its slug.
 */
export async function getWordPressPostBySlug(slug: string): Promise<WordPressPost | null> {
  const url = new URL(`${WP_BASE_API}/posts`);
  url.searchParams.set("slug", slug);
  url.searchParams.set("_embed", "true");

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.warn(`[WordPress API] Failed to fetch post ${slug} (${res.status})`);
      return null;
    }

    const posts = (await res.json()) as WordPressPost[];
    if (Array.isArray(posts) && posts.length > 0) {
      return posts[0];
    }
    return null;
  } catch (error) {
    console.warn(`[WordPress API] Network error while fetching post ${slug}:`, error);
    return null;
  }
}

/**
 * Fetches categories list from WordPress.com REST API.
 */
export async function getWordPressCategories(): Promise<WordPressCategory[]> {
  const url = `${WP_BASE_API}/categories?per_page=50`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) return [];
    const categories = (await res.json()) as WordPressCategory[];
    return Array.isArray(categories)
      ? categories.filter((c) => c.slug !== "uncategorized")
      : [];
  } catch (error) {
    console.warn("[WordPress API] Network error while fetching categories:", error);
    return [];
  }
}

