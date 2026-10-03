import type { TwinScene } from './types'
import aluminumFoundry from './aluminum-foundry-scene.json'
import chalcoPlant from './chalco-plant-scene.json'

export interface ScenePreset {
  id: string
  label: string
  scene: TwinScene
}

export const SCENE_PRESETS: ScenePreset[] = [
  {
    id: 'chalco-plant',
    label: '中铝厂区（航拍示意）',
    scene: chalcoPlant as TwinScene,
  },
  {
    id: 'aluminum-foundry',
    label: '铝铸造车间',
    scene: aluminumFoundry as TwinScene,
  },
]

export const DEFAULT_SCENE_ID = 'chalco-plant'

export function getPreset(id: string): ScenePreset | undefined {
  return SCENE_PRESETS.find((p) => p.id === id)
}
