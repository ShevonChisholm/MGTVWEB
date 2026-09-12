import { useToast } from '@/context/ToastContext'

const COLORS: Record<string, string> = {
  success: 'border-[#4ADE80]/30',
  info: 'border-[#818CF8]/30',
  warning: 'border-[#C9A84C]/40',
}

const DOT_COLORS: Record<string, string> = {
  success: 'bg-[#4ADE80]',
  info: 'bg-[#818CF8]',
  warning: 'bg-[#C9A84C]',
}

export function ToastStack() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 bg-[#141414] border text-sm font-medium shadow-2xl shadow-black/60 pointer-events-auto ${COLORS[toast.type]}`}
          style={{ animation: 'toastIn 0.25s ease-out' }}
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOT_COLORS[toast.type]}`} />
          <span className="text-[#F5F5F5] text-sm">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-[#3A3A3A] hover:text-[#A3A3A3] transition-colors cursor-pointer text-base leading-none"
          >
            ×
          </button>
        </div>
      ))}
      <style>{`
        @keyframes toastIn {
          from { transform: translateX(110%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
