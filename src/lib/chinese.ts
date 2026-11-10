import { pinyin } from 'pinyin-pro';

export type PinyinStyle = 'symbol' | 'num' | 'none';

export interface RubyToken {
  char: string;
  py: string; // rỗng nếu không phải chữ Hán
}

const HAN = /\p{Script=Han}/u;

export const hasChinese = (s: string) => HAN.test(s);

/** Phiên âm cả câu, tự xử lý đa âm theo ngữ cảnh (pinyin-pro). */
export function toPinyin(text: string, style: PinyinStyle = 'symbol'): string {
  return pinyin(text, { toneType: style, nonZh: 'consecutive' });
}

/** Tách từng ký tự kèm pinyin để hiển thị dạng <ruby>. */
export function toRuby(text: string, style: PinyinStyle = 'symbol'): RubyToken[] {
  const arr = pinyin(text, { type: 'all', toneType: style });
  return arr.map((t) => ({ char: t.origin, py: t.isZh ? t.pinyin : '' }));
}

/** Tách từ tiếng Trung bằng Intl.Segmenter (có sẵn trong trình duyệt hiện đại). */
export function segmentWords(text: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: typeof Intl.Segmenter }).Segmenter;
  if (!Seg) {
    // Trình duyệt cũ: tách theo từng chữ
    return [...text].filter((c) => hasChinese(c));
  }
  const seg = new Seg('zh', { granularity: 'word' });
  const out: string[] = [];
  for (const s of seg.segment(text)) {
    if (s.isWordLike && hasChinese(s.segment) && !out.includes(s.segment)) out.push(s.segment);
  }
  return out;
}

/* ---------- Phát âm ---------- */

export type VoiceMode = 'auto' | 'device' | 'online';
const VOICE_KEY = 'hanzi-hoc:voice';

let voiceMode: VoiceMode = (() => {
  try {
    return (localStorage.getItem(VOICE_KEY) as VoiceMode) || 'auto';
  } catch {
    return 'auto';
  }
})();

export const getVoiceMode = () => voiceMode;
export function setVoiceMode(m: VoiceMode) {
  voiceMode = m;
  try {
    localStorage.setItem(VOICE_KEY, m);
  } catch {
    /* bỏ qua */
  }
}

const synth: SpeechSynthesis | undefined =
  typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : undefined;
let voices: SpeechSynthesisVoice[] = [];
const loadVoices = () => {
  voices = synth?.getVoices() ?? [];
};
if (synth) {
  loadVoices();
  // Chrome tải danh sách giọng bất đồng bộ
  synth.addEventListener?.('voiceschanged', loadVoices);
}

/** Tìm giọng tiếng Trung phổ thông trên máy (ưu tiên zh-CN). */
function findZhVoice(): SpeechSynthesisVoice | undefined {
  if (!voices.length) loadVoices();
  const zh = voices.filter((v) => /^(zh|cmn)/i.test(v.lang.replace('_', '-')));
  return (
    zh.find((v) => /zh-CN|cmn-Hans/i.test(v.lang.replace('_', '-'))) ??
    zh.find((v) => !/HK|yue/i.test(v.lang)) ??
    zh[0]
  );
}

export const hasDeviceVoice = () => !!findZhVoice();

function toast(msg: string) {
  window.dispatchEvent(new CustomEvent('hanzi-toast', { detail: msg }));
}

let audio: HTMLAudioElement | null = null;
/** Giọng online (Google TTS) — phát qua thẻ audio nên không bị CORS chặn. */
function speakOnline(text: string): Promise<void> {
  synth?.cancel();
  audio?.pause();
  audio = new Audio(
    'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=zh-CN&ttsspeed=0.8' +
      `&q=${encodeURIComponent(text)}`,
  );
  return audio.play();
}

// Giữ tham chiếu để Chrome không thu gom utterance giữa chừng (lỗi đọc bị ngắt)
let current: SpeechSynthesisUtterance | null = null;

function speakDevice(text: string, voice: SpeechSynthesisVoice | undefined, rate: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!synth) return reject(new Error('no speechSynthesis'));
    audio?.pause();
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    if (voice) u.voice = voice;
    u.rate = rate;
    u.onend = () => resolve();
    u.onerror = (e) =>
      e.error === 'interrupted' || e.error === 'canceled' ? resolve() : reject(new Error(e.error));
    current = u;
    // Chrome: gọi speak() ngay sau cancel() thường bị im lặng → đợi một nhịp
    setTimeout(() => {
      synth.resume();
      synth.speak(u);
    }, 80);
  });
}

/** Đọc to tiếng Trung. Tự chọn giọng máy hoặc giọng online, lỗi thì chuyển sang cách còn lại. */
export async function speak(text: string, rate = 0.85) {
  const t = text.trim().slice(0, 200);
  if (!t) return;
  const voice = findZhVoice();
  const useDevice = voiceMode === 'device' || (voiceMode === 'auto' && !!voice);

  try {
    if (useDevice) await speakDevice(t, voice, rate);
    else await speakOnline(t);
  } catch {
    try {
      if (useDevice) await speakOnline(t);
      else if (synth) await speakDevice(t, voice, rate);
      else throw new Error();
    } catch {
      toast('Không phát được âm thanh. Hãy kiểm tra loa/kết nối mạng, hoặc cài giọng đọc tiếng Trung cho máy.');
    }
  }
  void current;
}
