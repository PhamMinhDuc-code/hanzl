/**
 * Từ vựng HSK 1–3 (chuẩn HSK 2.0: 150 + 150 + 300 từ), nghĩa tiếng Việt.
 * Mỗi dòng: "chữ Hán|nghĩa" hoặc "chữ Hán|pinyin|nghĩa" (khi cần ghi rõ âm đọc của chữ đa âm).
 */
import type { LibWord } from './words';

const HSK1 = `
爱|yêu
八|tám
爸爸|bố
杯子|cái cốc
北京|Bắc Kinh
本|quyển (lượng từ cho sách)
不|không
不客气|bú kè qi|không có gì
菜|món ăn; rau
茶|trà
吃|ăn
出租车|xe taxi
打电话|gọi điện thoại
大|to, lớn
的|de|(trợ từ sở hữu) của
点|giờ (giờ đồng hồ); điểm
电脑|máy tính
电视|tivi
电影|phim
东西|đồ vật
都|dōu|đều
读|đọc
对不起|xin lỗi
多|nhiều
多少|bao nhiêu
儿子|con trai
二|hai
饭店|nhà hàng; khách sạn
飞机|máy bay
分钟|phút
高兴|vui vẻ
个|cái, chiếc (lượng từ chung)
工作|làm việc; công việc
狗|con chó
汉语|tiếng Hán
好|tốt, hay
号|ngày (trong tháng); số
喝|uống
和|và
很|rất
后面|phía sau
回|về
会|huì|biết (làm); sẽ
几|mấy
家|nhà; gia đình
叫|gọi; tên là
今天|hôm nay
九|chín
开|mở; lái (xe)
看|xem, nhìn
看见|nhìn thấy
块|đồng (tiền); miếng
来|đến
老师|giáo viên
了|le|(trợ từ) rồi, đã
冷|lạnh
里|bên trong
六|sáu
妈妈|mẹ
吗|ma|(trợ từ nghi vấn) …không?
买|mua
猫|con mèo
没关系|không sao
没有|không có
米饭|cơm
名字|tên
明天|ngày mai
哪|nào
哪儿|nǎr|ở đâu
那|kia, đó
呢|ne|(trợ từ nghi vấn) …thì sao?
能|có thể
你|bạn
年|năm
女儿|con gái
朋友|bạn bè
漂亮|đẹp
苹果|quả táo
七|bảy
前面|phía trước
钱|tiền
请|mời; xin vui lòng
去|đi
热|nóng
人|người
认识|quen biết
三|ba
商店|cửa hàng
上|trên; lên
上午|buổi sáng
少|ít
谁|shéi|ai
什么|cái gì
十|mười
时候|lúc, khi
是|là
书|sách
水|nước
水果|hoa quả
睡觉|ngủ
说|nói
四|bốn
岁|tuổi
他|anh ấy
她|cô ấy
太|quá
天气|thời tiết
听|nghe
同学|bạn học
喂|wéi|alô
我|tôi
我们|chúng tôi
五|năm (số 5)
喜欢|thích
下|dưới; xuống
下午|buổi chiều
下雨|mưa
先生|ông, ngài; chồng
现在|bây giờ
想|muốn; nghĩ; nhớ
小|nhỏ
小姐|cô (gọi phụ nữ trẻ)
些|một số, vài
写|viết
谢谢|cảm ơn
星期|tuần; thứ
学生|học sinh, sinh viên
学习|học tập
学校|trường học
一|một
衣服|quần áo
医生|bác sĩ
医院|bệnh viện
椅子|cái ghế
有|có
月|tháng; mặt trăng
在|ở, tại; đang
再见|tạm biệt
怎么|thế nào, sao
怎么样|như thế nào
这|này, đây
中国|Trung Quốc
中午|buổi trưa
住|sống, ở
桌子|cái bàn
字|chữ
昨天|hôm qua
坐|ngồi; đi (xe)
做|làm
`;

