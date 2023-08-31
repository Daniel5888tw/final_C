const runtimeModule = require("@node-red/runtime");
const runtime = runtimeModule({
  settings: {
    userDir: "./node-red-user-data", // 指定 Node-RED 的工作目錄
    flowFile: "flows.json" // 指定要導入的流程檔案名稱
  }
});

// 啟動 Node-RED
runtime.start();