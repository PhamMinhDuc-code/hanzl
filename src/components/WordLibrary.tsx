import { useMemo, useState } from 'react';
import { TOPICS, type LibWord } from '../data/words';
import { HSK_LEVELS } from '../data/hsk';
import { speak, toPinyin } from '../lib/chinese';
import type { useVocab } from '../lib/vocab';

interface Props {
  vocab: ReturnType<typeof useVocab>;
  onSelect: (hanzi: string) => void;
}

const PAGE = 30;

/** Bỏ dấu tiếng Việt / dấu thanh pinyin để tìm kiếm dễ hơn. */
const norm = (s: string) =>
  s.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/\s+/g, '');

const pyOf = (w: LibWord) => w.py ?? toPinyin(w.hanzi.replace(/[，。？！]/g, ''));

const ALL_WORDS: LibWord[] = (() => {
  const seen = new Set<string>();
  return [...HSK_LEVELS, ...TOPICS]
    .flatMap((g) => g.words)
    .filter((w) => (seen.has(w.hanzi) ? false : (seen.add(w.hanzi), true)));
})();

type Mode = 'topic' | 'hsk';

/** Thư viện từ có sẵn: theo chủ đề hoặc theo cấp độ HSK 1–3. */
export default function WordLibrary({ vocab, onSelect }: Props) {
  const [mode, setMode] = useState<Mode>('topic');
  const [topicId, setTopicId] = useState(TOPICS[0].id);
  const [levelId, setLevelId] = useState(HSK_LEVELS[0].id);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');

  const group =
    mode === 'topic' ? TOPICS.find((t) => t.id === topicId)! : HSK_LEVELS.find((l) => l.id === levelId)!;
  const paged = mode === 'hsk';
  const pages = paged ? Math.ceil(group.words.length / PAGE) : 1;

  const list = useMemo(() => {
    const q = norm(query);
    if (q) {
      return ALL_WORDS.filter(
        (w) => w.hanzi.includes(query.trim()) || norm(pyOf(w)).includes(q) || norm(w.vi).includes(q),
      ).slice(0, 60);
    }
    return paged ? group.words.slice(page * PAGE, page * PAGE + PAGE) : group.words;
  }, [query, group, page, paged]);

  const savedInList = list.filter((w) => vocab.has(w.hanzi)).length;
  const saveAll = () =>
    list.forEach((w) => vocab.add({ hanzi: w.hanzi, pinyin: pyOf(w), meaning: w.vi }));

  const switchMode = (m: Mode) => {
    setMode(m);
    setPage(0);
  };

  return (
    <section className="card library">
      <div className="card-head">
        <h2>📚 Từ có sẵn để học</h2>
        <div className="row wrap">
          <input
            className="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm trong ~600 từ: 你好 / ni hao / xin chào"
          />
          <button className="btn ghost" onClick={saveAll} disabled={!list.length}>
            ☆ Lưu {list.length} từ đang xem
          </button>
        </div>
      </div>

      {!query && (
        <>
          <div className="row wrap lib-nav">
            <div className="seg">
              <button className={mode === 'topic' ? 'on' : ''} onClick={() => switchMode('topic')}>Theo chủ đề</button>
              <button className={mode === 'hsk' ? 'on' : ''} onClick={() => switchMode('hsk')}>Theo HSK</button>
            </div>
            <span className="muted small">
              Đã lưu {savedInList}/{list.length} từ ở trang này
            </span>
          </div>

          <div className="topics">
            {mode === 'topic' &&
              TOPICS.map((t) => (
                <button key={t.id} className={'topic' + (t.id === topicId ? ' on' : '')} onClick={() => setTopicId(t.id)}>
                  <span>{t.icon}</span> {t.name} <small>{t.words.length}</small>
                </button>
              ))}
            {mode === 'hsk' &&
              HSK_LEVELS.map((l) => (
                <button
                  key={l.id}
                  className={'topic hsk' + (l.id === levelId ? ' on' : '')}
                  onClick={() => {
                    setLevelId(l.id);
                    setPage(0);
                  }}
                >
                  {l.name} <small>{l.words.length} từ</small>
                </button>
              ))}
          </div>

          {paged && pages > 1 && (
            <div className="pages">
              {Array.from({ length: pages }, (_, i) => {
                const from = i * PAGE + 1;
                const to = Math.min((i + 1) * PAGE, group.words.length);
                return (
                  <button key={i} className={'page' + (i === page ? ' on' : '')} onClick={() => setPage(i)}>
                    Phần {i + 1}
                    <small>{from}–{to}</small>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      <div className="lib-grid">
        {list.map((w) => {
          const saved = vocab.has(w.hanzi);
          return (
            <div key={w.hanzi} className="lib-word">
              <button className="lib-main" onClick={() => onSelect(w.hanzi)} title="Tra cứu từ này">
                <span className="lib-py">{pyOf(w)}</span>
                <span className="lib-hanzi">{w.hanzi}</span>
                <span className="lib-vi">{w.vi}</span>
              </button>
              <div className="lib-actions">
                <button className="icon" title="Nghe" onClick={() => speak(w.hanzi)}>🔊</button>
                <button
                  className={'icon' + (saved ? ' saved' : '')}
                  title={saved ? 'Đã lưu' : 'Lưu vào sổ từ'}
                  onClick={() => vocab.add({ hanzi: w.hanzi, pinyin: pyOf(w), meaning: w.vi })}
                >
                  {saved ? '★' : '☆'}
                </button>
              </div>
            </div>
          );
        })}
        {!list.length && <p className="muted">Không tìm thấy từ nào.</p>}
      </div>

      {paged && !query && pages > 1 && (
        <div className="row center lib-foot">
          <button className="btn ghost" disabled={page === 0} onClick={() => setPage(page - 1)}>← Phần trước</button>
          <span className="muted small">{page + 1} / {pages}</span>
          <button className="btn ghost" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Phần sau →</button>
        </div>
      )}
    </section>
  );
}
