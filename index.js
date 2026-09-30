const express = require('express');
const app = express();
app.use(express.json());

// サーバー起動確認
server.get('/', (req, res) => {
    console.log(`Hello World!`);
    res.send('Hello World!');
});

// Đường dẫn nhận tin nhắn từ LINE WORKS (Callback URL)
app.post('/callback', (req, res) => {
    const events = req.body.events;
    
    if (events && events.length > 0) {
        const event = events[0];
        const userId = event.source.userId; // ID người nhắn
        const userMessage = event.message.text; // Nội dung tin nhắn

        console.log(`Nhận được tin nhắn từ ${userId}: ${userMessage}`);

        // TODO: Gọi API LINE WORKS để nhắn tin phản hồi lại người dùng tại đây
        // Bạn sẽ cần dùng Access Token (được tạo từ Client ID, Secret và Private Key)
    }

    // Trả về trạng thái 200 OK cho LINE WORKS xác nhận đã nhận dữ liệu
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot Server đang chạy tại port ${PORT}`));
