import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  date_of_birth: z.string().refine(v => {
    const d = new Date(v)
    return !isNaN(d) && d < new Date()
  }, 'Date of birth cannot be in the future'),
  email: z.string().email('Enter a valid email address'),
  glucose: z.coerce.number({ invalid_type_error: 'Must be a number' })
    .positive('Must be positive').max(600, 'Max 600 mg/dL'),
  haemoglobin: z.coerce.number({ invalid_type_error: 'Must be a number' })
    .positive('Must be positive').max(25, 'Max 25 g/dL'),
  cholesterol: z.coerce.number({ invalid_type_error: 'Must be a number' })
    .positive('Must be positive').max(700, 'Max 700 mg/dL'),
})

const fields = [
  { name: 'full_name',     label: 'Full Name',       type: 'text',   placeholder: 'Jane Doe',           col: 2 },
  { name: 'date_of_birth', label: 'Date of Birth',   type: 'date',   placeholder: '',                   col: 1 },
  { name: 'email',         label: 'Email Address',   type: 'email',  placeholder: 'jane@example.com',   col: 1 },
  { name: 'glucose',       label: 'Glucose (mg/dL)', type: 'number', placeholder: 'e.g. 95',            col: 1, hint: 'Normal: 70–99' },
  { name: 'haemoglobin',   label: 'Haemoglobin (g/dL)', type: 'number', placeholder: 'e.g. 13.5',     col: 1, hint: 'Normal: 12–17.5' },
  { name: 'cholesterol',   label: 'Cholesterol (mg/dL)', type: 'number', placeholder: 'e.g. 180',     col: 2, hint: 'Desirable: <200' },
]

export function PatientForm({ defaultValues, onSubmit, isLoading, submitLabel = 'Save Patient' }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {fields.map(f => (
          <div key={f.name} className={cn('space-y-1', f.col === 2 && 'col-span-2')}>
            <label className="label">
              {f.label}
              {f.hint && <span className="ml-2 normal-case text-[10px] text-brand-muted">({f.hint})</span>}
            </label>
            <input
              {...register(f.name)}
              type={f.type}
              placeholder={f.placeholder}
              step={f.type === 'number' ? '0.01' : undefined}
              className={cn('input', errors[f.name] && 'border-status-danger focus:border-status-danger')}
            />
            {errors[f.name] && (
              <p className="text-xs text-status-danger">{errors[f.name].message}</p>
            )}
          </div>
        ))}
      </div>

      {/*ai remark notice */}
      <div className="flex items-start gap-3 bg-brand-teal/5 border border-brand-teal/20 rounded-lg p-3">
  <p className="text-xs text-brand-muted leading-relaxed">
    MIRA will automatically generate an AI-powered health risk assessment based on the blood values provided.
    This appears in the <strong className="text-brand-teal">Remarks</strong> field.
  </p>
</div>

      <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center py-2.5">
  {isLoading ? (
    <>
      <Loader2 className="w-4 h-4 animate-spin" />
      Analysing with AI...
    </>
  ) : (
    submitLabel
  )}
</button>
    </form>
  )
}
