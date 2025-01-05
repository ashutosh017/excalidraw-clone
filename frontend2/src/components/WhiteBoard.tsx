import React, { useRef, useState, useEffect, MouseEvent } from 'react';
import { Pencil, Eraser } from 'lucide-react';
import { Button } from './ui/button';

type Tool = 'pencil' | 'eraser';

interface Point {
  x: number;
  y: number;
}

const Whiteboard: React.FC = () => {
  console.log("re rendering")
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [tool, setTool] = useState<Tool>('pencil');
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    context.strokeStyle = 'white';
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    setCtx(context);

    const handleResize = (): void => {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      context.putImageData(imageData, 0, 0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCanvasPoint = (e: MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not initialized');

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: MouseEvent<HTMLCanvasElement>): void => {
    const point = getCanvasPoint(e);
    setIsDrawing(true);
    setLastPoint(point);
  };

  const draw = (e: MouseEvent<HTMLCanvasElement>): void => {
    if (!isDrawing || !ctx || !lastPoint) return;

    const currentPoint = getCanvasPoint(e);

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    
    if (tool === 'pencil') {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
    } else {
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 20;
    }
    
    ctx.stroke();
    setLastPoint(currentPoint);
  };

  const stopDrawing = (): void => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = (): void => {
    if (!ctx || !canvasRef.current) return;
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className="flex flex-col gap-4 max-w-screen w-3/4 mx-auto p-4 bg-zinc-800 h-screen ">
      <div className="flex gap-2">
        <Button
          onClick={() => setTool('pencil')}
          variant={tool === 'pencil' ? 'default' : 'outline'}
          className="flex items-center gap-2"
        >
          <Pencil className="w-4 h-4" />
          Pencil
        </Button>
        <Button
          onClick={() => setTool('eraser')}
          variant={tool === 'eraser' ? 'default' : 'outline'}
          className="flex items-center gap-2"
        >
          <Eraser className="w-4 h-4" />
          Eraser
        </Button>
        <Button
          onClick={clearCanvas}
          variant="outline"
          className="ml-auto"
        >
          Clear
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-full h-screen touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        />
      </div>
    </div>
  );
};

export default Whiteboard;