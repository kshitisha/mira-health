import { cn } from '@/lib/utils'

// Clinical reference ranges
function glucoseStatus(v) {
  if (v < 70)  return 'danger'
  if (v <= 99) return 'normal'
  if (v <= 125)return 'warning'
  return 'danger'
}
function haemoglobinStatus(v) {
  // using generic adult range 12–17.5
  if (v < 12)  return 'danger'
  if (v <= 17.5) return 'normal'
  return 'danger'
}
function cholesterolStatus(v) {
  if (v < 200) return 'normal'
  if (v < 240) return 'warning'
  return 'danger'
}

const labels = { normal: 'Normal', warning: 'Borderline', danger: 'High Risk' }
const classes = {
  normal:  'bg-status-normal/10 text-status-normal border border-status-normal/20',
  warning: 'bg-status-warning/10 text-status-warning border border-status-warning/20',
  danger:  'bg-status-danger/10  text-status-danger  border border-status-danger/20',
}

export function BloodBadge({ type, value }) {
  const status =
    type === 'glucose'      ? glucoseStatus(value)      :
    type === 'haemoglobin'  ? haemoglobinStatus(value)  :
    cholesterolStatus(value)

  return (
    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', classes[status])}>
      {labels[status]}
    </span>
  )
}

export function BloodStat({ label, value, unit, type }) {
  const status =
    type === 'glucose'      ? glucoseStatus(value)      :
    type === 'haemoglobin'  ? haemoglobinStatus(value)  :
    cholesterolStatus(value)

  const barWidth = {
    glucose:     Math.min((value / 300) * 100, 100),
    haemoglobin: Math.min((value / 20) * 100, 100),
    cholesterol: Math.min((value / 400) * 100, 100),
  }[type]

  const barColor = {
    normal:  'bg-status-normal',
    warning: 'bg-status-warning',
    danger:  'bg-status-danger',
  }[status]

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-xs text-brand-muted">{label}</span>
        <span className="font-mono text-sm font-medium text-[#E8F4F8]">{value} <span className="text-[10px] text-brand-muted">{unit}</span></span>
      </div>
      <div className="h-1.5 bg-brand-navy rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${barWidth}%` }} />
      </div>
    </div>
  )
}
