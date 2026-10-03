import { useTwin } from '../twin/TwinContext'

export function SceneSwitcher() {
  const { presets, presetId, loadPreset, scene } = useTwin()

  return (
    <section className="panel scene-switcher">
      <header className="panel-header">
        <h2>场景</h2>
        <p>当前：{scene.name}</p>
      </header>
      <div className="scene-switcher-actions">
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            className={presetId === p.id ? 'is-active' : undefined}
            onClick={() => loadPreset(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
    </section>
  )
}
