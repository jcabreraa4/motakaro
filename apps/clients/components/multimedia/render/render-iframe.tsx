'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { cn } from '@workspace/ui/lib/utils';

import { RenderLoader } from '@/components/multimedia/render/render-loader';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface RenderIframeProps {
  src: string;
  controls?: boolean;
  className?: string;
}

export function RenderIframe({ src, controls, className }: RenderIframeProps) {
  const [loading, setLoading] = useState(true);

  if (controls) {
    return (
      <>
        {loading && <RenderLoader />}
        <div className="relative h-full w-full overflow-hidden rounded-md border">
          <iframe
            src={`${src}#view=FitH&toolbar=0&navpanes=0&scrollbar=0&zoom=150`}
            className={cn('scroll-hidden absolute h-full w-full border-0', className)}
            onLoad={() => setLoading(false)}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {loading && <RenderLoader />}
      <Document
        file={src}
        onLoadSuccess={() => setLoading(false)}
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
