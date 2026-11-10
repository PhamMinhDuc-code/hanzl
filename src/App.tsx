import { useEffect, useState } from 'react';
import LookupPage from './pages/LookupPage';
import PracticePage from './pages/PracticePage';
import VocabPage from './pages/VocabPage';
import { useVocab } from './lib/vocab';
import { getVoiceMode, setVoiceMode, speak, type VoiceMode } from './lib/chinese';

type Tab = 'lookup' | 'practice' | 'vocab';

export default function App() {
  const [tab, setTab] = useState<Tab>('lookup');
  const [practiceText, setPracticeText] = useState('');
  const vocab = useVocab();
  const [voice, setVoice] = useState<VoiceMode>(getVoiceMode());
  const [toast, setToast] = useState('');

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const onToast = (e: Event) => {
      setToast((e as CustomEvent<string>).detail);
      clearTimeout(t);
      t = setTimeout(() => setToast(''), 5000);
    };
    window.addEventListener('hanzi-toast', onToast);
    return () => window.removeEventListener('hanzi-toast', onToast);
  }, []);

  const changeVoice = (m: VoiceMode) => {
    setVoice(m);
    setVoiceMode(m);
    speak('你好');
  };

  const goPractice = (text: string) => {
    setPracticeText(text);
    setTab('practice');
  };

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <span className="seal">汉</span>
          <div>
            <h1>Hán Tự Học</h1>
            <p>Gõ · Viết · Phiên âm · Dịch nghĩa</p>
          </div>
        </div>
        <div className="row wrap">
        <label className="voice small" title="Chọn nguồn giọng đọc">
          🔊
          <select value={voice} onChange={(e) => changeVoice(e.target.value as VoiceMode)}>
            <option value="auto">Giọng: Tự động</option>
            <option value="device">Giọng máy</option>
            <option value="online">Giọng online</option>
          </select>
        </label>
        <nav className="tabs">
          <button className={tab === 'lookup' ? 'on' : ''} onClick={() => setTab('lookup')}>Tra cứu</button>
          <button className={tab === 'practice' ? 'on' : ''} onClick={() => setTab('practice')}>Luyện viết</button>
          <button className={tab === 'vocab' ? 'on' : ''} onClick={() => setTab('vocab')}>
            Sổ từ {vocab.items.length > 0 && <span className="badge">{vocab.items.length}</span>}
          </button>
        </nav>
        </div>
      </header>

      <main>
        {tab === 'lookup' && <LookupPage vocab={vocab} onPractice={goPractice} />}
        {tab === 'practice' && <PracticePage initial={practiceText} />}
        {tab === 'vocab' && <VocabPage vocab={vocab} onPractice={goPractice} />}
      </main>

      {toast && (
        <div className="toast" role="status" onClick={() => setToast('')}>
          {toast}
        </div>
      )}

      <footer className="foot">
        Phiên âm: pinyin-pro · Thứ tự nét: Hanzi Writer · Dịch &amp; nhận dạng: Google / MyMemory
      </footer>
    </div>
  );
}
