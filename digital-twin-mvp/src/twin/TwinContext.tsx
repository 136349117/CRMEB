import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import factoryScene from '../data/factory-scene.json'
import { bindEntityMetrics, deriveStatus, sampleTelemetry } from '../data/mockTelemetry'
import type { EntityRuntime, TwinEntity, TwinScene } from '../data/types'

interface TwinContextValue {
  scene: TwinScene
  setScene: (scene: TwinScene) => void
  entities: TwinEntity[]
  runtime: Record<string, EntityRuntime>
  selectedId: string | null
  setSelectedId: (id: string | null) => void
  childrenOf: (parentId: string | null) => TwinEntity[]
  getEntity: (id: string) => TwinEntity | undefined
}

const TwinContext = createContext<TwinContextValue | null>(null)

export function TwinProvider({ children }: { children: ReactNode }) {
  const [scene, setScene] = useState<TwinScene>(factoryScene as TwinScene)
  const [selectedId, setSelectedId] = useState<string | null>('dev-press-01')
  const [runtime, setRuntime] = useState<Record<string, EntityRuntime>>({})

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
      entities: scene.entities,
      runtime,
      selectedId,
      setSelectedId,
      childrenOf,
      getEntity,
    }),
    [scene, runtime, selectedId, childrenOf, getEntity],
  )

  return <TwinContext.Provider value={value}>{children}</TwinContext.Provider>
}

export function useTwin() {
  const ctx = useContext(TwinContext)
  if (!ctx) throw new Error('useTwin must be used within TwinProvider')
  return ctx
}
