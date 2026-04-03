import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts } from "@/data/blogPosts";
import { BlogPostContent } from "@/components/site/BlogPostContent";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Artigo não encontrado" };
  return {
    title: `${post.title} | Blog Uora`,
    description: post.description,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();
  return <BlogPostContent post={post} />;
}
