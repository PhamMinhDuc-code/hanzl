import { useCallback, useEffect, useState } from 'react';

export interface VocabItem {
  hanzi: string;
  pinyin: string;
  meaning: string;
  addedAt: number;
  known?: boolean;
}

const KEY = 'hanzi-hoc:vocab';

function load(): VocabItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

/** Sổ từ vựng lưu trong localStorage của trình duyệt. */
export function useVocab() {
  const [items, setItems] = useState<VocabItem[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* bộ nhớ đầy hoặc bị chặn — bỏ qua */
    }
  }, [items]);

  const add = useCallback((item: Omit<VocabItem, 'addedAt'>) => {
    setItems((prev) =>
      prev.some((v) => v.hanzi === item.hanzi)
        ? prev
        : [{ ...item, addedAt: Date.now() }, ...prev],
    );
  }, []);

  const remove = useCallback((hanzi: string) => {
    setItems((prev) => prev.filter((v) => v.hanzi !== hanzi));
  }, []);

  const toggleKnown = useCallback((hanzi: string) => {
    setItems((prev) => prev.map((v) => (v.hanzi === hanzi ? { ...v, known: !v.known } : v)));
  }, []);

  const has = useCallback((hanzi: string) => items.some((v) => v.hanzi === hanzi), [items]);

  return { items, add, remove, toggleKnown, has };
}
