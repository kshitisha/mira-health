import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { PatientForm } from '@/components/PatientForm'
import { patientApi, getErrorMessage } from '@/lib/api'

export function AddPatient({ toast }) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      const patient = await patientApi.create(data)
      toast({ title: 'Patient Added', description: `${patient.full_name}'s record and AI assessment created.`, variant: 'success' })
      navigate(`/patients/${patient.id}`)
    } catch (e) {
      toast({ title: 'Error', description: getErrorMessage(e), variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in">
      <Link to="/patients" className="inline-flex items-center gap-1 text-xs text-brand-muted hover:text-brand-teal mb-6">
        <ChevronLeft className="w-3 h-3" /> Back to Patients
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-[#E8F4F8]">New Patient</h1>
        <p className="text-sm text-brand-muted mt-1">Enter blood test results — MIRA will generate an AI health assessment automatically.</p>
      </div>

      <div className="card p-6">
        <PatientForm
          onSubmit={handleSubmit}
          isLoading={loading}
          submitLabel="Add Patient & Generate Assessment"
        />
      </div>
    </div>
  )
}
