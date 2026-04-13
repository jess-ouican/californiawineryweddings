import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo';
import Link from 'next/link';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  publishedDate: string;
  author?: string;
  tags?: string[];
}

// Load blog post from public/blog-content/ directory
async function loadBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(process.cwd(), 'public/blog-content', `${slug}.json`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch {
    return null;
  }
}

// Get all blog post slugs for static generation
export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), 'public/blog-content');
  try {
    const files = fs.readdirSync(blogDir);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => ({
        slug: file.replace('.json', ''),
      }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | California Winery Weddings Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await loadBlogPost(slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-[#6B3E2E] mb-4">Post Not Found</h1>
        <Link href="/blog" className="text-[#6B3E2E] hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  const schema = generateArticleSchema(
    post.title,
    post.description,
    post.publishedDate,
    post.publishedDate,
    post.author
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://www.californiawineryweddings.com' },
    { name: 'Blog', url: 'https://www.californiawineryweddings.com/blog' },
    { name: post.title, url: `https://www.californiawineryweddings.com/blog/${slug}` },
  ]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#F5E6D3] to-[#F0D5B8] py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="text-[#6B3E2E] hover:underline text-sm mb-4 inline-block">
            ← Back to Blog
          </Link>
          <h1 className="font-serif text-5xl font-bold text-[#6B3E2E] mb-4">
            {post.title}
          </h1>
          <p className="text-xl text-gray-700">{post.description}</p>
          <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
            <span>{post.author || 'California Winery Weddings'}</span>
            <span>•</span>
            <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Related Posts CTA */}
      <section className="bg-[#F5E6D3] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-4">
            Looking for your perfect winery wedding venue?
          </h2>
          <p className="text-gray-700 mb-6">
            Browse our directory of {1300}+ California wineries ready to host your big day.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#6B3E2E] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#5a3425] transition"
          >
            Explore Wineries
          </Link>
        </div>
      </section>
    </div>
  );
}
