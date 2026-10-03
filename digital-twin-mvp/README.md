# TwinForge · 数字孪生 Web MVP

通用厂房/设备示意的浏览器数字孪生骨架（Vite + React + Three.js / R3F）。

完整使用与接入说明见 Project 文档：

`/cursor/stores/self/docs/digital-twin-plan.md`

中转 API 用法（勿重复探查）：

`/cursor/stores/self/docs/ai-relay-gpt6-usage.md`

## 本地运行

```bash
cd digital-twin-mvp
cp .env.example .env.local   # 可选：填入 VITE_OPENAI_API_KEY
npm install
npm run dev
```

浏览器打开终端提示的本地地址（默认 `http://localhost:5173`）。

## 目录要点

| 路径 | 职责 |
|------|------|
| `src/data/` | 场景 JSON、类型、模拟遥测 |
| `src/twin/` | 孪生体运行时 / 选中态 |
| `src/scene/` | R3F 画布与网格 |
| `src/panel/` | 层级、遥测、AI 辅助 |
| `src/ai/` | 中转 Responses 客户端 |

完整 API Key **不要**写入 git；只用环境变量。