const HSK2 = `
吧|ba|(trợ từ) nhé, đi
白|trắng
百|trăm
帮助|giúp đỡ
报纸|báo (giấy)
比|so với, hơn
别|đừng
宾馆|khách sạn
长|cháng|dài
唱歌|hát
出|ra
穿|mặc; đi (giày)
次|lần
从|từ
错|sai
打篮球|chơi bóng rổ
大家|mọi người
到|đến
得|de|(trợ từ bổ ngữ); phải (děi)
等|đợi
弟弟|em trai
第一|thứ nhất
懂|hiểu
对|đúng; đối với
房间|phòng
非常|vô cùng, rất
服务员|nhân viên phục vụ
高|cao
告诉|nói cho biết
哥哥|anh trai
给|cho, đưa
公共汽车|xe buýt
公司|công ty
贵|đắt
过|guò|qua; (trợ từ) đã từng
还|hái|còn; vẫn
孩子|trẻ con
好吃|ngon
黑|đen
红|đỏ
火车站|ga tàu hỏa
机场|sân bay
鸡蛋|trứng gà
件|chiếc (áo); việc (lượng từ)
教室|phòng học
姐姐|chị gái
介绍|giới thiệu
进|vào
近|gần
就|thì, liền; chính là
觉得|cảm thấy
咖啡|cà phê
开始|bắt đầu
考试|thi; kỳ thi
可能|có thể, có lẽ
可以|có thể, được
课|bài học; tiết học
快|nhanh
快乐|vui vẻ
累|mệt
离|cách (khoảng cách)
两|hai (đi với lượng từ)
零|số không
路|đường
旅游|du lịch
卖|bán
慢|chậm
忙|bận
每|mỗi
妹妹|em gái
门|cửa
面条|mì sợi
男|nam
您|ngài, ông, bà (kính trọng)
牛奶|sữa bò
女|nữ
旁边|bên cạnh
跑步|chạy bộ
便宜|rẻ
票|vé
妻子|qī zi|vợ
起床|thức dậy
千|nghìn
铅笔|bút chì
晴|nắng, trời quang
去年|năm ngoái
让|để, bảo, cho phép
日|ngày
上班|đi làm
身体|cơ thể; sức khỏe
生病|bị ốm
生日|sinh nhật
时间|thời gian
事情|sự việc
手表|đồng hồ đeo tay
手机|điện thoại di động
说话|nói chuyện
送|tặng; tiễn; đưa
虽然|tuy rằng
但是|nhưng
它|nó (vật, con vật)
踢足球|đá bóng
题|đề, câu hỏi (bài tập)
跳舞|nhảy múa
外|ngoài
完|xong, hết
玩|chơi
晚上|wǎn shang|buổi tối
往|hướng về, đi về phía
为什么|wèi shén me|tại sao
问|hỏi
问题|câu hỏi; vấn đề
西瓜|dưa hấu
希望|hy vọng
洗|rửa, giặt
小时|giờ, tiếng (đồng hồ)
笑|cười
新|mới
姓|họ; mang họ
休息|nghỉ ngơi
雪|tuyết
颜色|màu sắc
眼睛|mắt
羊肉|thịt cừu
药|thuốc
要|yào|muốn; cần; sắp
也|cũng
一起|cùng nhau
一下|yí xià|một chút
已经|đã
意思|yì si|ý nghĩa
因为|bởi vì
所以|cho nên
阴|âm u, trời râm
游泳|bơi
右边|bên phải
鱼|cá
远|xa
运动|vận động; thể thao
再|lại, nữa
早上|zǎo shang|buổi sáng sớm
丈夫|chồng
找|tìm
着|zhe|(trợ từ) đang, …
真|thật
正在|đang
知道|biết
准备|chuẩn bị
走|đi (bộ)
最|nhất
左边|bên trái
`;

