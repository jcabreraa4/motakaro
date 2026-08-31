type mediaType = 'image' | 'video' | 'audio' | 'other';

export function extractType(type: string): mediaType {
  if (type.startsWith('image')) return 'image';
  if (type.startsWith('video')) return 'video';
  if (type.startsWith('audio')) return 'audio';
  return 'other';
}
