import { useMemo, useState } from 'react';
import { speak } from '../lib/chinese';
import type { useVocab } from '../lib/vocab';

interface Props {
  vocab: ReturnType<typeof useVocab>;
  onPractice: (text: string) => void;
}

/** Sổ từ vựng + thẻ ghi nhớ (flashcard). */
export default function VocabPage({ vocab, onPractice }: Props) {
  const [mode, setMode] = useState<'list' | 'cards'>('list');
  const [onlyNew, setOnlyNew] = useState(false);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deck = useMemo(
    () => (onlyNew ? vocab.items.filter((v) => !v.known) : vocab.items),
    [vocab.items, onlyNew],
  );
  const card = deck[i % Math.max(deck.length, 1)];

  const next = () => {
    setFlipped(false);
    setI((n) => (deck.length ? (n + 1) % deck.length : 0));
  };

  if (!vocab.items.length) {
    return (
      <section className="card">
        <p className="empty">
          Sổ từ đang trống. Ở trang <b>Tra cứu</b>, bấm ☆ cạnh một từ để lưu vào đây.
        </p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card-head">
        <h2>Sổ từ vựng <span className="muted">({vocab.items.length})</span></h2>
        <div className="row">
          <label className="small">
            <input type="checkbox" checked={onlyNew} onChange={(e) => { setOnlyNew(e.target.checked); setI(0); }} /> Chỉ từ chưa thuộc
          </label>
          <div className="seg">
            <button className={mode === 'list' ? 'on' : ''} onClick={() => setMode('list')}>Danh sách</button>
            <button className={mode === 'cards' ? 'on' : ''} onClick={() => setMode('cards')}>Thẻ ghi nhớ</button>
          </div>
        </div>
      </div>

      {mode === 'list' && (
        <ul className="words">
          {deck.map((v) => (
            <li key={v.hanzi} className={v.known ? 'known' : ''}>
              <button className="w-hanzi" onClick={() => speak(v.hanzi)}>{v.hanzi}</button>
              <div className="w-info">
                <span className="w-py">{v.pinyin}</span>
                <span className="w-mean">{v.meaning}</span>
              </div>
              <div className="w-actions">
                <button className="icon" title="Đánh dấu đã thuộc" onClick={() => vocab.toggleKnown(v.hanzi)}>
                  {v.known ? '✔' : '○'}
                </button>
                <button className="icon" title="Luyện viết" onClick={() => onPractice(v.hanzi)}>✍</button>
                <button className="icon" title="Xoá" onClick={() => vocab.remove(v.hanzi)}>🗑</button>
              </div>
            </li>
          ))}
          {!deck.length && <p className="muted">Bạn đã thuộc hết! 🎉</p>}
        </ul>
      )}

      {mode === 'cards' && card && (
        <div className="flash-wrap">
          <button className={'flash' + (flipped ? ' flipped' : '')} onClick={() => setFlipped(!flipped)}>
            <div className="face front">
              <span className="flash-hanzi">{card.hanzi}</span>
              <span className="muted small">Bấm để lật</span>
            </div>
            <div className="face back">
              <span className="w-py big">{card.pinyin}</span>
              <span className="flash-mean">{card.meaning}</span>
            </div>
          </button>
          <div className="row center">
            <button className="btn ghost" onClick={() => speak(card.hanzi)}>🔊 Nghe</button>
            <button className="btn ghost" onClick={next}>Chưa thuộc →</button>
            <button className="btn accent" onClick={() => { if (!card.known) vocab.toggleKnown(card.hanzi); next(); }}>
              Đã thuộc ✔
            </button>
          </div>
          <p className="muted center-text small">{(i % deck.length) + 1} / {deck.length}</p>
        </div>
      )}
      {mode === 'cards' && !card && <p className="muted">Bạn đã thuộc hết! 🎉</p>}
    </section>
  );
}
