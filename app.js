// 引用相關模組
const createError = require('http-errors');
const express = require('express'); // express模組
const  path = require('path');
const  cookieParser = require('cookie-parser');
const  logger = require('morgan'); // 記錄用
const  partials = require('express-partials');

// 設定路由檔變數
const  indexRouter = require('./routes/index.js');
const  usersRouter = require('./routes/users.js');

// 建立express物件稱為app
const  app = express();

//========= 因使用socket.io套件所增加的程式片段 ===============
// 載入./routes/socketio_apis.js模組
const socketio_apis = require('./routes/socketio_apis.js');
// 取出含有socket.io伺服器的路由物件，存入socketio_routes變數中
const socketio_routes = socketio_apis.my_router;
// 在app中新增一個socketio_server變數來儲存路由檔中的socket.io伺服器物件
app.socketio_server = socketio_apis.my_socketioserver; 
// 設定當路由值為/socketio時，將請求導向socketio_routes路由檔案
app.use('/socketio', socketio_routes);
//===========================================================

// 設定views路徑和視圖引擎(view engine)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 使用相關中介軟體(middleware)
app.use(partials());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 設定public為網站靜態檔所在目錄
app.use(express.static(path.join(__dirname, 'public')));

// 設定路由處理路徑
app.use('/', indexRouter); // 設定'/'開頭由./routes/index.js路由檔處理
app.use('/users', usersRouter); // 設定'/users'開頭由./routes/users.js路由檔處理

// 抓取404例外並傳給錯誤處理函數 (catch 404 and forward to error handler)
app.use( (req, res, next) => {
  next(createError(404));
});

// 錯誤處理函數 (error handler)
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 產生顯示錯誤的頁面 (render the error page)
  res.status(err.status || 500);
  res.render('error');
});

// 匯出 app 物件
module.exports = app; 
