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
              Web 数字孪生 MVP：3D 场景 · 设备层级 · 模拟实时状态。默认通用厂房示意，可替换为真实场景。
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
