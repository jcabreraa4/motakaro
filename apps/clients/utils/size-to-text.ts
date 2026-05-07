export function sizeToText(fileSize: number): string {
  if (fileSize < 1024) return `Size: ${fileSize} B`;
  if (fileSize < 1024 * 1024) return `Size: ${(fileSize / 1024).toFixed(2)} KB`;
  if (fileSize < 1024 * 1024 * 1024) return `Size: ${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
  return `Size: ${(fileSize / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
