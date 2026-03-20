import subprocess
import sys
from datetime import datetime

from PyQt5.QtCore import QThread, pyqtSignal
from PyQt5.QtGui import QFont
from PyQt5.QtWidgets import (
    QApplication,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QMainWindow,
    QPushButton,
    QTextEdit,
    QVBoxLayout,
    QWidget,
)

BLOG_DIR = "/home/samxander/blog"


class PushWorker(QThread):
    log = pyqtSignal(str)
    finished = pyqtSignal(bool)

    def __init__(self, message):
        super().__init__()
        self.message = message

    def run_cmd(self, cmd):
        self.log.emit(f"$ {cmd}")
        result = subprocess.run(
            cmd, shell=True, cwd=BLOG_DIR,
            capture_output=True, text=True
        )
        if result.stdout:
            self.log.emit(result.stdout.strip())
        if result.stderr:
            self.log.emit(result.stderr.strip())
        return result.returncode == 0

    def run(self):
        ok = self.run_cmd("git add .")
        if not ok:
            self.finished.emit(False)
            return

        ok = self.run_cmd(f'git commit -m "{self.message}"')
        if not ok:
            self.log.emit("（没有新内容需要提交）")
            self.finished.emit(False)
            return

        ok = self.run_cmd("git push")
        self.finished.emit(ok)


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Blog 一键推送")
        self.setFixedSize(520, 380)

        central = QWidget()
        self.setCentralWidget(central)
        layout = QVBoxLayout(central)
        layout.setSpacing(12)
        layout.setContentsMargins(20, 20, 20, 20)

        # Commit message
        layout.addWidget(QLabel("Commit 说明（可选）："))
        msg_row = QHBoxLayout()
        self.msg_input = QLineEdit()
        self.msg_input.setPlaceholderText("留空则自动填写时间")
        self.msg_input.setFont(QFont("monospace", 10))
        msg_row.addWidget(self.msg_input)
        layout.addLayout(msg_row)

        # Push button
        self.push_btn = QPushButton("🚀  Push 到 GitHub")
        self.push_btn.setFixedHeight(42)
        self.push_btn.setFont(QFont("sans-serif", 11))
        self.push_btn.clicked.connect(self.do_push)
        layout.addWidget(self.push_btn)

        # Log output
        layout.addWidget(QLabel("输出日志："))
        self.log_box = QTextEdit()
        self.log_box.setReadOnly(True)
        self.log_box.setFont(QFont("monospace", 9))
        self.log_box.setStyleSheet("background:#1e1e1e; color:#d4d4d4;")
        layout.addWidget(self.log_box)

    def do_push(self):
        msg = self.msg_input.text().strip()
        if not msg:
            msg = f"update: {datetime.now().strftime('%Y-%m-%d %H:%M')}"

        self.log_box.clear()
        self.push_btn.setEnabled(False)
        self.push_btn.setText("推送中...")

        self.worker = PushWorker(msg)
        self.worker.log.connect(self.append_log)
        self.worker.finished.connect(self.on_done)
        self.worker.start()

    def append_log(self, text):
        self.log_box.append(text)

    def on_done(self, success):
        self.push_btn.setEnabled(True)
        if success:
            self.push_btn.setText("✅  推送成功！")
            self.append_log("\n✅ 已推送，Vercel 将自动部署。")
        else:
            self.push_btn.setText("❌  推送失败")
            self.append_log("\n❌ 推送失败，请检查上方日志。")


if __name__ == "__main__":
    app = QApplication(sys.argv)
    win = MainWindow()
    win.show()
    sys.exit(app.exec_())
