import { Calendar } from '@phosphor-icons/react/dist/ssr'
import { FieldErrors, FieldValues } from 'react-hook-form'
import { Input } from './InputPattern'

type EmissionDateInputProps = {
  errors: FieldErrors<FieldValues>
}

export default function EmissionDateInput({ errors }: EmissionDateInputProps) {
  return (
    <div>
      <Input.Root
        id="emissionDate"
        patternColor="background_color"
        initialVisibility={false}
      >
        <Input.Icon icon={<Calendar color="gray" size={20} />} />
        <Input.Calendar />
      </Input.Root>
      {errors.emissionDate ? (
        <span
          aria-label={
            'O campo telefone possui uma inconsistencia, por favor, verifique: ' +
            errors!.emissionDate!.message?.toString()
          }
          className="h-6 text-xs text-red-500 pl-2"
        >
          {errors!.emissionDate!.message?.toString()}
        </span>
      ) : (
        <div className="h-6"></div>
      )}
    </div>
  )
}
