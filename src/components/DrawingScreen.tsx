import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { getT } from '../i18n';
import { ArrowLeft, Trash2, Eraser, PenTool, Save, Hand, Move, Square, Circle as CircleIcon, Layers, Settings2, X, Plus, Eye, EyeOff } from 'lucide-react';
import { Stage, Layer, Line, Rect, Circle } from 'react-konva';

type DrawItem = 
  | { id: string; type: 'path'; points: number[]; color: string; size: number; isEraser: boolean; x?: number; y?: number }
  | { id: string; type: 'rect'; x: number; y: number; w: number; h: number; color: string; size: number }
  | { id: string; type: 'circle'; x: number; y: number; r: number; color: string; size: number };

type LayerData = { id: string; name: string; visible: boolean; items: DrawItem[] };

export const DrawingScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const t = getT(state.locale);
  
  const [layers, setLayers] = useState<LayerData[]>([{ id: '1', name: 'Layer 1', visible: true, items: [] }]);
  const [activeLayerId, setActiveLayerId] = useState('1');
  
  const [mode, setMode] = useState<'draw' | 'erase' | 'pan' | 'move' | 'rect' | 'circle'>('draw');
  const [color, setColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(5);
  
  const [showPenSettings, setShowPenSettings] = useState(false);
  const [showLayersMenu, setShowLayersMenu] = useState(false);
  
  const stageRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  
  // Dimensions
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (state.activeNote && state.activeNote.type === 'drawing') {
      try {
        const parsed = JSON.parse(state.activeNote.content);
        if (parsed.layers) {
          setLayers(parsed.layers);
          setActiveLayerId(parsed.layers[0]?.id || '1');
        } else if (parsed.lines) {
          // migrate old data
          setLayers([{ id: '1', name: 'Layer 1', visible: true, items: parsed.lines.map((l:any, i:number) => ({ id: i.toString(), type: 'path', points: l.points, color: l.color, size: l.size || 5, isEraser: l.globalCompositeOperation === 'destination-out' })) }]);
        }
      } catch (e) {}
    }
  }, [state.activeNote]);

  const handlePointerDown = (e: any) => {
    if (mode === 'pan' || mode === 'move') return;
    
    const stage = e.target.getStage();
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    setIsDrawing(true);
    
    const newId = Date.now().toString();
    const currentLayerIndex = layers.findIndex(l => l.id === activeLayerId);
    if (currentLayerIndex === -1) return;
    
    const newLayers = [...layers];
    const layerItems = [...newLayers[currentLayerIndex].items];
    
    if (mode === 'draw' || mode === 'erase') {
      layerItems.push({ id: newId, type: 'path', points: [pos.x, pos.y], color: mode === 'erase' ? '#000000' : color, size: brushSize, isEraser: mode === 'erase' });
    } else if (mode === 'rect') {
      layerItems.push({ id: newId, type: 'rect', x: pos.x, y: pos.y, w: 0, h: 0, color, size: brushSize });
    } else if (mode === 'circle') {
      layerItems.push({ id: newId, type: 'circle', x: pos.x, y: pos.y, r: 0, color, size: brushSize });
    }
    
    newLayers[currentLayerIndex].items = layerItems;
    setLayers(newLayers);
  };

  const handlePointerMove = (e: any) => {
    if (!isDrawing || mode === 'pan' || mode === 'move') return;

    const stage = e.target.getStage();
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    const currentLayerIndex = layers.findIndex(l => l.id === activeLayerId);
    if (currentLayerIndex === -1) return;

    const newLayers = [...layers];
    const layerItems = [...newLayers[currentLayerIndex].items];
    const lastItem = layerItems[layerItems.length - 1];
    
    if (!lastItem) return;

    if (lastItem.type === 'path') {
      lastItem.points = lastItem.points.concat([pos.x, pos.y]);
    } else if (lastItem.type === 'rect') {
      lastItem.w = pos.x - lastItem.x;
      lastItem.h = pos.y - lastItem.y;
    } else if (lastItem.type === 'circle') {
      const dx = pos.x - lastItem.x;
      const dy = pos.y - lastItem.y;
      lastItem.r = Math.sqrt(dx * dx + dy * dy);
    }

    setLayers(newLayers);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const handleSave = () => {
    if (!stageRef.current) return;
    // We will save the JSON data and a preview image
    // To get a clean preview image, we need to temporarily hide the background grid? Actually, it's fine.
    
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    
    const payload = {
      id: state.activeNote ? state.activeNote.id : Date.now().toString(),
      title: state.activeNote ? state.activeNote.title : t.drawing + ' - ' + new Date().toLocaleTimeString(),
      content: JSON.stringify({ layers }),
      color: 'bg-green-100',
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

  const handleItemDragEnd = (e: any, itemRef: DrawItem, layerIdx: number, itemIdx: number) => {
    const newLayers = [...layers];
    const item = newLayers[layerIdx].items[itemIdx];
    
    // Konva drag alters x/y. For paths, we should either translate the points or rely on the x/y group position.
    // We will use x,y offsets for paths.
    if (item.type === 'path') {
      item.x = e.target.x();
      item.y = e.target.y();
    } else if (item.type === 'rect' || item.type === 'circle') {
      item.x = e.target.x();
      item.y = e.target.y();
    }
    setLayers(newLayers);
  };

  const handlePenClick = () => {
    if (mode === 'draw') {
      setShowPenSettings(!showPenSettings);
    } else {
      setMode('draw');
      setShowPenSettings(false);
    }
  };

  return (
    <div 
      className={`relative flex flex-col w-full h-[100dvh] ${state.isComputerMode ? 'max-w-6xl' : 'max-w-md'} mx-auto shadow-2xl overflow-hidden sm:h-auto sm:min-h-[800px] sm:rounded-[2.5rem] transition-all duration-300 ${state.backgroundImage ? 'bg-white/80 dark:bg-black/80 backdrop-blur-sm' : (state.theme === 'light' ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' : 'bg-zinc-950')}`}
    >
      <header className="px-6 pt-12 pb-4 flex items-center justify-between z-20 bg-white/50 dark:bg-black/20 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center">
          <button 
            onClick={() => {
              dispatch({ type: 'SET_ACTIVE_NOTE', payload: null });
              dispatch({ type: 'SET_ACTIVE_APP', payload: 'notes' });
            }} 
            className="p-2 -ml-2 text-gray-800 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={28} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mx-2">{t.drawing}</h1>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => setShowLayersMenu(true)}
            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors"
          >
            <Layers size={24} />
          </button>
          <button 
            onClick={handleSave}
            className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-full transition-colors"
          >
            <Save size={24} />
          </button>
        </div>
      </header>

      <div className="flex-1 relative bg-white dark:bg-zinc-900 overflow-hidden" ref={containerRef}>
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          draggable={mode === 'pan'}
          x={stagePos.x}
          y={stagePos.y}
          onDragEnd={(e) => {
            if (e.target === stageRef.current) {
              setStagePos({ x: e.target.x(), y: e.target.y() });
            }
          }}
          ref={stageRef}
        >
          {layers.map((layer, lIdx) => layer.visible && (
            <Layer key={layer.id}>
              {layer.items.map((item, iIdx) => {
                const isDraggable = mode === 'move';
                if (item.type === 'path') {
                  return (
                    <Line
                      key={item.id}
                      points={item.points}
                      stroke={item.color}
                      strokeWidth={item.size}
                      tension={0.5}
                      lineCap="round"
                      lineJoin="round"
                      globalCompositeOperation={item.isEraser ? 'destination-out' : 'source-over'}
                      draggable={isDraggable}
                      x={item.x || 0}
                      y={item.y || 0}
                      onDragEnd={(e) => handleItemDragEnd(e, item, lIdx, iIdx)}
                    />
                  );
                } else if (item.type === 'rect') {
                  return (
                    <Rect
                      key={item.id}
                      x={item.x}
                      y={item.y}
                      width={item.w}
                      height={item.h}
                      stroke={item.color}
                      strokeWidth={item.size}
                      draggable={isDraggable}
                      onDragEnd={(e) => handleItemDragEnd(e, item, lIdx, iIdx)}
                    />
                  );
                } else if (item.type === 'circle') {
                  return (
                    <Circle
                      key={item.id}
                      x={item.x}
                      y={item.y}
                      radius={item.r}
                      stroke={item.color}
                      strokeWidth={item.size}
                      draggable={isDraggable}
                      onDragEnd={(e) => handleItemDragEnd(e, item, lIdx, iIdx)}
                    />
                  );
                }
                return null;
              })}
            </Layer>
          ))}
        </Stage>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 dark:bg-black/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 z-20">
        <button 
          onClick={handlePenClick}
          className={`p-3 rounded-xl transition-colors relative ${mode === 'draw' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
        >
          <PenTool size={24} />
          {showPenSettings && mode === 'draw' && (
            <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 flex flex-col gap-4 w-48">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500">Color</label>
                <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 cursor-pointer rounded-lg border-0" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500">Brush Size ({brushSize}px)</label>
                <input type="range" min="1" max="50" value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} className="w-full" />
              </div>
            </div>
          )}
        </button>
        <button 
          onClick={() => { setMode('erase'); setShowPenSettings(false); }}
          className={`p-3 rounded-xl transition-colors ${mode === 'erase' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
        >
          <Eraser size={24} />
        </button>
        <div className="w-px h-8 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
        <button 
          onClick={() => { setMode('rect'); setShowPenSettings(false); }}
          className={`p-3 rounded-xl transition-colors ${mode === 'rect' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
        >
          <Square size={24} />
        </button>
        <button 
          onClick={() => { setMode('circle'); setShowPenSettings(false); }}
          className={`p-3 rounded-xl transition-colors ${mode === 'circle' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
        >
          <CircleIcon size={24} />
        </button>
        <div className="w-px h-8 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
        <button 
          onClick={() => { setMode('move'); setShowPenSettings(false); }}
          className={`p-3 rounded-xl transition-colors ${mode === 'move' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
        >
          <Move size={24} />
        </button>
        <button 
          onClick={() => { setMode('pan'); setShowPenSettings(false); }}
          className={`p-3 rounded-xl transition-colors ${mode === 'pan' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
        >
          <Hand size={24} />
        </button>
      </div>

      {showLayersMenu && (
        <div className="absolute top-24 right-4 z-50 bg-white dark:bg-zinc-900 rounded-3xl p-4 shadow-2xl border border-gray-200 dark:border-zinc-800 w-64 flex flex-col gap-4 animate-in slide-in-from-right-8">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900 dark:text-white">Layers</h3>
            <button onClick={() => setShowLayersMenu(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500"><X size={20} /></button>
          </div>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
            {layers.map(layer => (
              <div 
                key={layer.id} 
                className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer border \${activeLayerId === layer.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                onClick={() => setActiveLayerId(layer.id)}
              >
                <span className="font-medium text-sm flex-1 truncate">{layer.name}</span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setLayers(layers.map(l => l.id === layer.id ? { ...l, visible: !l.visible } : l));
                    }}
                    className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg"
                  >
                    {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (layers.length > 1) {
                        const newL = layers.filter(l => l.id !== layer.id);
                        setLayers(newL);
                        if (activeLayerId === layer.id) setActiveLayerId(newL[0].id);
                      }
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => {
              const newId = Date.now().toString();
              setLayers([{ id: newId, name: `Layer ${layers.length + 1}`, visible: true, items: [] }, ...layers]);
              setActiveLayerId(newId);
            }}
            className="flex items-center justify-center gap-2 p-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl text-sm font-bold transition-colors"
          >
            <Plus size={18} /> Add Layer
          </button>
        </div>
      )}
    </div>
  );
};
