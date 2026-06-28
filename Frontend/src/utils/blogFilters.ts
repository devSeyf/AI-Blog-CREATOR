export function onlyPublishedBlogs<T extends { published?: boolean }>(blogs: T[]): T[] {
  return blogs.filter((blog) => blog.published !== false);
}

