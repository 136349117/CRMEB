import { AiAssistPanel } from './panel/AiAssistPanel'
import { HierarchyPanel } from './panel/HierarchyPanel'
import { TelemetryPanel } from './panel/TelemetryPanel'
import { SceneCanvas } from './scene/SceneCanvas'
import { TwinProvider } from './twin/TwinContext'

export default function App() {
  return (
    <TwinProvider>
      <div className="app-shell">
        <header className="app-header">
          <div>
            <h1 className="brand">
              Twin<span>Forge</span>
            </h1>
            <p className="tagline">
              铝加工铸造车间示意：原料铝锭 → 熔炼 → 浇铸/模具 → 冷却，含行车与安全通道。几何占位 + 模拟遥测。
            </p>
          </div>
          <div className="header-meta">
            Vite · React · R3F
            <br />
            数据：mock → 可接传感器 / BIM
          </div>
        </header>
        <main className="app-main">
          <aside className="side-left">
            <HierarchyPanel />
          </aside>
          <div className="canvas-wrap">
            <SceneCanvas />
          </div>
          <aside className="side-right">
            <TelemetryPanel />
            <AiAssistPanel />
          </aside>
        </main>
      </div>
    </TwinProvider>
  )
}
