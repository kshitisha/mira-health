import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, PlusCircle, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { to: '/',        icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients',icon: Users,           label: 'Patients'  },
  { to: '/add',     icon: PlusCircle,      label: 'Add Patient'},
]

export function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-brand-surface border-r border-brand-border flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-brand-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-teal rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-[#E8F4F8] text-lg leading-none">MIRA</p>
            <p className="text-[10px] text-brand-muted mt-0.5 tracking-wider uppercase">Medical Intelligence</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-teal/15 text-brand-teal border border-brand-teal/20'
                  : 'text-brand-muted hover:text-[#E8F4F8] hover:bg-brand-slate/40',
              )
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-brand-border">
        <p className="text-[10px] text-brand-muted">AI-Powered by Groq · LLaMA 3</p>
        <p className="text-[10px] text-brand-muted">v1.0.0</p>
      </div>
    </aside>
  )
}
