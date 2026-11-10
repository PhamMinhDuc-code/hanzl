# Hán Tự Học — Web học tiếng Trung

Ứng dụng **chỉ có frontend** (React + TypeScript + Vite), không cần backend, deploy thẳng lên Vercel.

## Tính năng

| Trang | Chức năng |
|---|---|
| **Tra cứu** | Gõ pinyin ra chữ Hán (bộ gõ tích hợp), viết tay, hoặc dùng bộ gõ của máy · Phiên âm pinyin dạng ruby trên đầu chữ (xử lý chữ đa âm) · Dịch sang tiếng Việt / tiếng Anh · Tách từ, kèm nghĩa từng từ · Nghe phát âm · **Thư viện ~600 từ có sẵn**: 11 chủ đề + HSK 1–3 (chia mỗi phần 30 từ), tìm kiếm không dấu |
| **Luyện viết** | Xem hoạt ảnh thứ tự nét · Tự viết theo nét, có chấm điểm |
| **Sổ từ** | Lưu từ (localStorage) · Đánh dấu đã thuộc · Thẻ ghi nhớ (flashcard) |

## Chạy trên máy

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build ra thư mục dist/
```

Cần Node.js 20 trở lên.

## Deploy lên Vercel

**Cách 1: qua GitHub (khuyên dùng)**
1. Đẩy thư mục này lên một repo GitHub.
2. Vào https://vercel.com/new, chọn **Import** repo đó.
3. Vercel tự nhận Vite (`vercel.json` đã cấu hình sẵn) → bấm **Deploy**.

**Cách 2: dùng CLI**
```bash
npm i -g vercel
vercel          # bản preview
vercel --prod   # bản production
```

## Cấu trúc

```
src/
  lib/
    api.ts          # dịch, gõ pinyin, nhận dạng viết tay (gọi API công khai)
    chinese.ts      # phiên âm (pinyin-pro), tách từ (Intl.Segmenter), phát âm
    vocab.ts        # hook sổ từ vựng lưu localStorage
  data/
    words.ts        # từ theo chủ đề + từ điển offline
    hsk.ts          # từ vựng HSK 1–3 (nghĩa tiếng Việt)
  components/
    PinyinInput.tsx     # bộ gõ pinyin + thanh chọn chữ
    HandwritingPad.tsx  # canvas viết tay
    StrokeOrder.tsx     # thứ tự nét (hanzi-writer)
  pages/
    LookupPage.tsx  PracticePage.tsx  VocabPage.tsx
  App.tsx  index.css  main.tsx
```

## Dịch vụ bên ngoài

| Việc | Nguồn | Ghi chú |
|---|---|---|
| Phiên âm | `pinyin-pro` | Chạy offline trong trình duyệt |
| Tách từ | `Intl.Segmenter` | Có sẵn trong Chrome, Edge, Safari và Firefox bản mới |
| Thứ tự nét | `hanzi-writer` + dữ liệu từ CDN jsDelivr | |
| Dịch | Google Translate (endpoint `client=gtx`), dự phòng MyMemory | Endpoint không chính thức, có thể bị giới hạn khi gọi nhiều |
| Gõ pinyin, viết tay | Google Input Tools | Endpoint không chính thức |
| Phát âm | Giọng tiếng Trung của máy (Web Speech API), dự phòng giọng online Google TTS | Chọn nguồn giọng ở góc trên: Tự động / Giọng máy / Online |

> Nếu muốn ổn định lâu dài, có thể thay hàm `translate()` trong `src/lib/api.ts` bằng API chính thức (Google Cloud Translation, DeepL…). Khi đó nên đặt API key trong Vercel Serverless Function, không để lộ key ở frontend.
