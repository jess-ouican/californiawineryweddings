'use client';

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  // Inject inline styles for all links
  // Handle both escaped and unescaped quotes
  const styledContent = content.replace(
    /<a\s+href=/g,
    '<a style="color: #8B5A3C; text-decoration: underline;" href='
  );

  return (
    <article 
      className="prose prose-lg max-w-none
                 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-[#6B3E2E] [&_h2]:mt-8 [&_h2]:mb-4
                 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#6B3E2E] [&_h3]:mt-6 [&_h3]:mb-3
                 [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-4
                 [&_strong]:font-semibold [&_strong]:text-gray-800
                 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4
                 [&_li]:text-gray-700 [&_li]:mb-2
                 [&_a]:hover:text-[#6B3E2E]"
      dangerouslySetInnerHTML={{ __html: styledContent }}
    />
  );
}
