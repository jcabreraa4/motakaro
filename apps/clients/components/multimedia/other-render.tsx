'use client';

import { useState } from 'react';
import { RenderLoader } from '@/components/multimedia/multimedia-render';
import { Document, Page, pdfjs } from 'react-pdf';
import { cn } from '@workspace/ui/lib/utils';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface OtherRenderProps {
  src: string;
  interact?: boolean;
  className?: string;
}

export function OtherMediaRender({ src, interact = false, className }: OtherRenderProps) {
  const [loading, setLoading] = useState(true);

  if (interact) {
    return (
      <>
        {loading && <RenderLoader />}
        <iframe
          src={`${src}#view=FitH&toolbar=0&navpanes=0&scrollbar=0&zoom=150`}
          className={cn('scroll-hidden absolute h-full w-full border-0', className)}
          onLoad={() => setLoading(false)}
        />
      </>
    );
  }

  return (
    <>
      {loading && <RenderLoader />}
      <Document
        file={src}
        onLoadSuccess={() => setLoading(false)}
        onLoadError={() => setLoading(false)}
      >
        <Page
          pageNumber={1}
          width={400}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </Document>
    </>
  );
}
