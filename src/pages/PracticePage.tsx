import { useEffect, useState } from 'react';
import StrokeOrder from '../components/StrokeOrder';
import { hasChinese, speak, toPinyin } from '../lib/chinese';
import { translate } from '../lib/api';

interface Props {
  initial: string;
}

/** Luyện viết: xem thứ tự nét, tự viết theo nét từng chữ. */
export default function PracticePage({ initial }: Props) {
  const [input, setInput] = useState(initial || '学习中文');
  const chars = [...new Set([...input].filter(hasChinese))];
  const [idx, setIdx] = useState(0);
  const [meaning, setMeaning] = useState('');

  useEffect(() => {
    if (initial) {
      setInput(initial);
      setIdx(0);
    }
  }, [initial]);

  const char = chars[Math.min(idx, chars.length - 1)];

  useEffect(() => {
    if (!char) return;
    let alive = true;
    setMeaning('');
    translate(char, 'vi')
      .then((r) => alive && setMeaning(r.text))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [char]);

  return (
    <div className="grid two">
      <section className="card">
        <h2>Chọn chữ để luyện</h2>
        <input
          className="ime-input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setIdx(0);
          }}
          placeholder="Nhập chữ Hán…"
        />
        <div className="char-list">
          {chars.map((c, i) => (
            <button key={c} className={'char-tile' + (c === char ? ' on' : '')} onClick={() => setIdx(i)}>
              <span>{c}</span>
              <small>{toPinyin(c)}</small>
            </button>
          ))}
          {!chars.length && <p className="muted">Chưa có chữ Hán nào.</p>}
        </div>
        <p className="muted small">
          Mẹo: bấm “Luyện viết”, rồi dùng chuột hoặc ngón tay viết từng nét lên ô chữ. Viết sai nhiều lần,
          ứng dụng sẽ gợi ý nét tiếp theo.
        </p>
      </section>

      <section className="card center-col">
        {char ? (
          <>
            <div className="char-head">
              <button className="w-hanzi xl" onClick={() => speak(char)} title="Nghe">{char}</button>
              <div>
                <div className="w-py big">{toPinyin(char)}</div>
                <div className="w-mean">{meaning || '…'}</div>
              </div>
            </div>
            <StrokeOrder key={char} char={char} />
            <div className="row center">
              <button className="btn ghost" disabled={idx <= 0} onClick={() => setIdx(idx - 1)}>← Trước</button>
              <span className="muted">{Math.min(idx, chars.length - 1) + 1} / {chars.length}</span>
              <button className="btn ghost" disabled={idx >= chars.length - 1} onClick={() => setIdx(idx + 1)}>Sau →</button>
            </div>
          </>
        ) : (
          <p className="empty">Nhập chữ Hán ở bên trái.</p>
        )}
      </section>
    </div>
  );
}
