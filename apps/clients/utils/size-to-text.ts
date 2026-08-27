export function sizeToText(fileSize: number): string {
  if (fileSize === 0) return 'Unknown';
  if (fileSize < 1024) return `${fileSize} B`;
  if (fileSize < 1024 * 1024) return `${(fileSize / 1024).toFixed(2)} KB`;
  if (fileSize < 1024 * 1024 * 1024) return `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
  return `${(fileSize / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
