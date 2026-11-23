declare module '*.webp' {
  interface StaticImageData {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
    blurWidth?: number;
    blurHeight?: number;
  }

  const content: StaticImageData;

  export default content;
}
