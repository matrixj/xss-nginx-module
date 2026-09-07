#!/usr/bin/env python3
"""小小接线生 · 本地服务器（零依赖，Python 3 自带）

用法：
    python3 server.py          # 默认 8000 端口
    python3 server.py 8080     # 指定端口

启动后用浏览器打开 http://localhost:8000
同一 Wi-Fi 下的手机/平板可打开 http://<电脑IP>:8000
按 Ctrl+C 停止。
"""
import functools
import http.server
import os
import socket
import socketserver
import sys
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 本地学习站点：禁用缓存，改完页面刷新即生效
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stdout.write("  %s\n" % (fmt % args))


def lan_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("10.255.255.255", 1))
        ip = s.getsockname()[0]
    except OSError:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = functools.partial(Handler, directory=ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    try:
        server = socketserver.ThreadingTCPServer(("", port), handler)
    except OSError:
        print("端口 %d 被占用了，换一个试试：python3 server.py %d" % (port, port + 1))
        sys.exit(1)

    print("=" * 52)
    print("  ☎️  小小接线生 · 电话课题实验室")
    print("=" * 52)
    print("  本机打开：   http://localhost:%d" % port)
    print("  手机/平板：  http://%s:%d （同一 Wi-Fi）" % (lan_ip(), port))
    print("  停止服务器： Ctrl + C")
    print("=" * 52)

    if "--no-browser" not in sys.argv:
        try:
            webbrowser.open("http://localhost:%d" % port)
        except Exception:
            pass
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止。下次见，小接线生！")


if __name__ == "__main__":
    main()
