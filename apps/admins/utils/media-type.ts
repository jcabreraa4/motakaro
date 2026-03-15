type mediaTypes = 'image' | 'video' | 'audio' | 'other';

export function mediaType(type: string): mediaTypes {
  if (type.startsWith('image')) return 'image';
  if (type.startsWith('video')) return 'video';
  if (type.startsWith('audio')) return 'audio';
  return 'other';
}
