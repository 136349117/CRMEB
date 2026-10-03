/** 孪生体运行状态：由模拟/真实遥测驱动 */
export type TwinStatus = 'normal' | 'warning' | 'alarm' | 'offline'

export type TwinKind = 'space' | 'device' | 'sensor' | 'asset'

export interface Vec3 {
  x: number
  y: number
  z: number
}

/** 场景图节点：空间 / 设备 / 占位资产 */
export interface TwinEntity {
  id: string
  name: string
  kind: TwinKind
  parentId: string | null
  /** 简易几何占位；后续可换成 glTF / BIM 引用 */
  mesh?: {
    type: 'box' | 'cylinder' | 'plane'
    size: Vec3
    position: Vec3
    rotation?: Vec3
    color?: string
  }
  /** 数据绑定键：对应 telemetry 通道 */
  bindings?: {
    temperature?: string
    vibration?: string
    powerKw?: string
    status?: string
  }
  meta?: Record<string, string | number | boolean>
}

export interface TwinScene {
  id: string
  name: string
  description?: string
  /** 后续可挂 BIM/点云/glTF 资源清单 */
  resources?: Array<{
    id: string
    type: 'gltf' | 'bim' | 'texture' | 'other'
    uri: string
    note?: string
  }>
  entities: TwinEntity[]
  camera?: {
    position: Vec3
    target: Vec3
  }
}

export interface TelemetrySample {
  channel: string
  value: number | string
  unit?: string
  ts: number
}

export interface EntityRuntime {
  entityId: string
  status: TwinStatus
  metrics: Record<string, number | string>
  highlighted: boolean
}
