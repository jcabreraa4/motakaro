type MediaType = 'image' | 'video' | 'audio' | 'other';

export function extractType(type: string): MediaType {
  if (type.startsWith('image')) return 'image';
  if (type.startsWith('video')) return 'video';
  if (type.startsWith('audio')) return 'audio';
  return 'other';
}
