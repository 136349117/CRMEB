import type { TelemetrySample, TwinEntity, TwinStatus } from './types'

/** 铸造车间 + 中铝厂区示意通道 */
const CHANNEL_BASE: Record<string, { value: number; unit?: string; drift: number }> = {
  // foundry
  'furnace01.temp': { value: 742, unit: '°C', drift: 18 },
  'furnace01.power': { value: 420, unit: 'kW', drift: 35 },
  'ladle01.temp': { value: 710, unit: '°C', drift: 12 },
  'mold01.temp': { value: 285, unit: '°C', drift: 20 },
  'cool01.temp': { value: 96, unit: '°C', drift: 8 },
  'conv01.power': { value: 12, unit: 'kW', drift: 2 },
  'crane01.power': { value: 28, unit: 'kW', drift: 5 },
  'air01.temp': { value: 38, unit: '°C', drift: 2 },
  // chalco plant
  'towerA.temp': { value: 186, unit: '°C', drift: 12 },
  'towerA.power': { value: 980, unit: 'kW', drift: 80 },
  'towerB.temp': { value: 172, unit: '°C', drift: 10 },
  'towerB.power': { value: 910, unit: 'kW', drift: 70 },
  'hallF.temp': { value: 58, unit: '°C', drift: 4 },
  'hallF.power': { value: 6400, unit: 'kW', drift: 300 },
  'hallM.temp': { value: 55, unit: '°C', drift: 3 },
  'hallM.power': { value: 6200, unit: 'kW', drift: 280 },
  'hallB.temp': { value: 52, unit: '°C', drift: 3 },
  'hallB.power': { value: 5900, unit: 'kW', drift: 250 },
  'chimney1.temp': { value: 118, unit: '°C', drift: 8 },
  'chimney2.temp': { value: 105, unit: '°C', drift: 7 },
  'plantAir.temp': { value: 24, unit: '°C', drift: 2 },
}

const CHANNEL_UNIT: Record<string, string> = Object.fromEntries(
  Object.entries(CHANNEL_BASE)
    .filter(([, cfg]) => cfg.unit)
    .map(([ch, cfg]) => [ch, cfg.unit as string]),
)

function wave(base: number, drift: number, t: number, seed: number): number {
  return +(base + Math.sin(t * 0.8 + seed) * drift + Math.sin(t * 2.1 + seed * 0.3) * drift * 0.25).toFixed(1)
}

/** 模拟实时遥测：后续可替换为 WebSocket / MQTT / REST */
export function sampleTelemetry(now = Date.now()): TelemetrySample[] {
  const t = now / 1000
  const samples: TelemetrySample[] = Object.entries(CHANNEL_BASE).map(([channel, cfg], i) => ({
    channel,
    value: wave(cfg.value, cfg.drift, t, i * 1.7),
    unit: cfg.unit,
    ts: now,
  }))

  const hotPhase = (Math.sin(t / 11) + 1) / 2
  const furnaceTemp = samples.find((s) => s.channel === 'furnace01.temp')
  if (furnaceTemp && hotPhase > 0.78) {
    furnaceTemp.value = +(Number(furnaceTemp.value) + 55).toFixed(1)
  }

  const towerHot = (Math.sin(t / 13) + 1) / 2
  const towerA = samples.find((s) => s.channel === 'towerA.temp')
  if (towerA && towerHot > 0.8) {
    towerA.value = +(Number(towerA.value) + 40).toFixed(1)
  }

  const moldWarn = Math.sin(t / 8) > 0.85
  const hallWarn = Math.sin(t / 10) > 0.88

  samples.push(
    { channel: 'furnace01.status', value: hotPhase > 0.78 ? 'alarm' : 'normal', ts: now },
    { channel: 'ladle01.status', value: hotPhase > 0.9 ? 'warning' : 'normal', ts: now },
    { channel: 'mold01.status', value: moldWarn ? 'warning' : 'normal', ts: now },
    { channel: 'cool01.status', value: 'normal', ts: now },
    { channel: 'conv01.status', value: 'normal', ts: now },
    { channel: 'crane01.status', value: Math.sin(t / 15) > 0.92 ? 'warning' : 'normal', ts: now },
    { channel: 'air01.status', value: 'normal', ts: now },
    { channel: 'towerA.status', value: towerHot > 0.8 ? 'alarm' : 'normal', ts: now },
    { channel: 'towerB.status', value: 'normal', ts: now },
    { channel: 'hallF.status', value: hallWarn ? 'warning' : 'normal', ts: now },
    { channel: 'hallM.status', value: 'normal', ts: now },
    { channel: 'hallB.status', value: 'normal', ts: now },
    { channel: 'chimney1.status', value: towerHot > 0.85 ? 'warning' : 'normal', ts: now },
    { channel: 'chimney2.status', value: 'normal', ts: now },
    { channel: 'plantAir.status', value: 'normal', ts: now },
  )

  return samples
}

export function deriveStatus(metrics: Record<string, number | string>): TwinStatus {
  const raw = metrics.status
  if (raw === 'alarm' || raw === 'warning' || raw === 'offline' || raw === 'normal') {
    return raw
  }
  const temp = Number(metrics.temperature)
  if (!Number.isNaN(temp) && temp >= 800) return 'alarm'
  if (!Number.isNaN(temp) && temp >= 760) return 'warning'
  if (!Number.isNaN(temp) && temp >= 200) return 'warning'
  if (!Number.isNaN(temp) && temp >= 120 && temp < 200) return 'warning'
  return 'normal'
}

export function bindEntityMetrics(
  entity: TwinEntity,
  byChannel: Map<string, TelemetrySample>,
): Record<string, number | string> {
  const metrics: Record<string, number | string> = {}
  const bindings = entity.bindings ?? {}
  for (const [key, channel] of Object.entries(bindings)) {
    if (!channel) continue
    const sample = byChannel.get(channel)
    if (sample !== undefined) metrics[key] = sample.value
  }
  return metrics
}

export function formatMetric(
  key: string,
  value: number | string,
  bindings?: TwinEntity['bindings'],
): string {
  if (typeof value !== 'number') return String(value)
  const channel = bindings?.[key as 'temperature' | 'vibration' | 'powerKw' | 'status']
  const unit =
    (channel && CHANNEL_UNIT[channel]) ||
    (key === 'temperature' ? '°C' : key === 'powerKw' ? 'kW' : '')
  return unit ? `${value} ${unit}` : String(value)
}

export const STATUS_COLOR: Record<TwinStatus, string> = {
  normal: '#3dcf8e',
  warning: '#e6b84d',
  alarm: '#e85d5d',
  offline: '#6b7280',
}
