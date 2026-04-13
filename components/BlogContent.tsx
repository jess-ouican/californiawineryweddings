'use client';

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  return (
    <article 
      className="prose prose-lg max-w-none
                 prose-h2:font-serif prose-h2:text-3xl prose-h2:font-bold prose-h2:text-[#6B3E2E] prose-h2:mt-8 prose-h2:mb-4
                 prose-h3:font-serif prose-h3:text-xl prose-h3:font-bold prose-h3:text-[#6B3E2E] prose-h3:mt-6 prose-h3:mb-3
                 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                 prose-strong:font-semibold prose-strong:text-gray-800
                 prose-a:text-[#8B5A3C] prose-a:underline prose-a:hover:text-[#6B3E2E] prose-a:transition
                 prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
                 prose-li:text-gray-700 prose-li:mb-2
                 [&_a]:text-[#8B5A3C] [&_a]:underline [&_a]:hover:text-[#6B3E2E] [&_a]:transition
                 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-[#6B3E2E] [&_h2]:mt-8 [&_h2]:mb-4
                 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#6B3E2E] [&_h3]:mt-6 [&_h3]:mb-3
                 [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-4
                 [&_strong]:font-semibold [&_strong]:text-gray-800
                 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4
                 [&_li]:text-gray-700 [&_li]:mb-2"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
