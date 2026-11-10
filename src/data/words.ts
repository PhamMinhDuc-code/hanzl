/** Thư viện từ có sẵn để học, nghĩa tiếng Việt dùng offline. */
import { HSK_LEVELS } from './hsk';

export interface LibWord {
  hanzi: string;
  vi: string;
  py?: string; // ghi đè pinyin khi cần (mặc định sinh tự động)
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  words: LibWord[];
}

export const TOPICS: Topic[] = [
  {
    id: 'greet', name: 'Chào hỏi', icon: '👋',
    words: [
      { hanzi: '你好', vi: 'xin chào' },
      { hanzi: '您好', vi: 'xin chào (kính trọng)' },
      { hanzi: '谢谢', vi: 'cảm ơn' },
      { hanzi: '不客气', vi: 'không có gì' },
      { hanzi: '对不起', vi: 'xin lỗi' },
      { hanzi: '没关系', vi: 'không sao' },
      { hanzi: '再见', vi: 'tạm biệt' },
      { hanzi: '早上好', vi: 'chào buổi sáng' },
      { hanzi: '晚安', vi: 'chúc ngủ ngon' },
      { hanzi: '请', vi: 'mời; xin vui lòng' },
      { hanzi: '是', vi: 'là; vâng' },
      { hanzi: '不是', vi: 'không phải' },
    ],
  },
  {
    id: 'pron', name: 'Đại từ & hỏi', icon: '🙋',
    words: [
      { hanzi: '我', vi: 'tôi' },
      { hanzi: '你', vi: 'bạn' },
      { hanzi: '他', vi: 'anh ấy' },
      { hanzi: '她', vi: 'cô ấy' },
      { hanzi: '我们', vi: 'chúng tôi' },
      { hanzi: '你们', vi: 'các bạn' },
      { hanzi: '他们', vi: 'họ' },
      { hanzi: '这', vi: 'này; đây' },
      { hanzi: '那', vi: 'kia; đó' },
      { hanzi: '谁', vi: 'ai' },
      { hanzi: '什么', vi: 'cái gì' },
      { hanzi: '哪儿', vi: 'ở đâu', py: 'nǎr' },
      { hanzi: '为什么', vi: 'tại sao' },
      { hanzi: '多少', vi: 'bao nhiêu' },
    ],
  },
  {
    id: 'num', name: 'Số đếm', icon: '🔢',
    words: [
      { hanzi: '零', vi: 'số không' },
      { hanzi: '一', vi: 'một' },
      { hanzi: '二', vi: 'hai' },
      { hanzi: '三', vi: 'ba' },
      { hanzi: '四', vi: 'bốn' },
      { hanzi: '五', vi: 'năm' },
      { hanzi: '六', vi: 'sáu' },
      { hanzi: '七', vi: 'bảy' },
      { hanzi: '八', vi: 'tám' },
      { hanzi: '九', vi: 'chín' },
      { hanzi: '十', vi: 'mười' },
      { hanzi: '百', vi: 'trăm' },
      { hanzi: '千', vi: 'nghìn' },
      { hanzi: '万', vi: 'vạn (mười nghìn)' },
      { hanzi: '两', vi: 'hai (đi với lượng từ)' },
    ],
  },
  {
    id: 'family', name: 'Gia đình', icon: '👨‍👩‍👧',
    words: [
      { hanzi: '家', vi: 'nhà; gia đình' },
      { hanzi: '爸爸', vi: 'bố' },
      { hanzi: '妈妈', vi: 'mẹ' },
      { hanzi: '哥哥', vi: 'anh trai' },
      { hanzi: '姐姐', vi: 'chị gái' },
      { hanzi: '弟弟', vi: 'em trai' },
      { hanzi: '妹妹', vi: 'em gái' },
      { hanzi: '爷爷', vi: 'ông nội' },
      { hanzi: '奶奶', vi: 'bà nội' },
      { hanzi: '儿子', vi: 'con trai' },
      { hanzi: '女儿', vi: 'con gái' },
      { hanzi: '朋友', vi: 'bạn bè' },
    ],
  },
  {
    id: 'time', name: 'Thời gian', icon: '⏰',
    words: [
      { hanzi: '今天', vi: 'hôm nay' },
      { hanzi: '明天', vi: 'ngày mai' },
      { hanzi: '昨天', vi: 'hôm qua' },
      { hanzi: '现在', vi: 'bây giờ' },
      { hanzi: '年', vi: 'năm' },
      { hanzi: '月', vi: 'tháng' },
      { hanzi: '日', vi: 'ngày' },
      { hanzi: '星期', vi: 'tuần; thứ' },
      { hanzi: '点', vi: 'giờ (giờ đồng hồ)' },
      { hanzi: '分钟', vi: 'phút' },
      { hanzi: '上午', vi: 'buổi sáng' },
      { hanzi: '下午', vi: 'buổi chiều' },
      { hanzi: '晚上', vi: 'buổi tối' },
    ],
  },
  {
    id: 'food', name: 'Ăn uống', icon: '🍜',
    words: [
      { hanzi: '吃', vi: 'ăn' },
      { hanzi: '喝', vi: 'uống' },
      { hanzi: '水', vi: 'nước' },
      { hanzi: '茶', vi: 'trà' },
      { hanzi: '咖啡', vi: 'cà phê' },
      { hanzi: '米饭', vi: 'cơm' },
      { hanzi: '面条', vi: 'mì sợi' },
      { hanzi: '苹果', vi: 'quả táo' },
      { hanzi: '菜', vi: 'món ăn; rau' },
      { hanzi: '饭店', vi: 'nhà hàng' },
      { hanzi: '好吃', vi: 'ngon' },
      { hanzi: '饿', vi: 'đói' },
    ],
  },
  {
    id: 'color', name: 'Màu sắc', icon: '🎨',
    words: [
      { hanzi: '颜色', vi: 'màu sắc' },
      { hanzi: '红色', vi: 'màu đỏ' },
      { hanzi: '黄色', vi: 'màu vàng' },
      { hanzi: '蓝色', vi: 'màu xanh dương' },
      { hanzi: '绿色', vi: 'màu xanh lá' },
      { hanzi: '白色', vi: 'màu trắng' },
      { hanzi: '黑色', vi: 'màu đen' },
    ],
  },
  {
    id: 'verb', name: 'Động từ', icon: '🏃',
    words: [
      { hanzi: '去', vi: 'đi' },
      { hanzi: '来', vi: 'đến' },
      { hanzi: '看', vi: 'xem; nhìn' },
      { hanzi: '听', vi: 'nghe' },
      { hanzi: '说', vi: 'nói' },
      { hanzi: '读', vi: 'đọc' },
      { hanzi: '写', vi: 'viết' },
      { hanzi: '学习', vi: 'học tập' },
      { hanzi: '工作', vi: 'làm việc; công việc' },
      { hanzi: '喜欢', vi: 'thích' },
      { hanzi: '爱', vi: 'yêu' },
      { hanzi: '想', vi: 'muốn; nghĩ; nhớ' },
      { hanzi: '买', vi: 'mua' },
      { hanzi: '有', vi: 'có' },
      { hanzi: '会', vi: 'biết (làm); sẽ' },
      { hanzi: '做', vi: 'làm' },
    ],
  },
  {
    id: 'adj', name: 'Tính từ', icon: '✨',
    words: [
      { hanzi: '大', vi: 'to; lớn' },
      { hanzi: '小', vi: 'nhỏ' },
      { hanzi: '多', vi: 'nhiều' },
      { hanzi: '少', vi: 'ít' },
      { hanzi: '好', vi: 'tốt; hay' },
      { hanzi: '热', vi: 'nóng' },
      { hanzi: '冷', vi: 'lạnh' },
      { hanzi: '高兴', vi: 'vui vẻ' },
      { hanzi: '漂亮', vi: 'đẹp' },
      { hanzi: '忙', vi: 'bận' },
    ],
  },
  {
    id: 'school', name: 'Trường học', icon: '🏫',
    words: [
      { hanzi: '学校', vi: 'trường học' },
      { hanzi: '大学', vi: 'đại học' },
      { hanzi: '老师', vi: 'giáo viên' },
      { hanzi: '学生', vi: 'học sinh; sinh viên' },
      { hanzi: '中文', vi: 'tiếng Trung' },
      { hanzi: '汉语', vi: 'tiếng Hán' },
      { hanzi: '汉字', vi: 'chữ Hán' },
      { hanzi: '书', vi: 'sách' },
      { hanzi: '问题', vi: 'câu hỏi; vấn đề' },
      { hanzi: '考试', vi: 'thi; kỳ thi' },
    ],
  },
  {
    id: 'sentence', name: 'Câu giao tiếp', icon: '💬',
    words: [
      { hanzi: '你好吗？', vi: 'Bạn khỏe không?' },
      { hanzi: '我很好，谢谢。', vi: 'Tôi rất khỏe, cảm ơn.' },
      { hanzi: '你叫什么名字？', vi: 'Bạn tên là gì?' },
      { hanzi: '我是越南人。', vi: 'Tôi là người Việt Nam.' },
      { hanzi: '这个多少钱？', vi: 'Cái này bao nhiêu tiền?' },
      { hanzi: '你会说中文吗？', vi: 'Bạn biết nói tiếng Trung không?' },
      { hanzi: '我听不懂。', vi: 'Tôi nghe không hiểu.' },
      { hanzi: '请再说一遍。', vi: 'Xin nói lại một lần nữa.' },
      { hanzi: '洗手间在哪儿？', vi: 'Nhà vệ sinh ở đâu?' },
      { hanzi: '我爱你。', vi: 'Anh yêu em / Tôi yêu bạn.' },
    ],
  },
];

/** Tra nghĩa tiếng Việt offline cho từ có trong thư viện (chủ đề + HSK 1–3). */
export const LOCAL_DICT: Map<string, LibWord> = new Map();
for (const group of [...HSK_LEVELS, ...TOPICS]) {
  for (const w of group.words) if (!LOCAL_DICT.has(w.hanzi)) LOCAL_DICT.set(w.hanzi, w);
}
