import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef } from 'react';

import { useMutation } from 'convex/react';
import { Ellipse, Canvas as FabricCanvas, IText, PencilBrush, Point, Rect, type TMat2D, type TPointerEvent } from 'fabric';

import { api } from '@workspace/backend/_generated/api';
import type { Whiteboard } from '@workspace/backend/schema';

import { type Tool, useCanvasStore } from '@/store/canvas-store';
import { useLayoutStore } from '@/store/layout-store';

const SAVE_DELAY_MS = 1500;
const MAX_HISTORY = 50;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 4;
const ZOOM_STEP = 1.2;
const ZOOM_SENSITIVITY = 0.992;
const WHEEL_PAN_SPEED = 1;
const SHAPE_MIN_SIZE = 4;
const LIGHT_TEXT_COLOR = '#000000';
const DARK_TEXT_COLOR = '#ffffff';

const SHAPE_STYLES = {
  fill: 'rgba(99, 149, 237, 0.15)',
  stroke: '#2563eb',
  strokeWidth: 2
};

function isShapeTool(tool: Tool): tool is 'rectangle' | 'ellipse' {
  return tool === 'rectangle' || tool === 'ellipse';
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';
}

function updateHistoryControls(historyLength: number, historyIndex: number) {
  const { setCanRedo, setCanUndo } = useCanvasStore.getState();
  setCanUndo(historyIndex > 0);
  setCanRedo(historyIndex < historyLength - 1);
}

function getEventPoint(event: TPointerEvent) {
  if ('clientX' in event) return { x: event.clientX, y: event.clientY };

  const touch = event.touches[0] ?? event.changedTouches[0];
  return touch ? { x: touch.clientX, y: touch.clientY } : null;
}

function shouldStartPan(event: TPointerEvent, isSpacePressed: boolean) {
  return isSpacePressed || ('button' in event && (event.button === 1 || event.altKey));
}

function getTextColor(theme: string | undefined) {
  return theme === 'dark' ? DARK_TEXT_COLOR : LIGHT_TEXT_COLOR;
}

function syncThemeColor(canvas: FabricCanvas, nextColor: string, previousColor: string) {
  canvas.getObjects().forEach((obj) => {
    if (obj instanceof IText) {
      if (obj.fill !== previousColor && obj.fill !== LIGHT_TEXT_COLOR && obj.fill !== DARK_TEXT_COLOR) return;

      obj.set('fill', nextColor);
      return;
    }

    if (obj.type?.toLowerCase() !== 'path') return;
    if (obj.stroke !== previousColor && obj.stroke !== LIGHT_TEXT_COLOR && obj.stroke !== DARK_TEXT_COLOR) return;

    obj.set('stroke', nextColor);
  });

  if (canvas.freeDrawingBrush) canvas.freeDrawingBrush.color = nextColor;
  canvas.requestRenderAll();
}

