import { useCallback, useEffect, useRef, useState } from 'react';
import { recognizeHandwriting, type Stroke } from '../lib/api';

interface Props {
  onCommit: (text: string) => void;
}

const SIZE = 280;

/** Bảng viết tay: vẽ chữ Hán bằng chuột / ngón tay / bút, nhận dạng tự động. */
export default function HandwritingPad({ onCommit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const current = useRef<Stroke | null>(null);
  const startTime = useRef(0);
  const [cands, setCands] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const ctx = () => canvasRef.current!.getContext('2d')!;

  const drawGrid = useCallback(() => {
    const c = ctx();
    c.clearRect(0, 0, SIZE, SIZE);
    c.save();
    c.strokeStyle = 'rgba(178, 34, 34, 0.18)';
    c.setLineDash([6, 6]);
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(SIZE / 2, 0);
    c.lineTo(SIZE / 2, SIZE);
    c.moveTo(0, SIZE / 2);
    c.lineTo(SIZE, SIZE / 2);
    c.moveTo(0, 0);
    c.lineTo(SIZE, SIZE);
    c.moveTo(SIZE, 0);
    c.lineTo(0, SIZE);
    c.stroke();
    c.restore();
  }, []);

  const redraw = useCallback(() => {
    drawGrid();
    const c = ctx();
    c.strokeStyle = '#1f1a17';
    c.lineWidth = 7;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    for (const [xs, ys] of strokes.current) {
      c.beginPath();
      xs.forEach((x, i) => (i ? c.lineTo(x, ys[i]) : c.moveTo(x, ys[i])));
      c.stroke();
    }
  }, [drawGrid]);

  useEffect(() => {
    const cv = canvasRef.current!;
    const dpr = window.devicePixelRatio || 1;
    cv.width = SIZE * dpr;
    cv.height = SIZE * dpr;
    ctx().scale(dpr, dpr);
    redraw();
  }, [redraw]);

  const recognize = useCallback(async () => {
    setStatus('loading');
    try {
      const result = await recognizeHandwriting(strokes.current, SIZE, SIZE);
      setCands(result.slice(0, 10));
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  }, []);

  const point = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return [
      ((e.clientX - r.left) / r.width) * SIZE,
      ((e.clientY - r.top) / r.height) * SIZE,
    ] as const;
  };

  const onDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    if (!strokes.current.length) startTime.current = Date.now();
    const [x, y] = point(e);
    current.current = [[x], [y], [Date.now() - startTime.current]];
  };

  const onMove = (e: React.PointerEvent) => {
    const s = current.current;
    if (!s) return;
    const [x, y] = point(e);
    s[0].push(x);
    s[1].push(y);
    s[2].push(Date.now() - startTime.current);
    const c = ctx();
    c.strokeStyle = '#1f1a17';
    c.lineWidth = 7;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(s[0].at(-2)!, s[1].at(-2)!);
    c.lineTo(x, y);
    c.stroke();
  };

  const onUp = () => {
    if (!current.current) return;
    strokes.current.push(current.current);
    current.current = null;
    recognize();
  };

  const clear = () => {
    strokes.current = [];
    setCands([]);
    redraw();
  };

  const undo = () => {
    strokes.current.pop();
    redraw();
    if (strokes.current.length) recognize();
    else setCands([]);
  };

  const pick = (ch: string) => {
    onCommit(ch);
    clear();
  };

  return (
    <div className="hw">
      <canvas
        ref={canvasRef}
        className="hw-canvas"
        style={{ width: SIZE, height: SIZE }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      />
      <div className="hw-side">
        <div className="hw-cands">
          {cands.map((c) => (
            <button key={c} className="cand big" onClick={() => pick(c)}>
              {c}
            </button>
          ))}
          {!cands.length && status === 'idle' && (
            <span className="muted">Viết một chữ Hán vào ô bên cạnh</span>
          )}
          {status === 'loading' && !cands.length && <span className="muted">Đang nhận dạng…</span>}
          {status === 'error' && <span className="muted">Lỗi kết nối, hãy thử lại.</span>}
        </div>
        <div className="row">
          <button className="btn ghost" onClick={undo}>↶ Hoàn tác</button>
          <button className="btn ghost" onClick={clear}>✕ Xoá</button>
        </div>
      </div>
    </div>
  );
}
