import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Activity, AlertTriangle, TrendingUp, PlusCircle, ChevronRight } from 'lucide-react'
import { patientApi } from '@/lib/api'
import { BloodBadge } from '@/components/BloodBadge'
import { format } from 'date-fns'

function StatCard({ icon: Icon, label, value, color = 'teal' }) {
  const colors = {
    teal:    'text-brand-teal bg-brand-teal/10 border-brand-teal/20',
    green:   'text-status-normal bg-status-normal/10 border-status-normal/20',
    yellow:  'text-status-warning bg-status-warning/10 border-status-warning/20',
    red:     'text-status-danger bg-status-danger/10 border-status-danger/20',
  }
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-[#E8F4F8]">{value}</p>
        <p className="text-xs text-brand-muted">{label}</p>
      </div>
    </div>
  )
}

export function Dashboard() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    patientApi.getAll()
      .then(setPatients)
      .finally(() => setLoading(false))
  }, [])

  const atRisk = patients.filter(p =>
    p.glucose > 125 || p.cholesterol >= 240 || p.haemoglobin < 12
  ).length
  const borderline = patients.filter(p =>
    (p.glucose > 99 && p.glucose <= 125) || (p.cholesterol >= 200 && p.cholesterol < 240)
  ).length
  const normal = patients.length - atRisk - borderline

  const recent = [...patients].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#E8F4F8]">Dashboard</h1>
          <p className="text-sm text-brand-muted mt-1">Overview of patient health data</p>
        </div>
        <Link to="/add" className="btn-primary">
          <PlusCircle className="w-4 h-4" />
          Add Patient
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Users}         label="Total Patients"  value={loading ? '—' : patients.length} color="teal"   />
        <StatCard icon={Activity}      label="Normal Range"    value={loading ? '—' : normal}           color="green"  />
        <StatCard icon={TrendingUp}    label="Borderline"      value={loading ? '—' : borderline}       color="yellow" />
        <StatCard icon={AlertTriangle} label="At Risk"         value={loading ? '—' : atRisk}           color="red"    />
      </div>

      {/* Recent Patients */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between">
          <h2 className="font-display font-semibold text-[#E8F4F8]">Recent Patients</h2>
          <Link to="/patients" className="text-xs text-brand-teal hover:text-brand-teal-light flex items-center gap-1">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-brand-muted text-sm">Loading...</div>
        ) : recent.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-brand-muted mx-auto mb-3" />
            <p className="text-sm text-brand-muted">No patients yet.</p>
            <Link to="/add" className="btn-primary mt-4 mx-auto w-fit">
              <PlusCircle className="w-4 h-4" /> Add First Patient
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-brand-border">
              <tr className="text-xs text-brand-muted uppercase tracking-wider">
                <th className="text-left px-6 py-3 font-medium">Patient</th>
                <th className="text-left px-6 py-3 font-medium">Glucose</th>
                <th className="text-left px-6 py-3 font-medium">Hgb</th>
                <th className="text-left px-6 py-3 font-medium">Cholesterol</th>
                <th className="text-left px-6 py-3 font-medium">Added</th>
                <th className="text-left px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {recent.map(p => (
                <tr key={p.id} className="hover:bg-brand-slate/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-[#E8F4F8]">{p.full_name}</p>
                    <p className="text-xs text-brand-muted">{p.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-[#E8F4F8]">{p.glucose}</span>
                    <div className="mt-0.5"><BloodBadge type="glucose" value={p.glucose} /></div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-[#E8F4F8]">{p.haemoglobin}</span>
                    <div className="mt-0.5"><BloodBadge type="haemoglobin" value={p.haemoglobin} /></div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-[#E8F4F8]">{p.cholesterol}</span>
                    <div className="mt-0.5"><BloodBadge type="cholesterol" value={p.cholesterol} /></div>
                  </td>
                  <td className="px-6 py-4 text-xs text-brand-muted">
                    {format(new Date(p.created_at), 'dd MMM yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/patients/${p.id}`} className="text-xs text-brand-teal hover:underline">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
