/**
 * Các API công khai gọi trực tiếp từ trình duyệt (không cần backend).
 * - Dịch: Google Translate (client=gtx), dự phòng MyMemory.
 * - Gõ pinyin → chữ Hán: Google Input Tools.
 * - Nhận dạng chữ viết tay: Google Input Tools (handwriting).
 */

export type TargetLang = 'vi' | 'en';

export interface DictEntry {
  pos: string; // từ loại (noun, verb...)
  terms: string[];
}

export interface TranslationResult {
  text: string;
  dict: DictEntry[];
  source: 'google' | 'mymemory';
}

const cache = new Map<string, TranslationResult>();

async function translateGoogle(q: string, tl: TargetLang): Promise<TranslationResult> {
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN' +
    `&tl=${tl}&dt=t&dt=bd&q=${encodeURIComponent(q)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google ${res.status}`);
  const data = (await res.json()) as unknown[];

  const sentences = (data[0] as [string][] | null) ?? [];
  const text = sentences.map((s) => s[0]).join('');

  const dict: DictEntry[] = [];
  const rawDict = data[1] as [string, string[]][] | null;
  if (Array.isArray(rawDict)) {
    for (const d of rawDict) {
      if (typeof d?.[0] === 'string' && Array.isArray(d[1])) {
        dict.push({ pos: d[0], terms: d[1].slice(0, 6) });
      }
    }
  }
  return { text, dict, source: 'google' };
}

async function translateMyMemory(q: string, tl: TargetLang): Promise<TranslationResult> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=zh-CN|${tl}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory ${res.status}`);
  const data = await res.json();
  return { text: data?.responseData?.translatedText ?? '', dict: [], source: 'mymemory' };
}

export async function translate(q: string, tl: TargetLang): Promise<TranslationResult> {
  const text = q.trim();
  if (!text) return { text: '', dict: [], source: 'google' };
  const key = `${tl}:${text}`;
  const hit = cache.get(key);
  if (hit) return hit;

  let result: TranslationResult;
  try {
    result = await translateGoogle(text, tl);
  } catch {
    result = await translateMyMemory(text, tl);
  }
  cache.set(key, result);
  return result;
}

/* ---------- Gõ pinyin → chữ Hán ---------- */

export interface ImeCandidate {
  hanzi: string;
  consumed: number; // số ký tự pinyin mà ứng viên này "ăn"
}

export async function pinyinToHanzi(
  pinyin: string,
  signal?: AbortSignal,
): Promise<ImeCandidate[]> {
  const text = pinyin.trim().toLowerCase();
  if (!text) return [];
  const url =
    'https://inputtools.google.com/request?itc=zh-t-i0-pinyin&num=12&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage' +
    `&text=${encodeURIComponent(text)}`;
  const res = await fetch(url, { signal });
  const data = await res.json();
  if (data?.[0] !== 'SUCCESS') return [];

  const item = data[1]?.[0];
  const words: string[] = item?.[1] ?? [];
  const lengths: number[] | undefined = item?.[3]?.matched_length;
  return words.map((hanzi, i) => ({
    hanzi,
    consumed: lengths?.[i] ?? text.length,
  }));
}

/* ---------- Nhận dạng chữ viết tay ---------- */

/** Một nét = [mảng x[], mảng y[], mảng thời gian[]] */
export type Stroke = [number[], number[], number[]];

export async function recognizeHandwriting(
  strokes: Stroke[],
  width: number,
  height: number,
): Promise<string[]> {
  if (strokes.length === 0) return [];
  const res = await fetch(
    'https://inputtools.google.com/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        options: 'enable_pre_space',
        requests: [
          {
            writing_guide: { writing_area_width: width, writing_area_height: height },
            ink: strokes,
            language: 'zh_CN',
          },
        ],
      }),
    },
  );
  const data = await res.json();
  if (data?.[0] !== 'SUCCESS') return [];
  return (data[1]?.[0]?.[1] as string[] | undefined) ?? [];
}