const HSK3 = `
阿姨|cô, dì
啊|a|(thán từ) à, a
矮|thấp, lùn
爱好|sở thích
安静|yên tĩnh
把|bǎ|(giới từ) đem, lấy
班|lớp
搬|chuyển, dọn
办法|cách, biện pháp
办公室|văn phòng
半|một nửa
帮忙|giúp đỡ
包|túi; gói
饱|no
北方|phương Bắc
被|bị, được
鼻子|mũi
比较|tương đối; so sánh
比赛|cuộc thi đấu
笔记本|sổ ghi chép; laptop
必须|bắt buộc phải
变化|thay đổi
别人|người khác
冰箱|tủ lạnh
不但|không những
而且|mà còn
菜单|thực đơn
参加|tham gia
草|cỏ
层|tầng
差|chà|kém; thiếu
超市|siêu thị
衬衫|áo sơ mi
成绩|thành tích, điểm số
城市|thành phố
迟到|đến muộn
除了|ngoài ra, trừ
船|thuyền
春|mùa xuân
词典|từ điển
聪明|thông minh
打扫|quét dọn
打算|dự định
带|mang theo; dẫn
担心|lo lắng
蛋糕|bánh ngọt
当然|đương nhiên
地|de|(trợ từ trạng ngữ) một cách
灯|đèn
低|thấp
地方|dì fang|nơi, chỗ
地铁|tàu điện ngầm
地图|bản đồ
电梯|thang máy
电子邮件|thư điện tử
东|phía đông
冬|mùa đông
动物|động vật
短|ngắn
段|đoạn
锻炼|rèn luyện
多么|biết bao
饿|đói
耳朵|tai
发|fā|gửi; phát
发烧|sốt
发现|phát hiện
方便|tiện lợi
放|đặt, để
放心|yên tâm
分|fēn|điểm; phút; chia
附近|gần đây, lân cận
复习|ôn tập
干净|sạch sẽ
感冒|cảm cúm
感兴趣|thấy hứng thú
刚才|vừa nãy
个子|vóc dáng, chiều cao
根据|căn cứ vào
跟|với, cùng
更|gèng|càng, hơn
公斤|kilôgam
公园|công viên
故事|câu chuyện
刮风|gió thổi
关|đóng; tắt
关系|quan hệ
关心|quan tâm
关于|về, liên quan đến
国家|quốc gia
过去|quá khứ; đi qua
还是|hái shi|hay là; vẫn
害怕|sợ
黑板|bảng đen
后来|sau đó
护照|hộ chiếu
花|hoa; tiêu (tiền)
画|vẽ; bức tranh
坏|hỏng; xấu
欢迎|hoan nghênh
环境|môi trường
换|đổi
黄河|sông Hoàng Hà
回答|trả lời
会议|cuộc họp
或者|hoặc
几乎|hầu như
机会|cơ hội
极|cực kỳ
记得|nhớ
季节|mùa
检查|kiểm tra
简单|đơn giản
健康|khỏe mạnh
见面|gặp mặt
讲|giảng; nói
教|jiāo|dạy
角|jiǎo|hào (tiền); góc
脚|bàn chân
接|đón; nhận
街道|đường phố
结婚|kết hôn
结束|kết thúc
节目|tiết mục, chương trình
节日|ngày lễ
解决|giải quyết
借|mượn; cho mượn
经常|thường xuyên
经过|đi qua; trải qua
经理|giám đốc
久|lâu
旧|cũ
举行|tổ chức
句子|câu
决定|quyết định
可爱|đáng yêu
渴|khát
刻|kè|khắc (15 phút)
客人|khách
空调|kōng tiáo|điều hòa
口|miệng
哭|khóc
裤子|quần
筷子|đũa
蓝|xanh lam
老|già; cũ
离开|rời khỏi
礼物|quà tặng
历史|lịch sử
脸|mặt
练习|luyện tập
辆|chiếc (lượng từ cho xe)
了解|liǎo jiě|hiểu rõ, tìm hiểu
邻居|hàng xóm
楼|tòa nhà; tầng
绿|xanh lá
马|ngựa
马上|ngay lập tức
满意|hài lòng
帽子|mũ
米|mǐ|mét; gạo
面包|bánh mì
明白|hiểu, rõ ràng
拿|cầm, lấy
奶奶|bà nội
南|phía nam
难|khó
难过|buồn
年级|lớp, khối
年轻|trẻ
鸟|chim
努力|nỗ lực
爬山|leo núi
盘子|cái đĩa
胖|béo
皮鞋|giày da
啤酒|bia
瓶子|cái chai
其实|thật ra
其他|khác
奇怪|kỳ lạ
骑|cưỡi; đi (xe đạp)
起飞|cất cánh
起来|dậy; lên
清楚|rõ ràng
秋|mùa thu
裙子|váy
然后|sau đó
热情|nhiệt tình
认为|cho rằng
认真|nghiêm túc, chăm chỉ
容易|dễ
如果|nếu
伞|cái ô
上网|lên mạng
生气|tức giận
声音|âm thanh, giọng
世界|thế giới
试|thử
瘦|gầy
叔叔|chú
舒服|shū fu|dễ chịu, thoải mái
树|cây
数学|shù xué|toán học
刷牙|đánh răng
双|đôi
水平|trình độ
司机|tài xế
太阳|mặt trời
特别|đặc biệt
疼|đau
提高|nâng cao
体育|thể dục
甜|ngọt
条|chiếc, con (lượng từ vật dài)
同事|đồng nghiệp
同意|đồng ý
头发|tóu fa|tóc
突然|đột nhiên
图书馆|thư viện
腿|chân (cẳng chân)
完成|hoàn thành
碗|cái bát
万|vạn (mười nghìn)
忘记|quên
为|wèi|vì, cho
为了|wèi le|để, vì
位|vị (lượng từ cho người, kính trọng)
文化|văn hóa
西|phía tây
习惯|thói quen; quen với
洗手间|nhà vệ sinh
洗澡|tắm
夏|mùa hè
先|trước
相信|tin tưởng
香蕉|chuối
向|hướng về
像|giống
小心|cẩn thận
校长|hiệu trưởng
新闻|tin tức
新鲜|tươi
信用卡|thẻ tín dụng
行李箱|xíng li xiāng|vali
熊猫|gấu trúc
需要|cần
选择|lựa chọn
要求|yêu cầu
爷爷|ông nội
一般|thông thường
一边|vừa… vừa…
一定|nhất định
一共|tổng cộng
一会儿|yí huìr|một lát
一样|giống nhau
一直|luôn luôn; thẳng
以前|trước đây
音乐|âm nhạc
银行|ngân hàng
饮料|đồ uống
应该|nên
影响|ảnh hưởng
用|dùng
游戏|trò chơi
有名|nổi tiếng
又|lại
遇到|gặp phải
元|đồng (nhân dân tệ)
愿意|sẵn lòng
月亮|mặt trăng
越|càng
站|đứng; trạm, bến
张|tờ, cái (lượng từ vật phẳng)
着急|zháo jí|sốt ruột
照顾|chăm sóc
照片|bức ảnh
照相机|máy ảnh
只|zhǐ|chỉ
只有|zhǐ yǒu|chỉ có
中间|ở giữa
终于|cuối cùng
种|zhǒng|loại, kiểu
重要|quan trọng
周末|cuối tuần
主要|chủ yếu
注意|chú ý
自己|tự mình, bản thân
自行车|xe đạp
总是|luôn luôn
嘴|miệng
最后|cuối cùng
最近|gần đây
作业|bài tập về nhà
作用|tác dụng
才|mới (chỉ thời gian muộn)
世纪|thế kỷ
数|shǔ|đếm
`;

function parse(raw: string): LibWord[] {
  return raw
    .trim()
    .split('\n')
    .map((line) => line.split('|'))
    .map((p) => (p.length === 3 ? { hanzi: p[0], py: p[1], vi: p[2] } : { hanzi: p[0], vi: p[1] }));
}

export const HSK_LEVELS = [
  { id: 'hsk1', name: 'HSK 1', words: parse(HSK1) },
  { id: 'hsk2', name: 'HSK 2', words: parse(HSK2) },
  { id: 'hsk3', name: 'HSK 3', words: parse(HSK3) },
];
