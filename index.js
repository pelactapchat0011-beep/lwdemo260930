const express = require('express');
const app = express();
app.use(express.json());


// Đường dẫn nhận tin nhắn từ LINE WORKS (Callback URL)
app.post('/callback', (req, res) => {

    console.log(`Có tin nhắn mới `);
    const events = req.body.events;
    const event = events[0];
    const userId = event.source.userId; // ID người nhắn
    const userMessage = event.message.text; // Nội dung tin nhắn
    console.log(`Nhận được tin nhắn từ ${userId}: ${userMessage}`);
    // Trả về trạng thái 200 OK cho LINE WORKS xác nhận đã nhận dữ liệu
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot Server đang chạy tại port ${PORT}`));
