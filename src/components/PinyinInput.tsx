import { useEffect, useRef, useState } from 'react';
import { pinyinToHanzi, type ImeCandidate } from '../lib/api';

interface Props {
  onCommit: (text: string) => void;
  onBackspace: () => void;
}

/**
 * Bộ gõ pinyin tích hợp: gõ "nihao" → chọn 你好.
 * Ô này CHỈ nhận chữ Latin; chữ Latin không bao giờ bị chèn vào văn bản tiếng Trung.
 * Phím: Space / Enter chọn chữ đầu, 1–9 chọn nhanh, Esc xoá.
 */
export default function PinyinInput({ onCommit, onBackspace }: Props) {
  const [buffer, setBuffer] = useState('');
  const [cands, setCands] = useState<ImeCandidate[]>([]);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!buffer) {
      setCands([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      pinyinToHanzi(buffer, ctrl.signal)
        .then((c) => {
          setCands(c);
          setError(false);
        })
        .catch((e) => {
          if (e.name !== 'AbortError') setError(true);
        });
    }, 120);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [buffer]);

  const pick = (c: ImeCandidate) => {
    onCommit(c.hanzi);
    setBuffer((b) => b.slice(c.consumed));
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && buffer) {
      e.preventDefault();
      if (cands[0]) pick(cands[0]);
    } else if (/^[1-9]$/.test(e.key) && buffer) {
      e.preventDefault();
      const c = cands[Number(e.key) - 1];
      if (c) pick(c);
    } else if (e.key === 'Escape') {
      setBuffer('');
    } else if (e.key === 'Backspace' && !buffer) {
      e.preventDefault();
      onBackspace();
    }
  };

  return (
    <div className="ime">
      <div className="ime-head">
        <span className="ime-tag">ABC → 汉字</span>
        <span className="ime-title">Ô gõ pinyin</span>
        <span className="muted small">chỉ nhập chữ Latin, chọn chữ Hán ở thanh bên dưới</span>
      </div>
      <input
        ref={inputRef}
        className="ime-input"
        value={buffer}
        placeholder="nihao, xiexie, zhongguo…"
        onChange={(e) => setBuffer(e.target.value.replace(/[^a-zA-Z']/g, '').toLowerCase())}
        onKeyDown={onKeyDown}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        lang="en"
      />
      <div className="cand-bar" aria-live="polite">
        {error && <span className="muted">Không kết nối được bộ gõ. Hãy dùng bộ gõ của máy.</span>}
        {!error && buffer && cands.length === 0 && <span className="muted">…</span>}
        {cands.map((c, i) => (
          <button key={c.hanzi + i} className="cand" onClick={() => pick(c)}>
            <small>{i + 1}</small>
            {c.hanzi}
          </button>
        ))}
        {!buffer && (
          <span className="muted">Space / Enter chọn chữ đầu · 1–9 chọn nhanh · ⌫ khi ô trống để xoá chữ Hán</span>
        )}
      </div>
    </div>
  );
}
