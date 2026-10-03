import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_SCENE_ID, getPreset, SCENE_PRESETS } from '../data/sceneCatalog'
import { bindEntityMetrics, deriveStatus, sampleTelemetry } from '../data/mockTelemetry'
import type { EntityRuntime, TwinEntity, TwinScene } from '../data/types'

interface TwinContextValue {
  scene: TwinScene
  setScene: (scene: TwinScene) => void
  presetId: string | null
  loadPreset: (id: string) => void
  presets: typeof SCENE_PRESETS
  entities: TwinEntity[]
  runtime: Record<string, EntityRuntime>
  selectedId: string | null
  setSelectedId: (id: string | null) => void
  childrenOf: (parentId: string | null) => TwinEntity[]
  getEntity: (id: string) => TwinEntity | undefined
}

const TwinContext = createContext<TwinContextValue | null>(null)

function defaultSelection(scene: TwinScene): string | null {
  return (
    scene.entities.find((e) => e.id === 'dev-hall-front')?.id ??
    scene.entities.find((e) => e.kind === 'device')?.id ??
    scene.entities[0]?.id ??
    null
  )
}

export function TwinProvider({ children }: { children: ReactNode }) {
  const initial = getPreset(DEFAULT_SCENE_ID)!.scene
  const [scene, setSceneState] = useState<TwinScene>(initial)
  const [presetId, setPresetId] = useState<string | null>(DEFAULT_SCENE_ID)
  const [selectedId, setSelectedId] = useState<string | null>(defaultSelection(initial))
  const [runtime, setRuntime] = useState<Record<string, EntityRuntime>>({})

  const setScene = useCallback((next: TwinScene) => {
    setSceneState(next)
    setPresetId(SCENE_PRESETS.some((p) => p.id === next.id) ? next.id : null)
    setSelectedId(defaultSelection(next))
  }, [])

  const loadPreset = useCallback(
    (id: string) => {
      const preset = getPreset(id)
      if (!preset) return
      setScene(preset.scene)
    },
    [setScene],
  )

  useEffect(() => {
    const tick = () => {
      const samples = sampleTelemetry()
      const byChannel = new Map(samples.map((s) => [s.channel, s]))
      const next: Record<string, EntityRuntime> = {}
      for (const entity of scene.entities) {
        const metrics = bindEntityMetrics(entity, byChannel)
        const status = Object.keys(metrics).length ? deriveStatus(metrics) : 'normal'
        next[entity.id] = {
          entityId: entity.id,
          status,
          metrics,
          highlighted: selectedId === entity.id || status === 'alarm' || status === 'warning',
        }
      }
      setRuntime(next)
    }
    tick()
    const id = window.setInterval(tick, 800)
    return () => window.clearInterval(id)
  }, [scene, selectedId])

  const childrenOf = useCallback(
    (parentId: string | null) => scene.entities.filter((e) => e.parentId === parentId),
    [scene.entities],
  )

  const getEntity = useCallback(
    (id: string) => scene.entities.find((e) => e.id === id),
    [scene.entities],
  )

  const value = useMemo(
    () => ({
      scene,
      setScene,
      presetId,
      loadPreset,
      presets: SCENE_PRESETS,
      entities: scene.entities,
      runtime,
      selectedId,
      setSelectedId,
      childrenOf,
      getEntity,
    }),
    [scene, setScene, presetId, loadPreset, runtime, selectedId, childrenOf, getEntity],
  )

  return <TwinContext.Provider value={value}>{children}</TwinContext.Provider>
}

export function useTwin() {
  const ctx = useContext(TwinContext)
  if (!ctx) throw new Error('useTwin must be used within TwinProvider')
  return ctx
}
