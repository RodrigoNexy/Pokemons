import { capitalize } from '@/lib/utils/format'

export interface StatBarProps {
  label: string
  value: number
  maxValue?: number
  color?: string
}

export function StatBar({ label, value, maxValue = 255, color = '#9bbc0f' }: StatBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono font-bold text-sm text-black uppercase">
          {capitalize(label)}
        </span>
        <span className="font-mono text-sm text-black">{value}</span>
      </div>
      <div className="w-full h-4 bg-gray-200 border-2 border-black relative">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  )
}
