import type { CollectionEntry } from 'astro:content';

export function postSlug(post: CollectionEntry<'blog'>) {
  return post.id.replace(/\.md$/, '');
}

export function postHref(post: CollectionEntry<'blog'>) {
  return `/blog/${postSlug(post)}/`;
}
