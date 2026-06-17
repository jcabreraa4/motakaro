import { create } from 'zustand';

export type Tool = 'select' | 'hand' | 'pencil' | 'rectangle' | 'ellipse' | 'eraser' | 'text';

interface CanvasStore {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  canUndo: boolean;
  canRedo: boolean;
  setCanUndo: (v: boolean) => void;
  setCanRedo: (v: boolean) => void;
  undo: () => void;
  redo: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  registerActions: (undo: () => void, redo: () => void, zoomIn: () => void, zoomOut: () => void) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  activeTool: 'select',
  setActiveTool: (activeTool) => set({ activeTool }),
  canUndo: false,
  canRedo: false,
  setCanUndo: (canUndo) => set({ canUndo }),
  setCanRedo: (canRedo) => set({ canRedo }),
  undo: () => {},
  redo: () => {},
  zoomIn: () => {},
  zoomOut: () => {},
  registerActions: (undo, redo, zoomIn, zoomOut) => set({ redo, undo, zoomIn, zoomOut })
}));
