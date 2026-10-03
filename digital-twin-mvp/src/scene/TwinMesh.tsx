import { Edges } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { STATUS_COLOR } from '../data/mockTelemetry'
import type { TwinEntity } from '../data/types'
import { useTwin } from '../twin/TwinContext'

interface Props {
  entity: TwinEntity
}

export function TwinMesh({ entity }: Props) {
  const { runtime, selectedId, setSelectedId } = useTwin()
  const mesh = entity.mesh
  if (!mesh) return null

  const rt = runtime[entity.id]
  const status = rt?.status ?? 'normal'
  const selected = selectedId === entity.id
  const highlight = selected || rt?.highlighted
  const baseColor = mesh.color ?? '#6b7c93'
  const emissive = highlight ? STATUS_COLOR[status] : '#000000'
  const emissiveIntensity = selected ? 0.55 : highlight ? 0.35 : 0

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    setSelectedId(entity.id)
  }

  const pos: [number, number, number] = [mesh.position.x, mesh.position.y, mesh.position.z]
  const rot: [number, number, number] = [
    mesh.rotation?.x ?? 0,
    mesh.rotation?.y ?? 0,
    mesh.rotation?.z ?? 0,
  ]

  if (mesh.type === 'plane') {
    return (
      <mesh
        position={[pos[0], 0.01, pos[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={onClick}
      >
        <planeGeometry args={[mesh.size.x, mesh.size.z]} />
        <meshStandardMaterial color={baseColor} roughness={0.92} metalness={0.05} />
        {selected && <Edges color={STATUS_COLOR[status]} threshold={15} />}
      </mesh>
    )
  }

  if (mesh.type === 'cylinder') {
    return (
      <mesh position={pos} rotation={rot} onClick={onClick} castShadow receiveShadow>
        <cylinderGeometry args={[mesh.size.x * 0.5, mesh.size.z * 0.5, mesh.size.y, 24]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.55}
          metalness={0.25}
        />
        {highlight && <Edges color={STATUS_COLOR[status]} />}
      </mesh>
    )
  }

  return (
    <mesh position={pos} rotation={rot} onClick={onClick} castShadow receiveShadow>
      <boxGeometry args={[mesh.size.x, mesh.size.y, mesh.size.z]} />
      <meshStandardMaterial
        color={baseColor}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        roughness={0.6}
        metalness={0.2}
      />
      {highlight && <Edges color={STATUS_COLOR[status]} />}
    </mesh>
  )
}
