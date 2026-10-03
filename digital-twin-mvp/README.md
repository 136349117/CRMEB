# TwinForge · 中铝厂区 / 铸造车间数字孪生 MVP

默认场景：中铝厂区航拍示意（`gpt-6-astra` 读图生成）。可切换铝铸造车间。

说明：`/cursor/stores/self/docs/digital-twin-plan.md`  
中转：`/cursor/stores/self/docs/ai-relay-gpt6-usage.md`

## 本地运行

```bash
cd digital-twin-mvp
cp .env.example .env.local   # 可选
npm install && npm run dev
```

默认模型：`gpt-6-astra`（`VITE_OPENAI_MODEL`）。完整 Key 勿提交 git。
