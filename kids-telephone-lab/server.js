#!/usr/bin/env node
/**
 * 小小接线生 · 本地服务器（零依赖，Node.js 自带模块）
 *
 * 用法：
 *   node server.js          # 默认 8000 端口
 *   node server.js 8080     # 指定端口
 *
 * 启动后用浏览器打开 http://localhost:8000 ，按 Ctrl+C 停止。
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = __dirname;
const PORT = parseInt(process.argv[2], 10) || 8000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function lanIp() {
  for (const list of Object.values(os.networkInterfaces())) {
    for (const it of list || []) {
      if (it.family === "IPv4" && !it.internal) return it.address;
    }
  }
  return "127.0.0.1";
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  const file = path.normalize(path.join(ROOT, urlPath));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end('<h1>404</h1><p>没有这个页面，回 <a href="/">首页</a> 吧。</p>');
      return;
    }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
});

server.on("error", () => {
  console.log(`端口 ${PORT} 被占用了，换一个试试：node server.js ${PORT + 1}`);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log("=".repeat(52));
  console.log("  ☎️  小小接线生 · 电话课题实验室");
  console.log("=".repeat(52));
  console.log(`  本机打开：   http://localhost:${PORT}`);
  console.log(`  手机/平板：  http://${lanIp()}:${PORT} （同一 Wi-Fi）`);
  console.log("  停止服务器： Ctrl + C");
  console.log("=".repeat(52));
});
