import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { PatientForm } from '@/components/PatientForm'
import { patientApi, getErrorMessage } from '@/lib/api'
import { format } from 'date-fns'

export function EditPatient({ toast }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)

  useEffect(() => {
    patientApi.getOne(id)
      .then(setPatient)
      .catch(() => navigate('/patients'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (data) => {
    setSaving(true)
    try {
      const updated = await patientApi.update(id, data)
      toast({
        title: 'Patient Updated',
        description: `${updated.full_name}'s record saved. ${data.glucose !== patient.glucose || data.haemoglobin !== patient.haemoglobin || data.cholesterol !== patient.cholesterol ? 'AI remarks regenerated.' : ''}`,
        variant: 'success',
      })
      navigate(`/patients/${id}`)
    } catch (e) {
      toast({ title: 'Error', description: getErrorMessage(e), variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-brand-muted text-sm">Loading…</div>
  if (!patient) return null

  const defaultValues = {
    full_name:     patient.full_name,
    date_of_birth: format(new Date(patient.date_of_birth), 'yyyy-MM-dd'),
    email:         patient.email,
    glucose:       patient.glucose,
    haemoglobin:   patient.haemoglobin,
    cholesterol:   patient.cholesterol,
  }

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in">
      <Link to={`/patients/${id}`} className="inline-flex items-center gap-1 text-xs text-brand-muted hover:text-brand-teal mb-6">
        <ChevronLeft className="w-3 h-3" /> Back to Patient
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-[#E8F4F8]">Edit Patient</h1>
        <p className="text-sm text-brand-muted mt-1">
          Updating blood values will trigger a new AI assessment automatically.
        </p>
      </div>

      <div className="card p-6">
        <PatientForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isLoading={saving}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  )
}
