import { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';

interface Props {
  char: string;
  size?: number;
}

/** Hiển thị thứ tự nét và chế độ luyện viết theo nét (hanzi-writer). */
export default function StrokeOrder({ char, size = 260 }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const host = hostRef.current!;
    host.innerHTML = '';
    setMsg('');
    try {
      writerRef.current = HanziWriter.create(host, char, {
        width: size,
        height: size,
        padding: 12,
        showOutline: true,
        strokeColor: '#1f1a17',
        radicalColor: '#b22222',
        outlineColor: '#e8dccb',
        highlightColor: '#d4793a',
        drawingColor: '#1f1a17',
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 220,
        onLoadCharDataError: () => setMsg('Chưa có dữ liệu nét cho chữ này.'),
      });
    } catch {
      setMsg('Không tải được chữ.');
    }
    return () => {
      writerRef.current = null;
    };
  }, [char, size]);

  const animate = () => {
    setMsg('');
    writerRef.current?.animateCharacter();
  };

  const quiz = () => {
    setMsg('Hãy viết từng nét theo đúng thứ tự…');
    writerRef.current?.quiz({
      onComplete: ({ totalMistakes }) =>
        setMsg(totalMistakes === 0 ? 'Hoàn hảo! 🎉' : `Xong! Sai ${totalMistakes} lần.`),
    });
  };

  return (
    <div className="stroke">
      <div ref={hostRef} className="stroke-box" style={{ width: size, height: size }} />
      <div className="row center">
        <button className="btn" onClick={animate}>▶ Xem thứ tự nét</button>
        <button className="btn accent" onClick={quiz}>✍ Luyện viết</button>
      </div>
      {msg && <p className="muted center-text">{msg}</p>}
    </div>
  );
}
