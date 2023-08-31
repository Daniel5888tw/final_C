// 載入express模組 
const express = require('express');

// 使用express.Router類別建構子來建立路由物件
const router = express.Router();

// 引用dateformat模組
const dateformat=require('dateformat');

//========= 因使用socket.io套件所增加的程式片段 ================
// 載入socket.io套件，建立名稱為socketio_server的socket.io伺服器
const socketio_server = require('socket.io')(); 
//============================================================

// 定義全域變數，用來跨方法使用
let Interval_Id, monitoring_status="stop";

socketio_server.on('connection', (socket) => {
	// 設定每個1秒發送date事件夾帶目前時間資訊JSON訊息給Client端(瀏覽器)
	setInterval(() => {
		// 建立格式如2016-12-04 21:17:58之日期字串
		let datestring = dateformat(Date().toString(), "yyyy-mm-dd HH:MM:ss"); 
		// 透過發送currenttime事件的方式將日期字串發給前端網頁
		socket.emit('currenttime', {'date': datestring});
	}, 1000);
});

//======================= 以下為REST網路服務段落 =============================//
//======= 根據Client端利用GET或POST送來之不同路由，執行相對應之服務方法 =======//
// 啟動或關閉即時監控環境溫溼度之RESTful API，由亂數產生模擬之溫溼度值
router.post('/readdhtsensor/:cmd', (req, res) => {
	let cmd = req.params.cmd;  //取出控制命令(cmd)
	console.log(cmd)

	if (cmd == 'start' && monitoring_status=="stop")
	{
		monitoring_status="start";
		// 啟動每秒呼叫讀取溫度、濕度Sensor一次
		Interval_Id = setInterval(() => { 
			// 利用亂數產生模擬之溫濕度值
			let temperature = (25.0 + (Math.random()*2)).toFixed(1); // 產生溫度值，限制小數點後只顯示1位
			let humidty = (60.0 + (Math.random()*5)).toFixed(1);     //尺生濕度值，限制小數點後只顯示1位
			let sensor_values = {'temperature': temperature, 'humidity': humidty};   // 打包成JSON物件
			console.log(sensor_values);
			// 將JSON物件透過WebSocket即時傳回給網頁
			socketio_server.emit('envdata', sensor_values);
					
		}, 1000);	
		
		res.set(// 設定回傳結果之編碼為utf-8，讓網頁端能正常顯示中文
			{'charset': 'utf-8'}
		);
		res.send(//傳回一個JSON格式訊息給用戶端
			{"message": "即時監測環境溫度及濕度中!"}		
		);			
	}
	if(cmd == 'stop' && monitoring_status=="start")
	{
		monitoring_status="stop";
		// 停止setInterval函數的執行
		clearInterval(Interval_Id);
		res.set(// 設定回傳結果之編碼為utf-8，讓網頁端能正常顯示中文
			{'charset': 'utf-8'}
		);
		res.send(//傳回一個JSON格式訊息給用戶端
			{"message": "已經停止監測環境溫度及濕度!"}		
		);
	}
});

// 匯出路由物件及socket.io伺服器物件
module.exports = {my_router:router, my_socketioserver: socketio_server};