# TwinForge · 铝加工铸造车间数字孪生 MVP

浏览器端简易 3D 数字孪生案例：铝锭区、熔炼炉、浇铸/模具、冷却、行车/辊道、安全通道（Vite + React + Three.js / R3F）。

完整说明：`/cursor/stores/self/docs/digital-twin-plan.md`  
中转用法：`/cursor/stores/self/docs/ai-relay-gpt6-usage.md`

## 本地运行

```bash
cd digital-twin-mvp
cp .env.example .env.local   # 可选：填入 VITE_OPENAI_API_KEY
npm install
npm run dev
```

默认 `http://localhost:5173`。默认选中「熔炼炉 #1」，高温通道会周期性告警高亮。

## 目录要点

| 路径 | 职责 |
|------|------|
| `src/data/aluminum-foundry-scene.json` | 默认铸造车间场景 |
| `src/data/mockTelemetry.ts` | 模拟温度/功率/状态 |
| `src/twin/` | 运行时与选中态 |
| `src/scene/` | R3F 画布 |
| `src/panel/` | 车间层级、遥测、AI |
| `src/ai/` | 中转 Responses 客户端 |

完整 API Key **不要**写入 git。
