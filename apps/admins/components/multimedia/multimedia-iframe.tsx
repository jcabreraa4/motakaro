'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { cn } from '@workspace/ui/lib/utils';

import { MultimediaLoader } from '@/components/multimedia/multimedia-render';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface MultimediaIframeProps {
  src: string;
  interact?: boolean;
  className?: string;
}

export function MultimediaIframe({ src, interact, className }: MultimediaIframeProps) {
  const [loading, setLoading] = useState(true);

  if (interact) {
    return (
      <>
        {loading && <MultimediaLoader />}
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
      {loading && <MultimediaLoader />}
      <Document
        file={src}
        onLoadSuccess={() => setLoading(false)}
        onLoadError={() => setLoading(false)}
      >
        <Page
          width={400}
          pageNumber={1}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </Document>
    </>
  );
}
