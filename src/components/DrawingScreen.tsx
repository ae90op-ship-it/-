import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { getT } from '../i18n';
import { ArrowLeft, Trash2, Eraser, PenTool, Save } from 'lucide-react';

export const DrawingScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const t = getT(state.locale);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#3b82f6'); // default blue
  const [mode, setMode] = useState<'draw' | 'erase'>('draw');

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = mode === 'erase' ? 20 : 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = mode === 'erase' ? '#ffffff' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tCtx = tempCanvas.getContext('2d');
    if (tCtx) {
      tCtx.fillStyle = '#ffffff';
      tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tCtx.drawImage(canvas, 0, 0);
    }
    const dataUrl = tempCanvas.toDataURL('image/png');

    const payload = {
      id: state.activeNote ? state.activeNote.id : Date.now().toString(),
      title: state.activeNote ? state.activeNote.title : t.drawing + ' - ' + new Date().toLocaleTimeString(),
      content: dataUrl,
      color: 'bg-pink-100',
      type: 'drawing' as const,
      timestamp: Date.now().toString()
    };

    if (state.activeNote) {
      dispatch({ type: 'UPDATE_NOTE', payload });
    } else {
      dispatch({ type: 'ADD_NOTE', payload });
    }
    dispatch({ type: 'SET_ACTIVE_NOTE', payload: null });
    dispatch({ type: 'SET_ACTIVE_APP', payload: 'notes' });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (state.activeNote && state.activeNote.type === 'drawing') {
        const img = new Image();
        img.onload = () => {
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.drawImage(img, 0, 0);
        };
        img.src = state.activeNote.content;
      }
    }
  }, [state.activeNote]);

  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#000000', '#94a3b8'];

  return (
    <div 
      className={`relative flex flex-col w-full h-[100dvh] max-w-md mx-auto shadow-2xl overflow-hidden sm:h-auto sm:min-h-[800px] sm:rounded-[2.5rem] transition-colors ${state.theme === 'light' && !state.backgroundImage ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' : ''}`}
      style={{
        backgroundColor: state.theme === 'dark' ? `rgba(9, 9, 11, ${state.backgroundOpacity / 100})` : (state.backgroundImage ? `rgba(255, 255, 255, ${state.backgroundOpacity / 100})` : undefined),
      }}
    >
      <header className="px-6 pt-12 pb-2 flex items-center justify-between z-10 bg-white/50 dark:bg-black/20 backdrop-blur-md">
        <div className="flex items-center">
          <button 
            onClick={() => {
              dispatch({ type: 'SET_ACTIVE_NOTE', payload: null });
              dispatch({ type: 'SET_ACTIVE_APP', payload: 'notes' });
            }} 
            className="p-2 -ml-2 text-gray-800 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm"
          >
            <ArrowLeft size={28} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mx-2">{t.drawing}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="p-2 text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/30 rounded-full">
            <Save size={24} />
          </button>
          <button onClick={clearCanvas} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full">
            <Trash2 size={24} />
          </button>
        </div>
      </header>

      <div className="flex-1 relative z-10 w-full h-full bg-white rounded-b-[2.5rem]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="w-full h-full touch-none cursor-crosshair bg-white"
        />
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-xl rounded-full p-3 flex gap-3 items-center border border-gray-200">
          <button 
            onClick={() => setMode('draw')} 
            className={`p-2 rounded-full transition-colors ${mode === 'draw' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <PenTool size={20} />
          </button>
          <button 
            onClick={() => setMode('erase')} 
            className={`p-2 rounded-full transition-colors ${mode === 'erase' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Eraser size={20} />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <div className="flex gap-2">
            {colors.map(c => (
              <button 
                key={c}
                onClick={() => { setColor(c); setMode('draw'); }}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${color === c && mode === 'draw' ? 'scale-125 border-gray-400' : 'border-transparent hover:scale-110 shadow-sm'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
