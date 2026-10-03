import type { TwinScene } from '../data/types'
import { callResponsesApi } from './relayClient'

const SYSTEM_HINT = `你是数字孪生场景助手。根据用户中文描述，生成一个精简的 TwinScene JSON。
只输出 JSON，不要 markdown 代码围栏，不要解释。
Schema 要点：
{
  "id": string,
  "name": string,
  "description": string,
  "resources": [],
  "camera": { "position": {"x","y","z"}, "target": {"x","y","z"} },
  "entities": [{
    "id": string,
    "name": string,
    "kind": "space"|"device"|"sensor"|"asset",
    "parentId": string|null,
    "mesh": {
      "type": "box"|"cylinder"|"plane",
      "size": {"x","y","z"},
      "position": {"x","y","z"},
      "color": "#rrggbb"
    },
    "bindings": { "temperature"?: string, "vibration"?: string, "powerKw"?: string, "status"?: string }
  }]
}
约束：最多 10 个实体；坐标合理（车间尺度）；至少一个 space 作根；设备需有 parentId；bindings 通道名用 ASCII。
默认语境：铝加工 / 铸造车间（熔炼炉、浇包、模具、冷却、行车、辊道、铝锭、安全通道等），中文 name。`

function stripFences(text: string): string {
  const trimmed = text.trim()
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i)
  return (fenced ? fenced[1] : trimmed).trim()
}

export function parseSceneJson(text: string): TwinScene {
  const raw = stripFences(text)
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('未找到 JSON 对象')
  const parsed = JSON.parse(raw.slice(start, end + 1)) as TwinScene
  if (!parsed.id || !Array.isArray(parsed.entities)) {
    throw new Error('JSON 缺少 id 或 entities')
  }
  return parsed
}

export async function generateSceneFromPrompt(prompt: string): Promise<TwinScene> {
  const input = `${SYSTEM_HINT}\n\n用户描述：${prompt}`
  const text = await callResponsesApi(input, 1600)
  return parseSceneJson(text)
}
