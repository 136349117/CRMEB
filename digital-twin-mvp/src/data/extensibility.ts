/**
 * 扩展接缝说明（代码级索引，供后续接传感器 / BIM）：
 *
 * 1. 场景资源 scene.resources[]
 *    - 后续挂 glTF / BIM 切片 / 点云 URI；渲染层按 type 分流加载。
 * 2. 孪生体实体 TwinEntity
 *    - mesh 仅为占位几何；可加 assetRef 指向 resources[].id。
 * 3. 数据绑定 entity.bindings
 *    - channel 字符串 → TelemetrySample；mockTelemetry.sampleTelemetry 可换成
 *      WebSocket / MQTT / REST 适配器，保持 bindEntityMetrics 不变。
 * 4. 运行时 EntityRuntime
 *    - status / metrics / highlighted 与渲染解耦，便于规则引擎或告警服务注入。
 */

export const EXTENSION_HOOKS = [
  'scene.resources',
  'entity.mesh | entity.assetRef',
  'entity.bindings → telemetry adapter',
  'EntityRuntime status rules',
] as const
