'use client';

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  // Inject inline styles for all links
  const styledContent = content.replace(
    /<a\s+href=/g,
    '<a style="color: #8B5A3C !important; text-decoration: underline !important; cursor: pointer;" href='
  );

  return (
    <>
      <style>{`
        .blog-content a {
          color: #8B5A3C !important;
          text-decoration: underline !important;
        }
        .blog-content a:hover {
          color: #6B3E2E !important;
        }
        /* Override any prose styling */
        .blog-content :where(a) {
          color: #8B5A3C !important;
          text-decoration: underline !important;
        }
      `}</style>
      <article 
        className="blog-content prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: styledContent }}
      />
    </>
  );
}
