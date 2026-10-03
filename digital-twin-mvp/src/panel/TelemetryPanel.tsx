import { STATUS_COLOR } from '../data/mockTelemetry'
import { useTwin } from '../twin/TwinContext'

export function TelemetryPanel() {
  const { selectedId, getEntity, runtime } = useTwin()
  const entity = selectedId ? getEntity(selectedId) : undefined
  const rt = selectedId ? runtime[selectedId] : undefined

  if (!entity || !rt) {
    return (
      <section className="panel">
        <header className="panel-header">
          <h2>实时状态</h2>
          <p>点击场景中的设备或左侧层级节点</p>
        </header>
      </section>
    )
  }

  return (
    <section className="panel">
      <header className="panel-header">
        <h2>{entity.name}</h2>
        <p>
          {entity.id} ·{' '}
          <span style={{ color: STATUS_COLOR[rt.status] }}>{rt.status}</span>
        </p>
      </header>
      <dl className="metrics">
        {Object.keys(rt.metrics).length === 0 && (
          <div className="metrics-empty">无数据绑定（空间节点或未配置 bindings）</div>
        )}
        {Object.entries(rt.metrics).map(([key, value]) => (
          <div key={key} className="metric-row">
            <dt>{key}</dt>
            <dd>{String(value)}</dd>
          </div>
        ))}
      </dl>
      {entity.bindings && (
        <div className="binding-hint">
          <strong>绑定通道</strong>
          <ul>
            {Object.entries(entity.bindings).map(([k, ch]) => (
              <li key={k}>
                {k} → <code>{ch}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
