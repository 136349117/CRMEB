import { STATUS_COLOR } from '../data/mockTelemetry'
import type { TwinEntity, TwinKind } from '../data/types'
import { useTwin } from '../twin/TwinContext'

/** 车间语义标签 */
const KIND_LABEL: Record<TwinKind, string> = {
  space: '区域',
  device: '设备',
  sensor: '测点',
  asset: '物料',
}

function TreeNode({ entity, depth }: { entity: TwinEntity; depth: number }) {
  const { childrenOf, selectedId, setSelectedId, runtime } = useTwin()
  const kids = childrenOf(entity.id)
  const selected = selectedId === entity.id
  const status = runtime[entity.id]?.status ?? 'normal'

  return (
    <li>
      <button
        type="button"
        className={`tree-item${selected ? ' is-selected' : ''}`}
        style={{ paddingLeft: 10 + depth * 14 }}
        onClick={() => setSelectedId(entity.id)}
      >
        <span className="tree-kind">{KIND_LABEL[entity.kind]}</span>
        <span className="tree-name">{entity.name}</span>
        {entity.kind !== 'space' && entity.kind !== 'asset' && (
          <span className="status-dot" style={{ background: STATUS_COLOR[status] }} title={status} />
        )}
      </button>
      {kids.length > 0 && (
        <ul>
          {kids.map((child) => (
            <TreeNode key={child.id} entity={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

export function HierarchyPanel() {
  const { childrenOf, scene } = useTwin()
  const roots = childrenOf(null)

  return (
    <section className="panel">
      <header className="panel-header">
        <h2>车间层级</h2>
        <p>{scene.name}</p>
      </header>
      <ul className="tree">
        {roots.map((entity) => (
          <TreeNode key={entity.id} entity={entity} depth={0} />
        ))}
      </ul>
    </section>
  )
}
