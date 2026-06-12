import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PlusCircle, Search, Trash2, Eye, Pencil, Users } from 'lucide-react'
import { patientApi, getErrorMessage } from '@/lib/api'
import { BloodBadge } from '@/components/BloodBadge'
import { format } from 'date-fns'

export function PatientsList({ toast }) {
  const [patients, setPatients] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()

  const load = () => {
    setLoading(true)
    patientApi.getAll()
      .then(setPatients)
      .catch(e => toast({ title: 'Error', description: getErrorMessage(e), variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = patients.filter(p =>
    p.full_name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete patient record for "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await patientApi.delete(id)
      toast({ title: 'Deleted', description: `${name}'s record has been removed.`, variant: 'success' })
      load()
    } catch (e) {
      toast({ title: 'Error', description: getErrorMessage(e), variant: 'destructive' })
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#E8F4F8]">Patients</h1>
          <p className="text-sm text-brand-muted mt-1">{patients.length} record{patients.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link to="/add" className="btn-primary">
          <PlusCircle className="w-4 h-4" /> Add Patient
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
        <input
          className="input pl-9"
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-brand-muted text-sm">Loading patients…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-brand-muted mx-auto mb-3" />
            <p className="text-sm text-brand-muted">
              {search ? 'No patients match your search.' : 'No patients added yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-brand-border bg-brand-navy/50">
                <tr className="text-xs text-brand-muted uppercase tracking-wider">
                  <th className="text-left px-6 py-3 font-medium">Patient</th>
                  <th className="text-left px-6 py-3 font-medium">DOB</th>
                  <th className="text-left px-6 py-3 font-medium">Glucose</th>
                  <th className="text-left px-6 py-3 font-medium">Hgb</th>
                  <th className="text-left px-6 py-3 font-medium">Cholesterol</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-brand-slate/20 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#E8F4F8]">{p.full_name}</p>
                      <p className="text-xs text-brand-muted">{p.email}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-brand-muted font-mono">
                      {format(new Date(p.date_of_birth), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm text-[#E8F4F8]">{p.glucose}</p>
                      <BloodBadge type="glucose" value={p.glucose} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm text-[#E8F4F8]">{p.haemoglobin}</p>
                      <BloodBadge type="haemoglobin" value={p.haemoglobin} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm text-[#E8F4F8]">{p.cholesterol}</p>
                      <BloodBadge type="cholesterol" value={p.cholesterol} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => navigate(`/patients/${p.id}`)}
                          className="p-1.5 rounded-lg text-brand-muted hover:text-brand-teal hover:bg-brand-teal/10 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/patients/${p.id}/edit`)}
                          className="p-1.5 rounded-lg text-brand-muted hover:text-status-info hover:bg-status-info/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.full_name)}
                          disabled={deleting === p.id}
                          className="p-1.5 rounded-lg text-brand-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
