import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const icons = {
  default:     <Info className="w-4 h-4 text-brand-teal" />,
  success:     <CheckCircle className="w-4 h-4 text-status-normal" />,
  destructive: <AlertCircle className="w-4 h-4 text-status-danger" />,
}

export function ToastContainer({ toasts, dismiss }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-80">
      {toasts.map(t => (
        <div
          key={t.id}
          className={cn(
            'card p-4 flex items-start gap-3 shadow-xl animate-slide-up',
            t.variant === 'destructive' && 'border-status-danger/40',
            t.variant === 'success'     && 'border-status-normal/40',
          )}
        >
          <span className="mt-0.5 shrink-0">{icons[t.variant] || icons.default}</span>
          <div className="flex-1 min-w-0">
            {t.title && <p className="text-sm font-semibold text-[#E8F4F8]">{t.title}</p>}
            {t.description && <p className="text-xs text-brand-muted mt-0.5">{t.description}</p>}
          </div>
          <button onClick={() => dismiss(t.id)} className="text-brand-muted hover:text-[#E8F4F8] shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
