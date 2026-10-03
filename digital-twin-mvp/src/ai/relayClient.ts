/**
 * 拾捌 AI 中转客户端（Responses API）
 * 配置见 Agent Store docs/ai-relay-gpt6-usage.md；默认模型 gpt-6-astra。
 * Key 仅通过环境变量注入，勿写入源码。
 */

export interface RelayConfig {
  baseUrl: string
  apiKey: string
  model: string
  actorHeader: string
}

export function getRelayConfig(): RelayConfig | null {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY?.trim()
  if (!apiKey || apiKey.includes('YOUR_KEY')) return null
  return {
    baseUrl: (import.meta.env.VITE_OPENAI_BASE_URL || 'https://ai.558669.xyz/v1').replace(/\/$/, ''),
    apiKey,
    model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-6-astra',
    actorHeader: import.meta.env.VITE_OPENAI_ACTOR_HEADER || 'local-image-extension',
  }
}

export function extractResponseText(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return ''
  const data = payload as {
    output_text?: string
    output?: Array<{
      type?: string
      content?: Array<{ type?: string; text?: string }>
    }>
  }
  if (typeof data.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim()
  }
  const parts: string[] = []
  for (const item of data.output ?? []) {
    for (const c of item.content ?? []) {
      if (c.type === 'output_text' && c.text) parts.push(c.text)
    }
  }
  return parts.join('\n').trim()
}

export async function callResponsesApi(input: string, maxOutputTokens = 1200): Promise<string> {
  const cfg = getRelayConfig()
  if (!cfg) {
    throw new Error('未配置 VITE_OPENAI_API_KEY。请复制 .env.example 为 .env.local 后填入 Key。')
  }

  const res = await fetch(`${cfg.baseUrl}/responses`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.apiKey}`,
      'Content-Type': 'application/json',
      'x-openai-actor-authorization': cfg.actorHeader,
    },
    body: JSON.stringify({
      model: cfg.model,
      input,
      store: false,
      max_output_tokens: maxOutputTokens,
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`中转 API HTTP ${res.status}: ${body.slice(0, 240)}`)
  }

  const json = await res.json()
  const text = extractResponseText(json)
  if (!text) throw new Error('中转 API 返回空文本')
  return text
}
