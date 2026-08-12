# Project TODO - Blog Section

- [x] Add blogPosts table to database schema (title, slug, content, contentType, sourceUrl, sourceAuthor, category, publishedAt, etc.)
- [x] Run database migration for blogPosts table
- [x] Add blog DB helpers (getBlogPosts, getBlogPostBySlug, createBlogPost, updateBlogPost, deleteBlogPost)
- [x] Add blog tRPC routes (public list/get, admin CRUD)
- [x] Create public /blog page with post listing
- [x] Create public /blog/:slug page for individual posts
- [x] Create admin /admin/blog page for managing posts
- [x] Add Blog link to navigation
- [x] Add Blog link to admin sidebar
- [x] Write vitest tests for blog endpoints
