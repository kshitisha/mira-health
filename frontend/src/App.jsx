import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { ToastContainer } from '@/components/Toast'
import { useToast } from '@/hooks/useToast'
import { Dashboard } from '@/pages/Dashboard'
import { PatientsList } from '@/pages/PatientsList'
import { AddPatient } from '@/pages/AddPatient'
import { PatientDetail } from '@/pages/PatientDetail'
import { EditPatient } from '@/pages/EditPatient'

export default function App() {
  const { toasts, toast, dismiss } = useToast()

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-brand-navy">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/"                      element={<Dashboard />} />
            <Route path="/patients"              element={<PatientsList toast={toast} />} />
            <Route path="/patients/:id"          element={<PatientDetail toast={toast} />} />
            <Route path="/patients/:id/edit"     element={<EditPatient toast={toast} />} />
            <Route path="/add"                   element={<AddPatient toast={toast} />} />
          </Routes>
        </main>

        <ToastContainer toasts={toasts} dismiss={dismiss} />
      </div>
    </BrowserRouter>
  )
}
