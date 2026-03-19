'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Ellipse, IText, PencilBrush, Rect } from 'fabric';
import type { Whiteboard } from '@workspace/backend/schema';
import { api } from '@workspace/backend/_generated/api';
import { useAppStateStore } from '@/store/state-store';
import { useCanvasStore } from '@/store/canvas-store';
import { useMutation } from 'convex/react';

const SAVE_DELAY_MS = 1500;
const MAX_HISTORY = 50;

export function useCanvas(whiteboard: Whiteboard | null) {
  const updateWhiteboard = useMutation(api.whiteboards.update);
  const showChat = useAppStateStore((state) => state.showChat);
  const activeTool = useCanvasStore((state) => state.activeTool);

  const mainRef = useRef<HTMLElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);

  const activeToolRef = useRef(activeTool);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const isRestoringRef = useRef(false);
  const isDrawingRef = useRef(false);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const currentShapeRef = useRef<Rect | Ellipse | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateRef = useRef(updateWhiteboard);
  const whiteboardIdRef = useRef(whiteboard?._id);

  useEffect(() => {
    updateRef.current = updateWhiteboard;
  }, [updateWhiteboard]);
  useEffect(() => {
    whiteboardIdRef.current = whiteboard?._id;
  }, [whiteboard?._id]);

  const scheduleSave = useCallback((json: string) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    const id = whiteboardIdRef.current;
    if (!id) return;
    saveTimerRef.current = setTimeout(() => updateRef.current({ id, content: json }), SAVE_DELAY_MS);
  }, []);

  const pushHistory = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || isRestoringRef.current) return;
    const json = JSON.stringify(canvas.toJSON());
    const trimmed = [...historyRef.current.slice(0, historyIndexRef.current + 1), json].slice(-MAX_HISTORY);
    historyRef.current = trimmed;
    historyIndexRef.current = trimmed.length - 1;
    useCanvasStore.getState().setCanUndo(trimmed.length > 1);
    useCanvasStore.getState().setCanRedo(false);
    scheduleSave(json);
  }, [scheduleSave]);

  const syncCanvasSize = useCallback(() => {
    const canvas = fabricRef.current;
    const main = mainRef.current;
    if (!canvas || !main) return;
    const { width, height } = main.getBoundingClientRect();
    if (width > 0 && height > 0) {
      canvas.setDimensions({ width, height });
      canvas.renderAll();
    }
  }, []);

  const undo = useCallback(() => {
    const canvas = fabricRef.current;
    const index = historyIndexRef.current;
    if (!canvas || index <= 0) return;
    const newIndex = index - 1;
    const snapshot = historyRef.current[newIndex];
    if (!snapshot) return;
    isRestoringRef.current = true;
    canvas.loadFromJSON(JSON.parse(snapshot)).then(() => {
      canvas.renderAll();
      historyIndexRef.current = newIndex;
      useCanvasStore.getState().setCanUndo(newIndex > 0);
      useCanvasStore.getState().setCanRedo(true);
      isRestoringRef.current = false;
      scheduleSave(snapshot);
    });
  }, [scheduleSave]);

  const redo = useCallback(() => {
    const canvas = fabricRef.current;
    const history = historyRef.current;
    const index = historyIndexRef.current;
    if (!canvas || index >= history.length - 1) return;
    const newIndex = index + 1;
    const snapshot = history[newIndex];
    if (!snapshot) return;
    isRestoringRef.current = true;
    canvas.loadFromJSON(JSON.parse(snapshot)).then(() => {
      canvas.renderAll();
      historyIndexRef.current = newIndex;
      useCanvasStore.getState().setCanUndo(true);
      useCanvasStore.getState().setCanRedo(newIndex < history.length - 1);
      isRestoringRef.current = false;
      scheduleSave(snapshot);
    });
  }, [scheduleSave]);

  useEffect(() => {
    useCanvasStore.getState().registerActions(undo, redo);
  }, [undo, redo]);

  // Canvas init — runs once on mount
  useEffect(() => {
    if (!canvasElRef.current || !mainRef.current || fabricRef.current) return;

    const canvas = new FabricCanvas(canvasElRef.current, { width: 1, height: 1, backgroundColor: '#ffffff' });
    const brush = new PencilBrush(canvas);
    brush.color = '#000000';
    brush.width = 3;
    canvas.freeDrawingBrush = brush;
    fabricRef.current = canvas;

    const init = async () => {
      if (whiteboard?.content) {
        try {
          await canvas.loadFromJSON(JSON.parse(whiteboard.content));
          canvas.renderAll();
        } catch {
          /* invalid JSON – start blank */
        }
      }
      pushHistory();
      requestAnimationFrame(syncCanvasSize);
    };
    init();

    const resizeObserver = new ResizeObserver(() => requestAnimationFrame(syncCanvasSize));
    resizeObserver.observe(mainRef.current);

    canvas.on('text:editing:exited', (e) => {
      const itext = e.target as IText;
      if (!itext.text?.trim()) {
        canvas.remove(itext);
      }
      pushHistory();
      useCanvasStore.getState().setActiveTool('select');
    });

    canvas.on('object:modified', () => {
      if (!isRestoringRef.current) pushHistory();
    });
    canvas.on('path:created', () => {
      if (!isRestoringRef.current) pushHistory();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      const active = canvas.getActiveObjects();
      if (!active.length) return;
      active.forEach((obj) => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
      pushHistory();
    };
    document.addEventListener('keydown', onKeyDown);

    canvas.on('mouse:down', (e) => {
      const tool = activeToolRef.current;
      if (tool === 'eraser') {
        if (e.target) {
          canvas.remove(e.target);
          canvas.discardActiveObject();
          canvas.renderAll();
          pushHistory();
        }
        return;
      }
      if (tool === 'text') {
        const { x, y } = e.scenePoint;
        const itext = new IText('', {
          left: x,
          top: y,
          fontSize: 20,
          fill: '#000000'
        });
        canvas.add(itext);
        canvas.setActiveObject(itext);
        itext.enterEditing();
        return;
      }
      if (tool !== 'rectangle' && tool !== 'ellipse') return;
      isDrawingRef.current = true;
      const { x, y } = e.scenePoint;
      startPointRef.current = { x, y };
      const props = { left: x, top: y, fill: 'rgba(99, 149, 237, 0.15)', stroke: '#2563eb', strokeWidth: 2, selectable: false, evented: false };
      const shape = tool === 'rectangle' ? new Rect({ ...props, width: 1, height: 1 }) : new Ellipse({ ...props, rx: 1, ry: 1 });
      currentShapeRef.current = shape;
      canvas.add(shape);
    });

    canvas.on('mouse:move', (e) => {
      if (!isDrawingRef.current || !startPointRef.current || !currentShapeRef.current) return;
      const tool = activeToolRef.current;
      if (tool !== 'rectangle' && tool !== 'ellipse') return;
      const { x: sx, y: sy } = startPointRef.current;
      const { x, y } = e.scenePoint;
      const left = Math.min(x, sx);
      const top = Math.min(y, sy);
      const w = Math.abs(x - sx);
      const h = Math.abs(y - sy);
      if (tool === 'rectangle') {
        currentShapeRef.current.set({ left, top, width: w, height: h });
      } else {
        (currentShapeRef.current as Ellipse).set({ left, top, rx: w / 2, ry: h / 2 });
      }
      canvas.renderAll();
    });

    canvas.on('mouse:up', () => {
      const tool = activeToolRef.current;
      if (!isDrawingRef.current || (tool !== 'rectangle' && tool !== 'ellipse')) return;
      isDrawingRef.current = false;
      startPointRef.current = null;
      if (currentShapeRef.current) {
        currentShapeRef.current.set({ selectable: true, evented: true });
        canvas.setActiveObject(currentShapeRef.current);
        currentShapeRef.current = null;
        canvas.renderAll();
        pushHistory();
        useCanvasStore.getState().setActiveTool('select');
      }
    });

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      resizeObserver.disconnect();
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      canvas.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync activeTool from store → canvas mode
  useEffect(() => {
    activeToolRef.current = activeTool;
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.isDrawingMode = activeTool === 'pencil';
    canvas.skipTargetFind = activeTool === 'rectangle' || activeTool === 'ellipse';
    canvas.defaultCursor = activeTool === 'text' ? 'text' : 'default';
    if (activeTool === 'select') {
      canvas.selection = true;
      canvas.forEachObject((obj) => {
        obj.selectable = true;
      });
    } else {
      canvas.selection = false;
      canvas.discardActiveObject();
    }
    canvas.renderAll();
  }, [activeTool]);

  // Re-sync size when chatbot sidebar toggles
  useEffect(() => {
    requestAnimationFrame(syncCanvasSize);
  }, [showChat, syncCanvasSize]);

  return { mainRef, canvasElRef };
}
