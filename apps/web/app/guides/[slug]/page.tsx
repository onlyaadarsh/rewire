import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getWordPressPosts,
  getWordPressPostBySlug,
  stripHtml,
  decodeHtmlEntities,
  calculateReadingTime,
  getFeaturedImageUrl,
  getAuthorName,
  getCategories,
} from "@/lib/wordpress";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Tag,
  PenTool,
  MessageSquare,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://heyrewire.com";

/**
 * Prerenders all published WordPress posts at build time.
 */
export async function generateStaticParams() {
  try {
    const posts = await getWordPressPosts({ perPage: 100 });
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.warn("[generateStaticParams] Could not fetch WordPress posts:", error);
    return [];
  }
}

/**
 * Generates SEO metadata for the blog post.
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getWordPressPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested mental wellness guide could not be found.",
    };
  }

  const cleanTitle = decodeHtmlEntities(post.title.rendered);
  const rawExcerpt = decodeHtmlEntities(stripHtml(post.excerpt.rendered || post.content.rendered));
  const cleanExcerpt =
    rawExcerpt.length > 160 ? `${rawExcerpt.slice(0, 157)}...` : rawExcerpt;
  const featuredImage = getFeaturedImageUrl(post) || `${APP_URL}/og-image.png`;
  const authorName = getAuthorName(post);

  return {
    title: cleanTitle,
    description: cleanExcerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: cleanTitle,
      description: cleanExcerpt,
      url: `${APP_URL}/blog/${post.slug}`,
      siteName: "HeyRewire",
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [authorName],
      images: [
        {
          url: featuredImage,
          width: 1200,
          height: 630,
          alt: cleanTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: cleanExcerpt,
      images: [featuredImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getWordPressPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const cleanTitle = decodeHtmlEntities(post.title.rendered);
  const cleanExcerpt = decodeHtmlEntities(stripHtml(post.excerpt.rendered));
  const readTime = calculateReadingTime(post.content.rendered);
  const featuredImage = getFeaturedImageUrl(post);
  const authorName = getAuthorName(post);
  const categories = getCategories(post);
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const postUrl = `${APP_URL}/guides/${post.slug}`;

  // Structured Data: BlogPosting & BreadcrumbList
  const postJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#article`,
        headline: cleanTitle,
        description: cleanExcerpt || cleanTitle,
        url: postUrl,
        datePublished: post.date,
        dateModified: post.modified,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": postUrl,
        },
        author: {
          "@type": "Person",
          name: authorName,
        },
        publisher: {
          "@type": "Organization",
          name: "HeyRewire Mental Wellness",
          url: APP_URL,
          logo: {
            "@type": "ImageObject",
            url: `${APP_URL}/icon.png`,
          },
        },
        image: featuredImage || `${APP_URL}/og-image.png`,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${postUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: APP_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${APP_URL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: cleanTitle,
            item: postUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-teal-500 selection:text-white">
      <JsonLd data={postJsonLd} />
      <SiteHeader />

      <main className="flex-1 py-10 md:py-16 px-4 sm:px-6">
        <article className="mx-auto max-w-3xl">
          {/* Breadcrumbs & Navigation */}
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-8">
            <Link
              href="/guides"
              className="inline-flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to all guides</span>
            </Link>

            <div className="flex items-center gap-1.5 text-[11px]">
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <Link href="/guides" className="hover:underline">Guides</Link>
            </div>
          </div>

          {/* Article Header */}
          <header className="space-y-4 pb-8 border-b border-zinc-200/80 dark:border-zinc-800/80">
            {categories.length > 0 && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-0.5 text-xs font-semibold text-teal-800 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300">
                <Tag className="h-3 w-3" />
                <span>{categories[0].name}</span>
              </div>
            )}

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15]">
              {cleanTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 pt-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-xs">
                  {authorName[0]}
                </div>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{authorName}</span>
              </div>
              <span>&bull;</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={post.date}>{formattedDate}</time>
              </div>
              <span>&bull;</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{readTime} min read</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {featuredImage && (
            <div className="my-8 overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-100 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
              <img
                src={featuredImage}
                alt={cleanTitle}
                className="w-full max-h-[460px] object-cover"
              />
            </div>
          )}

          {/* Article Content Rendered with Clean Custom Typography */}
          <div
            className="blog-content py-8 text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-6 text-sm md:text-base font-normal
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-zinc-900 dark:[&_h2]:text-zinc-50 [&_h2]:mt-10 [&_h2]:mb-4
              [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-zinc-900 dark:[&_h3]:text-zinc-100 [&_h3]:mt-8 [&_h3]:mb-3
              [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-zinc-900 dark:[&_h4]:text-zinc-200 [&_h4]:mt-6 [&_h4]:mb-2
              [&_p]:leading-relaxed [&_p]:mb-4
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-4
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-4
              [&_li]:leading-relaxed
              [&_blockquote]:border-l-4 [&_blockquote]:border-teal-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-zinc-600 dark:[&_blockquote]:text-zinc-400
              [&_pre]:bg-zinc-900 [&_pre]:text-zinc-100 [&_pre]:p-4 [&_pre]:rounded-2xl [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:text-xs [&_pre]:font-mono
              [&_code]:rounded [&_code]:bg-zinc-100 dark:[&_code]:bg-zinc-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono [&_code]:text-teal-700 dark:[&_code]:text-teal-300
              [&_img]:rounded-2xl [&_img]:my-6 [&_img]:border [&_img]:border-zinc-200 dark:[&_img]:border-zinc-800
              [&_figure]:my-6
              [&_figcaption]:text-center [&_figcaption]:text-xs [&_figcaption]:text-zinc-400 [&_figcaption]:mt-2
              [&_a]:text-teal-600 dark:[&_a]:text-teal-400 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-teal-700"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* Interactive In-Article Action Hub (Conversion CTA) */}
          <div className="my-12 rounded-3xl border border-teal-200/80 bg-gradient-to-br from-teal-50/70 via-emerald-50/40 to-white p-8 shadow-sm dark:border-teal-900/50 dark:from-teal-950/30 dark:via-zinc-900 dark:to-zinc-900">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-500/25">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                  Put It Into Practice
                </span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  Feeling overwhelmed or stuck in racing thoughts?
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
                  Reading about overthinking is only the first step. Externalize your worries onto HeyRewire&apos;s private Brain Dump canvas or talk with our empathetic AI companion for CBT-grounded reframing.
                </p>
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <Link
                    href="/offload"
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-teal-700 transition-colors"
                  >
                    <PenTool className="h-3.5 w-3.5" />
                    <span>Try Brain Dump Canvas</span>
                  </Link>
                  <Link
                    href="/chat"
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Talk to AI Companion</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer Note */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-[11px] text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:text-zinc-400">
            <p>
              <strong>Disclaimer:</strong> Content published on HeyRewire is for educational and self-reflection purposes and does not constitute clinical psychotherapy or medical diagnosis. If you are experiencing acute distress, call <strong>14416</strong> (India), <strong>988</strong> (US), or visit our <Link href="/crisis-resources" className="text-teal-600 dark:text-teal-400 underline">Crisis Directory</Link>.
            </p>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}

