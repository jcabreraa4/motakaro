import { toast } from 'sonner';

type Device = 'mobile' | 'tablet' | 'computer';

interface CopyTextProps {
  text: string;
  type: 'message' | 'code' | 'link' | 'text';
}

export async function copyText({ text, type }: CopyTextProps) {
  if (!text) return;

  const device: Device = window.innerWidth <= 767 ? 'mobile' : window.innerWidth <= 1024 ? 'tablet' : 'computer';

  function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  } finally {
    toast.success(device === 'computer' ? `${capitalize(type)} copied to clipboard successfully.` : `${capitalize(type)} copied to clipboard.`);
  }
}
