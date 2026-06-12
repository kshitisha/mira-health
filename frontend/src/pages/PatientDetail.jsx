import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Pencil, Trash2, RefreshCw, Sparkles, User, Mail, Calendar } from 'lucide-react'
import { patientApi, getErrorMessage } from '@/lib/api'
import { BloodStat } from '@/components/BloodBadge'
import { format, differenceInYears } from 'date-fns'

export function PatientDetail({ toast }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [regenerating, setRegen]    = useState(false)
  const [deleting, setDeleting]     = useState(false)

  const load = () => {
    setLoading(true)
    patientApi.getOne(id)
      .then(setPatient)
      .catch(() => navigate('/patients'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const handleDelete = async () => {
    if (!window.confirm(`Permanently delete ${patient.full_name}'s record?`)) return
    setDeleting(true)
    try {
      await patientApi.delete(id)
      toast({ title: 'Deleted', description: 'Patient record removed.', variant: 'success' })
      navigate('/patients')
    } catch (e) {
      toast({ title: 'Error', description: getErrorMessage(e), variant: 'destructive' })
      setDeleting(false)
    }
  }

  const handleRegen = async () => {
    setRegen(true)
    try {
      const updated = await patientApi.regenerateRemarks(id)
      setPatient(updated)
      toast({ title: 'Remarks Updated', description: 'AI health assessment regenerated.', variant: 'success' })
    } catch (e) {
      toast({ title: 'Error', description: getErrorMessage(e), variant: 'destructive' })
    } finally {
      setRegen(false)
    }
  }

  if (loading) return <div className="p-8 text-brand-muted text-sm">Loading patient…</div>
  if (!patient) return null

  const age = differenceInYears(new Date(), new Date(patient.date_of_birth))

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <Link to="/patients" className="inline-flex items-center gap-1 text-xs text-brand-muted hover:text-brand-teal">
        <ChevronLeft className="w-3 h-3" /> Back to Patients
      </Link>

      {/* Header card */}
      <div className="card p-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-brand-teal/10 border border-brand-teal/20 rounded-2xl flex items-center justify-center">
            <span className="text-xl font-display font-bold text-brand-teal">
              {patient.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-[#E8F4F8]">{patient.full_name}</h1>
            <div className="flex items-center gap-4 mt-1 text-xs text-brand-muted">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{patient.email}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />
                {format(new Date(patient.date_of_birth), 'dd MMM yyyy')} · {age} yrs
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/patients/${id}/edit`} className="btn-ghost text-sm py-1.5 px-3">
            <Pencil className="w-3.5 h-3.5" /> Edit
          </Link>
          <button onClick={handleDelete} disabled={deleting} className="btn-danger text-sm py-1.5 px-3">
            <Trash2 className="w-3.5 h-3.5" /> {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Blood values */}
      <div className="card p-6 space-y-5">
        <h2 className="text-sm font-display font-semibold text-[#E8F4F8]">Blood Test Results</h2>
        <BloodStat label="Glucose"      value={patient.glucose}      unit="mg/dL" type="glucose"      />
        <BloodStat label="Haemoglobin"  value={patient.haemoglobin}  unit="g/dL"  type="haemoglobin"  />
        <BloodStat label="Cholesterol"  value={patient.cholesterol}   unit="mg/dL" type="cholesterol"  />
      </div>

      {/* AI Remarks */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-teal" />
            <h2 className="text-sm font-display font-semibold text-[#E8F4F8]">MIRA Health Assessment</h2>
          </div>
          <button
            onClick={handleRegen}
            disabled={regenerating}
            className="btn-ghost text-xs py-1 px-2.5"
          >
            <RefreshCw className={`w-3 h-3 ${regenerating ? 'animate-spin' : ''}`} />
            {regenerating ? 'Regenerating…' : 'Regenerate'}
          </button>
        </div>

        {patient.remarks ? (
          <div className="bg-brand-navy rounded-lg p-4 border border-brand-border">
            <p className="text-sm text-[#E8F4F8] leading-relaxed whitespace-pre-wrap">{patient.remarks}</p>
          </div>
        ) : (
          <p className="text-sm text-brand-muted italic">No assessment generated yet.</p>
        )}
      </div>

      {/* Meta */}
      <p className="text-[10px] text-brand-muted text-right">
        Added {format(new Date(patient.created_at), 'dd MMM yyyy HH:mm')} ·
        Updated {format(new Date(patient.updated_at), 'dd MMM yyyy HH:mm')}
      </p>
    </div>
  )
}
