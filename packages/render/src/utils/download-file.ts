import { toast } from 'sonner';

export async function downloadFile(url: string, name: string) {
  try {
    const blob = await fetch(url).then((r) => r.blob());
    const link = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: name || 'download'
    });
    link.click();
    URL.revokeObjectURL(link.href);
  } catch {
    toast.error('An internal error has ocurred.');
  }
}
