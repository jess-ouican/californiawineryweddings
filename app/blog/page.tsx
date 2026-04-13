import Link from 'next/link';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Wedding Planning Blog | California Winery Weddings',
  description: 'Expert tips, guides, and inspiration for planning your perfect California winery wedding.',
};

interface BlogPostPreview {
  slug: string;
  title: string;
  description: string;
  publishedDate: string;
  author?: string;
}

// Load all blog posts from public/blog-content/ directory
function getAllBlogPosts(): BlogPostPreview[] {
  try {
    const blogDir = path.join(process.cwd(), 'public/blog-content');
    const files = fs.readdirSync(blogDir);
    
    const posts = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(blogDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const post = JSON.parse(content);
        return {
          slug: post.slug,
          title: post.title,
          description: post.description,
          publishedDate: post.publishedDate,
          author: post.author,
        };
      })
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
    
    return posts;
  } catch {
    return [];
  }
}

export default function BlogPage() {
  const blogPosts = getAllBlogPosts();
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#F5E6D3] to-[#F0D5B8] py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl font-bold text-[#6B3E2E] mb-4">
            Wedding Planning Guide
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Expert tips, inspiration, and guides for planning your perfect California winery wedding.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="border-b border-gray-200 pb-8 last:border-0"
            >
              <h2 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-2 hover:text-[#5a3425] transition">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                {post.author || 'California Winery Weddings'} • {new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-gray-700 mb-4">
                {post.description}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-[#6B3E2E] hover:underline font-medium"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-[#F5E6D3] py-12 mt-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-4">
            Get Wedding Planning Tips in Your Inbox
          </h2>
          <p className="text-gray-700 mb-6">
            Subscribe to our newsletter for expert advice, venue spotlights, and inspiration for your wine country wedding.
          </p>
          <form className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B3E2E]"
              required
            />
            <button
              type="submit"
              className="bg-[#6B3E2E] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#5a3425] transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
