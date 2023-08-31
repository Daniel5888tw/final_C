// 載入express模組 
const express = require('express');
// 使用express.Router類別建構子來建立路由物件
const router = express.Router();

// 取得並列出Server端的ip，需在專案中安裝underscore模組: npm install underscore --save
const sip = require('underscore').chain(require('os').networkInterfaces()).values()
    .flatten().find({family: 'IPv4', internal: false}).value().address;
console.log('Server IP='+sip);

// 載入request及querystring模組，以便呼叫Web API
const request = require('request');
const querystring = require('querystring');

//=================== 回傳網頁段落 ========================================//
//========= 根據Client端利用GET送來之不同路由，回傳相對應的網頁 =============//
//=======================================================================//
// 回傳專案首頁及其標題到前端
router.get('/', (req, res) => {
    // 回傳專案首頁及及其標題給前端	
    res.render('index.ejs', { title: "專案首頁" });
});


// 回傳給Client端BMI計算服務操作網頁及該網頁之標題
router.get('/monitor', (req, res) => {
	res.render('monitor.ejs', {title:"機房溫度監控及廢熱回收監控"});
});

// 回傳樂透服務操作網頁及其標題到前端
router.get('/lottery', (req, res) => {
    res.render('lottery.ejs', { title: "樂透服務操作網頁" });
});

module.exports = router; // 將路由物件匯出