export function useCanvas(whiteboard: Whiteboard | null) {
  const updateWhiteboard = useMutation(api.whiteboards.update);
  const { resolvedTheme } = useTheme();
  const chatbot = useLayoutStore((state) => state.chatbot);
  const activeTool = useCanvasStore((state) => state.activeTool);

  const mainRef = useRef<HTMLElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);

  const activeToolRef = useRef(activeTool);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const isRestoringRef = useRef(false);
  const isDrawingShapeRef = useRef(false);
  const isPanningRef = useRef(false);
  const isSpacePressedRef = useRef(false);
  const lastPanPointRef = useRef<{ x: number; y: number } | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const currentShapeRef = useRef<Rect | Ellipse | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateRef = useRef(updateWhiteboard);
  const whiteboardIdRef = useRef(whiteboard?._id);
  const initialContentRef = useRef(whiteboard?.content);
  const textColorRef = useRef(getTextColor(resolvedTheme));

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

    saveTimerRef.current = setTimeout(() => {
      void updateRef.current({ id, content: json });
    }, SAVE_DELAY_MS);
  }, []);

  const pushHistory = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || isRestoringRef.current) return;

    const json = JSON.stringify(canvas.toJSON());
    const current = historyRef.current[historyIndexRef.current];
    if (current === json) return;

    const nextHistory = [...historyRef.current.slice(0, historyIndexRef.current + 1), json].slice(-MAX_HISTORY);
    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
    updateHistoryControls(nextHistory.length, historyIndexRef.current);
    scheduleSave(json);
  }, [scheduleSave]);

  const syncCanvasSize = useCallback(() => {
    const canvas = fabricRef.current;
    const main = mainRef.current;
    if (!canvas || !main) return;

    const { height, width } = main.getBoundingClientRect();
    if (width <= 0 || height <= 0) return;

    canvas.setDimensions({ width, height });
    canvas.requestRenderAll();
  }, []);

  const restoreSnapshot = useCallback(
    async (snapshot: string, nextIndex: number) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const viewportTransform = canvas.viewportTransform?.slice() as TMat2D | undefined;
      isRestoringRef.current = true;

      try {
        await canvas.loadFromJSON(JSON.parse(snapshot));
        canvas.set({ backgroundColor: '' });
        if (viewportTransform) canvas.setViewportTransform(viewportTransform);
        canvas.discardActiveObject();
        canvas.requestRenderAll();

        historyIndexRef.current = nextIndex;
        updateHistoryControls(historyRef.current.length, nextIndex);
        scheduleSave(snapshot);
      } finally {
        isRestoringRef.current = false;
      }
    },
    [scheduleSave]
  );

  const undo = useCallback(() => {
    const index = historyIndexRef.current;
    const snapshot = historyRef.current[index - 1];
    if (!snapshot) return;

    void restoreSnapshot(snapshot, index - 1);
  }, [restoreSnapshot]);

  const redo = useCallback(() => {
    const index = historyIndexRef.current;
    const snapshot = historyRef.current[index + 1];
    if (!snapshot) return;

    void restoreSnapshot(snapshot, index + 1);
  }, [restoreSnapshot]);

  const zoomBy = useCallback((factor: number) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const nextZoom = clamp(canvas.getZoom() * factor, MIN_ZOOM, MAX_ZOOM);
    const center = new Point(canvas.getWidth() / 2, canvas.getHeight() / 2);
    canvas.zoomToPoint(center, nextZoom);
    canvas.requestRenderAll();
  }, []);

  const zoomIn = useCallback(() => zoomBy(ZOOM_STEP), [zoomBy]);
  const zoomOut = useCallback(() => zoomBy(1 / ZOOM_STEP), [zoomBy]);

  const setCursor = useCallback((cursor: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.defaultCursor = cursor;
    canvas.hoverCursor = cursor;
  }, []);

  const applyToolMode = useCallback(
    (tool: Tool) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const isDrawing = tool === 'pencil';
      const isHand = tool === 'hand';
      const isShape = isShapeTool(tool);

      canvas.isDrawingMode = isDrawing;
      canvas.selection = tool === 'select';
      canvas.skipTargetFind = isHand || isShape;

      if (tool !== 'select') canvas.discardActiveObject();

      canvas.forEachObject((obj) => {
        obj.selectable = tool === 'select';
        obj.evented = tool === 'select' || tool === 'eraser';
      });

      setCursor(isSpacePressedRef.current || isHand ? 'grab' : tool === 'text' ? 'text' : tool === 'eraser' ? 'not-allowed' : 'default');
      canvas.requestRenderAll();
    },
    [setCursor]
  );

  const startPanning = useCallback(
    (event: TPointerEvent) => {
      const point = getEventPoint(event);
      if (!point) return;

      isPanningRef.current = true;
      lastPanPointRef.current = point;
      setCursor('grabbing');
    },
    [setCursor]
  );

  const panCanvas = useCallback((event: TPointerEvent) => {
    const canvas = fabricRef.current;
    const point = getEventPoint(event);
    const lastPoint = lastPanPointRef.current;
    const viewportTransform = canvas?.viewportTransform;
    if (!canvas || !point || !lastPoint || !viewportTransform) return;

    viewportTransform[4] += point.x - lastPoint.x;
    viewportTransform[5] += point.y - lastPoint.y;
    canvas.setViewportTransform(viewportTransform);
    lastPanPointRef.current = point;
  }, []);

  const stopPanning = useCallback(() => {
    if (!isPanningRef.current) return;

    isPanningRef.current = false;
    lastPanPointRef.current = null;
    applyToolMode(activeToolRef.current);
  }, [applyToolMode]);

  useEffect(() => {
    useCanvasStore.getState().registerActions(undo, redo, zoomIn, zoomOut);

    return () => {
      useCanvasStore.getState().registerActions(
        () => {},
        () => {},
        () => {},
        () => {}
      );
      updateHistoryControls(0, -1);
    };
  }, [redo, undo, zoomIn, zoomOut]);

  useEffect(() => {
    if (!canvasElRef.current || !mainRef.current || fabricRef.current) return;

    const canvas = new FabricCanvas(canvasElRef.current, {
      width: 1,
      height: 1,
      backgroundColor: '',
      preserveObjectStacking: true,
      selectionColor: 'rgba(0, 127, 216, 0.1)',
      selectionBorderColor: '#007fd8',
      selectionLineWidth: 1
    });

    const brush = new PencilBrush(canvas);
    brush.color = textColorRef.current;
    brush.width = 3;
    canvas.freeDrawingBrush = brush;
    fabricRef.current = canvas;

    const init = async () => {
      const initialContent = initialContentRef.current;

      if (initialContent) {
        try {
          await canvas.loadFromJSON(JSON.parse(initialContent));
          canvas.set({ backgroundColor: '' });
        } catch {
          canvas.clear();
        }
      }

      applyToolMode(activeToolRef.current);
      pushHistory();
      requestAnimationFrame(syncCanvasSize);
    };

    void init();

    const resizeObserver = new ResizeObserver(() => requestAnimationFrame(syncCanvasSize));
    resizeObserver.observe(mainRef.current);

    canvas.on('text:editing:exited', (event) => {
      const itext = event.target as IText | undefined;
      if (!itext) return;

      if (!itext.text?.trim()) canvas.remove(itext);

      pushHistory();
      useCanvasStore.getState().setActiveTool('select');
    });

    canvas.on('object:modified', pushHistory);
    canvas.on('path:created', pushHistory);

    canvas.on('mouse:wheel', (event) => {
      const wheelEvent = event.e;

      if (wheelEvent.ctrlKey) {
        const nextZoom = clamp(canvas.getZoom() * Math.pow(ZOOM_SENSITIVITY, wheelEvent.deltaY), MIN_ZOOM, MAX_ZOOM);
        canvas.zoomToPoint(new Point(wheelEvent.offsetX, wheelEvent.offsetY), nextZoom);
      } else {
        const viewportTransform = canvas.viewportTransform;
        if (viewportTransform) {
          viewportTransform[4] -= wheelEvent.deltaX * WHEEL_PAN_SPEED;
          viewportTransform[5] -= wheelEvent.deltaY * WHEEL_PAN_SPEED;
          canvas.setViewportTransform(viewportTransform);
        }
      }

      wheelEvent.preventDefault();
      wheelEvent.stopPropagation();
    });

    canvas.on('mouse:down', (event) => {
      const pointerEvent = event.e;

      const tool = activeToolRef.current;

      if (tool === 'hand' || shouldStartPan(pointerEvent, isSpacePressedRef.current)) {
        startPanning(pointerEvent);
        pointerEvent.preventDefault();
        return;
      }

      if (tool === 'eraser') {
        if (!event.target) return;

        canvas.remove(event.target);
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        pushHistory();
        return;
      }

      if (tool === 'text') {
        const { x, y } = event.scenePoint;
        const itext = new IText('', {
          left: x,
          top: y,
          fill: textColorRef.current,
          fontSize: 20
        });

        canvas.add(itext);
        canvas.setActiveObject(itext);
        itext.enterEditing();
        return;
      }

      if (!isShapeTool(tool)) return;

      const { x, y } = event.scenePoint;
      const shapeOptions = {
        ...SHAPE_STYLES,
        left: x,
        top: y,
        evented: false,
        selectable: false
      };

      isDrawingShapeRef.current = true;
      startPointRef.current = { x, y };
      currentShapeRef.current = tool === 'rectangle' ? new Rect({ ...shapeOptions, height: 1, width: 1 }) : new Ellipse({ ...shapeOptions, rx: 1, ry: 1 });
      canvas.add(currentShapeRef.current);
    });

    canvas.on('mouse:move', (event) => {
      if (isPanningRef.current) {
        panCanvas(event.e);
        return;
      }

      const shape = currentShapeRef.current;
      const startPoint = startPointRef.current;
      const tool = activeToolRef.current;
      if (!isDrawingShapeRef.current || !shape || !startPoint || !isShapeTool(tool)) return;

      const { x, y } = event.scenePoint;
      const left = Math.min(x, startPoint.x);
      const top = Math.min(y, startPoint.y);
      const width = Math.abs(x - startPoint.x);
      const height = Math.abs(y - startPoint.y);

      if (tool === 'rectangle') {
        shape.set({ height, left, top, width });
      } else {
        shape.set({ left, rx: width / 2, ry: height / 2, top });
      }

      shape.setCoords();
      canvas.requestRenderAll();
    });

    canvas.on('mouse:up', () => {
      if (isPanningRef.current) {
        stopPanning();
        return;
      }

      const shape = currentShapeRef.current;
      const tool = activeToolRef.current;
      if (!isDrawingShapeRef.current || !shape || !isShapeTool(tool)) return;

      isDrawingShapeRef.current = false;
      startPointRef.current = null;
      currentShapeRef.current = null;

      const isTinyShape = tool === 'rectangle' ? (shape.width ?? 0) < SHAPE_MIN_SIZE || (shape.height ?? 0) < SHAPE_MIN_SIZE : (shape.rx ?? 0) * 2 < SHAPE_MIN_SIZE || (shape.ry ?? 0) * 2 < SHAPE_MIN_SIZE;

      if (isTinyShape) {
        canvas.remove(shape);
        canvas.requestRenderAll();
        return;
      }

      shape.set({ evented: true, selectable: true });
      shape.setCoords();
      canvas.setActiveObject(shape);
      canvas.requestRenderAll();
      pushHistory();
      useCanvasStore.getState().setActiveTool('select');
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      if (event.code === 'Space') {
        isSpacePressedRef.current = true;
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.discardActiveObject();
        setCursor(isPanningRef.current ? 'grabbing' : 'grab');
        event.preventDefault();
        return;
      }

      if (event.key !== 'Delete' && event.key !== 'Backspace') return;

      const activeObject = canvas.getActiveObject() as { isEditing?: boolean } | undefined;
      if (activeObject?.isEditing) return;

      const activeObjects = canvas.getActiveObjects();
      if (!activeObjects.length) return;

      activeObjects.forEach((obj) => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      pushHistory();
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return;

      isSpacePressedRef.current = false;
      if (!isPanningRef.current) applyToolMode(activeToolRef.current);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      resizeObserver.disconnect();
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      void canvas.dispose();
      fabricRef.current = null;
    };
  }, [applyToolMode, panCanvas, pushHistory, setCursor, startPanning, stopPanning, syncCanvasSize]);

  useEffect(() => {
    activeToolRef.current = activeTool;
    applyToolMode(activeTool);
  }, [activeTool, applyToolMode]);

  useEffect(() => {
    const nextColor = getTextColor(resolvedTheme);
    const previousColor = textColorRef.current;
    textColorRef.current = nextColor;

    const canvas = fabricRef.current;
    if (!canvas || nextColor === previousColor) return;

    syncThemeColor(canvas, nextColor, previousColor);
  }, [resolvedTheme]);

  useEffect(() => {
    requestAnimationFrame(syncCanvasSize);
  }, [chatbot, syncCanvasSize]);

  return { canvasElRef, mainRef };
}
