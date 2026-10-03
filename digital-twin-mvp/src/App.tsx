import { AiAssistPanel } from './panel/AiAssistPanel'
import { HierarchyPanel } from './panel/HierarchyPanel'
import { SceneSwitcher } from './panel/SceneSwitcher'
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
              中铝厂区航拍示意（gpt-6-astra 读图生成）· 可切换铝铸造车间。简化几何 + 模拟遥测，非精确 BIM。
            </p>
          </div>
          <div className="header-meta">
            Vite · React · R3F
            <br />
            模型：gpt-6-astra
          </div>
        </header>
        <main className="app-main">
          <aside className="side-left">
            <SceneSwitcher />
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
