const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());

const jwt = require('jsonwebtoken');
const axios = require('axios');

// ==================== CẤU HÌNH THÔNG TIN CỦA BẠN ====================
const CLIENT_ID = "2yP_HMlAjiB587MwPadB";
const SERVICE_ACCOUNT = "6u7vu.serviceaccount@systemgear";

const keyPath = path.join(__dirname, 'private_20260930164003.key');
const PRIVATE_KEY = fs.readFileSync(keyPath, 'utf8'); 

const BOT_ID = "13278086"; // ID của con Bot bạn đã tạo
const USER_ID = "stgr-line4@systemgear"; // ID tài khoản LINE WORKS của người n

async function getAccessToken() {
    const now = Math.floor(Date.now() / 1000);

    // JWT Payload
    const payload = {
        iss: CLIENT_ID,
        sub: SERVICE_ACCOUNT,
        iat: now,
        exp: now + 3600
    };

    // Tạo JWT
    const assertion = jwt.sign(
        payload,
        PRIVATE_KEY,
        {
            algorithm: "RS256"
        }
    );

    const params = new URLSearchParams();
    params.append(
        "grant_type",
        "urn:ietf:params:oauth:grant-type:jwt-bearer"
    );
    params.append("assertion", assertion);

    try {
        const response = await axios.post(
            "https://auth.worksmobile.com/oauth2/v2.0/token",
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        console.log("Token取得成功");
        console.log(response.data);

        return response.data.access_token;

    } catch (error) {

        console.error(
            "Token取得失敗",
            error.response?.data || error.message
        );

        throw error;
    }
}

// async function getAccessToken() {
//     const currentTime = Math.floor(Date.now() / 1000);

//     // 1. Tạo Payload cho mã JWT
//     const payload = {
//         iss: CLIENT_ID,
//         sub: SERVICE_ACCOUNT,
//         iat: currentTime,
//         exp: currentTime + 3600 // Token có thời hạn tối đa 1 tiếng
//     };

//     // 2. Ký mã JWT bằng thuật toán RS256 và Private Key
//     const assertion = jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' });

//     // 3. Gửi JWT lên LINE WORKS để đổi lấy Access Token chính thức
//     const tokenUrl = 'https://auth.worksmobile.com/oauth2/v2.0/token';
    
//     const params = new URLSearchParams();
//     params.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
//     params.append('assertion', assertion);

//     try {
//         const response = await axios.post(tokenUrl, params, {
//             headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
//         });
//         console.log("CLIENT_ID =", CLIENT_ID);
//         console.log("SERVICE_ACCOUNT =", SERVICE_ACCOUNT);
//         console.log("PRIVATE_KEY =", PRIVATE_KEY ? "OK" : "NG");
//         console.log("response =",response.data);
//         console.log("👉 Lấy Token thành công!");
        
//         return response.data.access_token; // Trả về chuỗi Token dài để sử dụng
//     } catch (error) {
//         console.error("❌ Lỗi khi lấy Token:", error.response ? error.response.data : error.message);
//         throw error;
//     }
// }

/**
 * BƯỚC 2: HÀM SỬ DỤNG TOKEN ĐỂ GỬI TIN NHẮN
 */
async function sendMessage(token, messageText) {
    // Địa chỉ API gửi tin nhắn của LINE WORKS API 2.0
    const url = `https://www.worksapis.com/v1.0/bots/${BOT_ID}/users/${USER_ID}/messages`;
    
    const data = {
        content: {
            type: "text",
            text: messageText
        }
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Truyền Token vào Header chỉnh chu
        }
    };

    console.log("URL:", url);
    console.log("TOKEN:", token);
    console.log("HEADERS:", config.headers);

    try {
        const response = await axios.post(url, data, config);
        console.log("🚀 Đã gửi tin nhắn thành công! Mã trạng thái:", response.status);
    } catch (error) {
        console.error("❌ Lỗi khi gửi tin nhắn:", error.response ? error.response.data : error.message);
    }
}
async function main() {

    try {
        // 1. Thực hiện lấy token trước
        const token = await getAccessToken();
        console.log("ACCESS TOKEN =", token);

        // 2. Có token rồi, truyền token vào để gửi tin nhắn
        await sendMessage(token, "Xin chào! Đây là tin nhắn tự động từ Bot của bạn. 🤖");
        
    } catch (error) {
        console.error("Quy trình thất bại.");
    }
}
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

        //console.log(`Nhận được tin nhắn từ ${userId}: ${userMessage}`);

    }

    main();

    // 4. Luôn luôn trả về 200 OK cho LINE WORKS biết hệ thống của bạn đã nhận được tin
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot Server đang chạy tại port ${PORT}`));
