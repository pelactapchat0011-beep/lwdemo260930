const express = require('express');
const app = express();
app.use(express.json());


// Đường dẫn nhận tin nhắn từ LINE WORKS (Callback URL)
app.post('/callback', (req, res) => {

    // 1. Log toàn bộ dữ liệu nhận được để bạn dễ dàng debug trong tab Logs của Render
    console.log("Dữ liệu nhận từ LINE WORKS:", JSON.stringify(req.body));

    // 2. Kiểm tra xem cấu trúc dữ liệu gửi về dạng nào để tránh bị sập server
    if (!req.body) {
        return res.sendStatus(400); // Trả về lỗi nếu request rỗng
    }

    // LINE WORKS v2 thường gửi trực tiếp object sự kiện hoặc nằm trong mảng tùy trường hợp
    const event = Array.isArray(req.body.events) ? req.body.events[0] : req.body;

    // 3. Kiểm tra xem có đúng là sự kiện tin nhắn từ người dùng không
    if (event && event.type === 'message' && event.content) {
        const userId = event.source?.userId || event.user; // ID người nhắn
        const userMessage = event.content.text;           // Nội dung tin nhắn text

        console.log(`Nhận được tin nhắn từ ${userId}: ${userMessage}`);

        // TODO: Gọi API phản hồi tại đây
    }

    // 4. Luôn luôn trả về 200 OK cho LINE WORKS biết hệ thống của bạn đã nhận được tin
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot Server đang chạy tại port ${PORT}`));
