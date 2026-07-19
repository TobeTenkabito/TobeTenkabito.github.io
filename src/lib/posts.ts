import type { CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;
export type BlogVersion = CollectionEntry<'blogVersions'>;

export function postSlug(post: CollectionEntry<'blog'>) {
  return post.id.replace(/\.md$/, '');
}

export function postHref(post: CollectionEntry<'blog'>) {
  return `/blog/${postSlug(post)}/`;
}

export function versionSlug(version: BlogVersion) {
  return version.id.replace(/\.md$/, '').split('/').pop() ?? version.id;
}

export function versionHref(post: BlogPost, version: BlogVersion) {
  return `/blog/${postSlug(post)}/history/${versionSlug(version)}/`;
}

export function sortVersions(versions: BlogVersion[]) {
  return [...versions].sort(
    (a, b) => b.data.versionDate.getTime() - a.data.versionDate.getTime(),
  );
}

export function sortPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
}

export function categorySlug(category: string) {
  const slug = category
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]/gu, '');

  return slug || 'uncategorized';
}

export function categoryHref(category: string) {
  return `/categories/${categorySlug(category)}/`;
}

export function getCategorySummaries(posts: BlogPost[]) {
  const categories = new Map<string, { name: string; slug: string; posts: BlogPost[] }>();

  for (const post of posts) {
    const name = post.data.category;
    const slug = categorySlug(name);
    const existing = categories.get(slug);

    if (existing) {
      existing.posts.push(post);
    } else {
      categories.set(slug, { name, slug, posts: [post] });
    }
  }

  return [...categories.values()]
    .map((category) => ({
      ...category,
      posts: sortPosts(category.posts),
      count: category.posts.length,
      latestDate: sortPosts(category.posts)[0]?.data.publishDate,
    }))
    .sort((a, b) => {
      const dateDiff = (b.latestDate?.getTime() ?? 0) - (a.latestDate?.getTime() ?? 0);
      return dateDiff || a.name.localeCompare(b.name, 'zh-CN');
    });
}
