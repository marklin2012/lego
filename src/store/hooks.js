import { useContext } from "react";
import { CanvasContext } from "../context";
import { useRef } from "react";
import Canvas from "./canvas";

export function useCanvas(canvas) {
  const canvasRef = useRef();
  // 空的时候处理下初始值
  if (!canvasRef.current) {
    if (canvas) {
      canvasRef.current = canvas;
    } else {
      const canvas = new Canvas();
      canvasRef.current = canvas.getPublicCanvas();
    }
  }
  return canvasRef.current;
}

// 获取操作 canvas 数据的函数
export function useCanvasByContext() {
  const canvas = useContext(CanvasContext);
  return canvas;
}

// 获取画布的数据 this.canvas
export function useCanvasData() {
  const canvas = useContext(CanvasContext);
  return canvas.getCanvas();
}

export function useCanvasCmps() {
  const canvas = useContext(CanvasContext);
  return canvas.getCanvasCmps();
}
