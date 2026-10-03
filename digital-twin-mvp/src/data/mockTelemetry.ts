import type { TelemetrySample, TwinEntity, TwinStatus } from './types'

const CHANNEL_BASE: Record<string, { value: number; unit?: string; drift: number }> = {
  'press01.temp': { value: 62, unit: '°C', drift: 4 },
  'press01.vib': { value: 2.1, unit: 'mm/s', drift: 0.8 },
  'press01.power': { value: 38, unit: 'kW', drift: 6 },
  'conv01.power': { value: 8.5, unit: 'kW', drift: 1.2 },
  'cnc01.temp': { value: 48, unit: '°C', drift: 3 },
  'cnc01.vib': { value: 1.4, unit: 'mm/s', drift: 0.4 },
  'cnc01.power': { value: 22, unit: 'kW', drift: 4 },
  'tank01.temp': { value: 28, unit: '°C', drift: 2 },
  'air01.temp': { value: 24, unit: '°C', drift: 1 },
}

function wave(base: number, drift: number, t: number, seed: number): number {
  return +(base + Math.sin(t * 0.8 + seed) * drift + Math.sin(t * 2.1 + seed * 0.3) * drift * 0.25).toFixed(2)
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

  // 周期性制造告警：冲压机振动偏高
  const vibPhase = (Math.sin(t / 12) + 1) / 2
  const pressVib = samples.find((s) => s.channel === 'press01.vib')
  if (pressVib && vibPhase > 0.82) {
    pressVib.value = +(Number(pressVib.value) + 3.5).toFixed(2)
  }

  samples.push(
    { channel: 'press01.status', value: vibPhase > 0.82 ? 'alarm' : 'normal', ts: now },
    { channel: 'conv01.status', value: 'normal', ts: now },
    { channel: 'cnc01.status', value: Math.sin(t / 9) > 0.9 ? 'warning' : 'normal', ts: now },
    { channel: 'tank01.status', value: 'normal', ts: now },
    { channel: 'air01.status', value: 'normal', ts: now },
  )

  return samples
}

export function deriveStatus(metrics: Record<string, number | string>): TwinStatus {
  const raw = metrics.status
  if (raw === 'alarm' || raw === 'warning' || raw === 'offline' || raw === 'normal') {
    return raw
  }
  const temp = Number(metrics.temperature)
  const vib = Number(metrics.vibration)
  if (!Number.isNaN(vib) && vib >= 4.5) return 'alarm'
  if (!Number.isNaN(temp) && temp >= 70) return 'warning'
  if (!Number.isNaN(vib) && vib >= 3) return 'warning'
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

export const STATUS_COLOR: Record<TwinStatus, string> = {
  normal: '#3dcf8e',
  warning: '#e6b84d',
  alarm: '#e85d5d',
  offline: '#6b7280',
}
