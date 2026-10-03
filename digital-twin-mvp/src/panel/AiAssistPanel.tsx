import { useState } from 'react'
import { getRelayConfig } from '../ai/relayClient'
import { generateSceneFromPrompt } from '../ai/sceneFromPrompt'
import { useTwin } from '../twin/TwinContext'

export function AiAssistPanel() {
  const { setScene, setSelectedId } = useTwin()
  const [prompt, setPrompt] = useState('一个小型机房，两台服务器机柜和一台空调')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const configured = Boolean(getRelayConfig())

  const onGenerate = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const scene = await generateSceneFromPrompt(prompt.trim())
      setScene(scene)
      setSelectedId(scene.entities.find((e) => e.kind === 'device')?.id ?? scene.entities[0]?.id ?? null)
      setMessage(`已应用 AI 场景：${scene.name}（${scene.entities.length} 个实体）`)
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      setMessage(`AI 辅助失败（不阻塞骨架）：${reason}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel ai-panel">
      <header className="panel-header">
        <h2>AI 场景辅助</h2>
        <p>自然语言 → TwinScene JSON（中转 gpt-5.5 / Responses）</p>
      </header>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        placeholder="描述要生成的场景…"
      />
      <div className="ai-actions">
        <button type="button" disabled={loading || !prompt.trim()} onClick={onGenerate}>
          {loading ? '生成中…' : '生成并应用'}
        </button>
        <span className={`ai-badge${configured ? ' ok' : ''}`}>
          {configured ? 'Key 已配置' : '未配置 Key'}
        </span>
      </div>
      {message && <p className="ai-message">{message}</p>}
      {!configured && (
        <p className="ai-hint">
          复制 <code>.env.example</code> 为 <code>.env.local</code>，填入{' '}
          <code>VITE_OPENAI_API_KEY</code>。详见中转用法文档。
        </p>
      )}
    </section>
  )
}
