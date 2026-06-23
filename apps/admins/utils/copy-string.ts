import { toast } from 'sonner';

interface CopyStringProps {
  text: string;
  type: 'message' | 'code' | 'link' | 'text';
}

export async function copyString({ text, type }: CopyStringProps) {
  if (!text) return;

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
    toast.success(`${capitalize(type)} copied successfully.`);
  }
}
