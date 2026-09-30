"use strict";

// モジュールインポート
const express = require("express");
const bodyParser = require("body-parser");
const server = express();

server.use(bodyParser.json());

// サーバー起動確認
server.get('/', (req, res) => {
    res.send('Hello World!');
});

// Botからメッセージに応答
server.post('/callback', (req, res) => {
    res.sendStatus(200);
});

server.post('/testsendmsg', (req, res) => {

    const name = req.body.name;
    const text = req.body.text;

    console.log(`Received Name: ${name}, Text: ${text}`);

    res.status(200).json({
        success: true,
        message: "Data received successfully!",
        data: req.body
    });

});

server.post('/sendmsg', (req, res) => {

    
    // const message = req.body.content.text;
    // const roomId = req.body.source.roomId;
    // const accountId = req.body.source.accountId;

    // const data = {
    //     title: "Inquiry form",
    //     body: {
    //         text: 'Hi <m userId="user@example.com">, You have received a new inquiry.'
    //     },
    //     button: {
    //         label: "URL",
    //         url: "https://example.com"
    //     }
    // };

    
    const data = {title: "Inquiry form","body": {"text": "Alert received!"}}

    fetch("https://webhook.worksmobile.com/message/78fac84f-3af7-4913-ac57-8206796b1e05", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(res => console.log("Trạng thái:", res.status))
        .catch(err => console.error("Lỗi:", err));

    res.sendStatus(200);
});


// Webアプリケーション起動
server.listen(3000, () => console.log('Server running on port 3000'));