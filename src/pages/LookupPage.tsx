import { useEffect, useRef, useState } from 'react';
import PinyinInput from '../components/PinyinInput';
import HandwritingPad from '../components/HandwritingPad';
import WordLibrary from '../components/WordLibrary';
import { LOCAL_DICT } from '../data/words';
import { translate, type TargetLang, type TranslationResult } from '../lib/api';
import { hasChinese, segmentWords, speak, toPinyin, toRuby, type PinyinStyle } from '../lib/chinese';
import type { useVocab } from '../lib/vocab';

interface Props {
  vocab: ReturnType<typeof useVocab>;
  onPractice: (text: string) => void;
}

interface WordInfo {
  word: string;
  pinyin: string;
  meaning?: string;
}

const MAX_WORDS = 24;

/** Nghĩa offline từ thư viện (chỉ có tiếng Việt). */
const localMeaning = (w: string, lang: TargetLang) => (lang === 'vi' ? LOCAL_DICT.get(w)?.vi : undefined);
const SAMPLES = ['你好，很高兴认识你。', '我在学习中文。', '今天天气怎么样？', '谢谢', '学习'];

export default function LookupPage({ vocab, onPractice }: Props) {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'ime' | 'hand' | 'system'>('ime');
  const [lang, setLang] = useState<TargetLang>('vi');
  const [style, setStyle] = useState<PinyinStyle>('symbol');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [words, setWords] = useState<WordInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Tự động dịch khi ngừng gõ 500ms
  useEffect(() => {
    const q = text.trim();
    if (!q || !hasChinese(q)) {
      setResult(null);
      setWords([]);
      setError('');
      return;
    }
    let alive = true;
    const t = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const segs = segmentWords(q).slice(0, MAX_WORDS);
        const base = segs.map((w) => ({ word: w, pinyin: toPinyin(w, style), meaning: localMeaning(w, lang) }));
        setWords(base);
        const local = localMeaning(q, lang);
        if (local) setResult({ text: local, dict: [], source: 'google' });
        let main: TranslationResult;
        try {
          main = await translate(q, lang);
          if (local) main = { ...main, text: local };
        } catch (e) {
          if (!local) throw e;
          main = { text: local, dict: [], source: 'google' };
        }
        if (!alive) return;
        setResult(main);
        // Dịch từng từ (song song) — bỏ qua nếu cả câu chỉ là một từ
        if (segs.length > 1) {
          const meanings = await Promise.all(
            segs.map((w) => localMeaning(w, lang) ?? translate(w, lang).then((r) => r.text).catch(() => '')),
          );
          if (alive) setWords(base.map((b, i) => ({ ...b, meaning: meanings[i] })));
        } else if (segs.length === 1) {
          setWords([{ ...base[0], meaning: main.text }]);
        }
      } catch {
        if (alive) setError('Không dịch được. Kiểm tra kết nối mạng và thử lại.');
      } finally {
        if (alive) setLoading(false);
      }
    }, 500);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [text, lang, style]);

  const insert = (s: string) => {
    const el = textRef.current;
    if (!el) return setText((t) => t + s);
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const next = text.slice(0, start) + s + text.slice(end);
    setText(next);
    requestAnimationFrame(() => el.setSelectionRange(start + s.length, start + s.length));
  };

  const backspace = () => {
    const el = textRef.current;
    const pos = el?.selectionStart ?? text.length;
    if (pos === 0) return;
    const chars = [...text.slice(0, pos)];
    chars.pop();
    const head = chars.join('');
    setText(head + text.slice(pos));
    requestAnimationFrame(() => el?.setSelectionRange(head.length, head.length));
  };

  const q = text.trim();
  const ruby = q && hasChinese(q) ? toRuby(q, style) : [];

  const pickFromLibrary = (hanzi: string) => {
    setText(hanzi);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
    <div className="grid two">
      {/* ----- Cột nhập ----- */}
      <section className="card">
        <div className="card-head">
          <h2>Nhập tiếng Trung</h2>
          <div className="seg">
            <button className={mode === 'ime' ? 'on' : ''} onClick={() => setMode('ime')}>Gõ pinyin</button>
            <button className={mode === 'hand' ? 'on' : ''} onClick={() => setMode('hand')}>Viết tay</button>
            <button className={mode === 'system' ? 'on' : ''} onClick={() => setMode('system')}>Bộ gõ máy</button>
          </div>
        </div>

        {mode === 'ime' && <PinyinInput onCommit={insert} onBackspace={backspace} />}
        {mode === 'hand' && <HandwritingPad onCommit={insert} />}
        {mode === 'system' && (
          <p className="muted">Gõ trực tiếp vào ô dưới bằng bộ gõ tiếng Trung của máy, hoặc dán văn bản.</p>
        )}

        <label className="text-label" htmlFor="main-text">
          <span className="ime-tag red">汉字</span> Văn bản tiếng Trung
          <span className="muted small">— chữ Hán đã chọn sẽ hiện ở đây</span>
        </label>
        <textarea
          id="main-text"
          ref={textRef}
          className="main-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="中文写在这里… (văn bản tiếng Trung)"
          rows={4}
        />

        <div className="row wrap">
          <button className="btn ghost" onClick={() => setText('')} disabled={!text}>Xoá hết</button>
          <button className="btn ghost" onClick={() => speak(q)} disabled={!q}>🔊 Nghe</button>
          <button className="btn ghost" onClick={() => onPractice(q)} disabled={!q}>✍ Luyện viết</button>
          <span className="spacer" />
          <span className="muted small">Ví dụ:</span>
          {SAMPLES.map((s) => (
            <button key={s} className="chip" onClick={() => setText(s)}>{s}</button>
          ))}
        </div>
      </section>

      {/* ----- Cột kết quả ----- */}
      <section className="card">
        <div className="card-head">
          <h2>Kết quả</h2>
          <div className="row">
            <select value={style} onChange={(e) => setStyle(e.target.value as PinyinStyle)} aria-label="Kiểu pinyin">
              <option value="symbol">nǐ hǎo</option>
              <option value="num">ni3 hao3</option>
              <option value="none">ni hao</option>
            </select>
            <select value={lang} onChange={(e) => setLang(e.target.value as TargetLang)} aria-label="Ngôn ngữ dịch">
              <option value="vi">→ Tiếng Việt</option>
              <option value="en">→ English</option>
            </select>
          </div>
        </div>

        {!ruby.length && <p className="empty">Nhập chữ Hán để xem phiên âm và nghĩa.</p>}

        {ruby.length > 0 && (
          <>
            <div className="ruby-line" lang="zh-CN">
              {ruby.map((t, i) =>
                t.py ? (
                  <ruby key={i}>
                    {t.char}
                    <rt>{t.py}</rt>
                  </ruby>
                ) : (
                  <span key={i}>{t.char}</span>
                ),
              )}
            </div>
            <p className="pinyin-plain">{toPinyin(q, style)}</p>

            <div className="translation">
              <span className="label">Nghĩa</span>
              {loading && !result ? (
                <p className="muted">Đang dịch…</p>
              ) : (
                <p>{result?.text}</p>
              )}
              {error && <p className="error">{error}</p>}
            </div>

            {result && result.dict.length > 0 && (
              <div className="dict">
                {result.dict.map((d) => (
                  <div key={d.pos}>
                    <span className="pos">{d.pos}</span> {d.terms.join(', ')}
                  </div>
                ))}
              </div>
            )}

            {words.length > 0 && (
              <>
                <h3>Phân tích từng từ</h3>
                <ul className="words">
                  {words.map((w) => (
                    <li key={w.word}>
                      <button className="w-hanzi" onClick={() => speak(w.word)} title="Nghe">
                        {w.word}
                      </button>
                      <div className="w-info">
                        <span className="w-py">{w.pinyin}</span>
                        <span className="w-mean">{w.meaning ?? '…'}</span>
                      </div>
                      <div className="w-actions">
                        <button className="icon" title="Luyện viết" onClick={() => onPractice(w.word)}>✍</button>
                        <button
                          className={'icon' + (vocab.has(w.word) ? ' saved' : '')}
                          title={vocab.has(w.word) ? 'Đã lưu' : 'Lưu vào sổ từ'}
                          onClick={() =>
                            vocab.add({ hanzi: w.word, pinyin: toPinyin(w.word), meaning: w.meaning ?? '' })
                          }
                        >
                          {vocab.has(w.word) ? '★' : '☆'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </section>
    </div>
    <WordLibrary vocab={vocab} onSelect={pickFromLibrary} />
    </>
  );
}
