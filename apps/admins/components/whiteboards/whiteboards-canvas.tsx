import { Whiteboard } from '@workspace/backend/schema';

import { useCanvas } from '@/hooks/use-canvas';

export function WhiteboardsEditor({ whiteboard }: { whiteboard: Whiteboard }) {
  const { mainRef, canvasElRef } = useCanvas(whiteboard);

  return (
    <section
      ref={mainRef}
      className="h-full w-full overflow-hidden bg-white dark:bg-primary"
    >
      <canvas
        ref={canvasElRef}
        className="block"
      />
    </section>
  );
}
