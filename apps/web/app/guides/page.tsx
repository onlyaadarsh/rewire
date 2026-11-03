import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getWordPressPosts,
  stripHtml,
  decodeHtmlEntities,
  calculateReadingTime,
  getFeaturedImageUrl,
  getCategories,
} from "@/lib/wordpress";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  PenTool,
  Wind,
  Tag,
} from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Mental Health Guides & CBT Resources",
  description:
    "Explore evidence-informed articles on overcoming overthinking, cognitive reframing, managing anxiety, and nervous system regulation with HeyRewire.",
  alternates: {
    canonical: "/buides",
  },
  openGraph: {
    title: "Mental Health Guides & CBT Resources | HeyRewire",
    description:
      "Evidence-informed articles, cognitive exercises, and practical tools to break rumination loops and calm anxiety.",
    url: "/guides",
  },
};

export default async function BlogIndexPage() {
  const posts = await getWordPressPosts({ perPage: 24 });

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HeyRewire Mental Health Guides & Coping Resources",
    description:
      "Articles and practical guides covering overthinking, cognitive reframing, mindfulness, and anxiety relief.",
    url: "https://heyrewire.com/guides",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `https://heyrewire.com/guides/${post.slug}`,
        name: decodeHtmlEntities(post.title.rendered),
      })),
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-teal-500 selection:text-white">
      <JsonLd data={blogJsonLd} />
      <SiteHeader />

      <main className="flex-1">
        {/* Posts Grid */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            {posts.length === 0 ? (
              <div className="rounded-3xl border border-zinc-200/80 bg-white p-12 text-center shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 max-w-xl mx-auto space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Guides Coming Soon
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  We are preparing evidence-grounded articles on rumination loops, CBT exercises, and polyvagal grounding. Check back shortly.
                </p>
                <Link
                  href="/offload"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-teal-700 transition-colors"
                >
                  <span>Start Brain Dump Journal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => {
                  const title = decodeHtmlEntities(post.title.rendered);
                  const excerpt = decodeHtmlEntities(stripHtml(post.excerpt.rendered));
                  const readTime = calculateReadingTime(post.content.rendered);
                  const featuredImage = getFeaturedImageUrl(post);
                  const categories = getCategories(post);
                  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <article
                      key={post.id}
                      className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900"
                    >
                      {/* Featured Media / Visual Gradient */}
                      <Link href={`/guides/${post.slug}`} className="block relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                        {featuredImage ? (
                          <img
                            src={featuredImage}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-teal-500/20 via-emerald-500/10 to-teal-900/30 flex items-center justify-center p-6 text-center">
                            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                              Mental Wellness Guide
                            </span>
                          </div>
                        )}
                      </Link>

                      {/* Card Content */}
                      <div className="flex flex-1 flex-col justify-between p-6 space-y-4">
                        <div className="space-y-3">
                          {/* Categories & Meta */}
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                            {categories.length > 0 ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                                <Tag className="h-3 w-3" />
                                <span>{categories[0].name}</span>
                              </span>
                            ) : (
                              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                                CBT Guide
                              </span>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <time dateTime={post.date}>{formattedDate}</time>
                            </div>
                            <span>&bull;</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{readTime} min read</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            <Link href={`/guides/${post.slug}`}>
                              {title}
                            </Link>
                          </h2>

                          {/* Excerpt */}
                          {excerpt && (
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                              {excerpt}
                            </p>
                          )}
                        </div>

                        {/* Read More Link */}
                        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                          <Link
                            href={`/guides/${post.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform"
                          >
                            <span>Read Complete Guide</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

