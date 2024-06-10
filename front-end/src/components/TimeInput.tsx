import { Clock } from '@phosphor-icons/react/dist/ssr'
import { FieldErrors, FieldValues } from 'react-hook-form'
import { Input } from './InputPattern'

type TimeInputProps = {
  errors: FieldErrors<FieldValues>
}

export default function TimeInput({ errors }: TimeInputProps) {
  return (
    <div>
      <Input.Root
        id="time"
        patternColor="background_color"
        initialVisibility={false}
      >
        <Input.Icon icon={<Clock color="gray" size={20} />} />
        <Input.Time />
      </Input.Root>
      {errors.time ? (
        <span
          aria-label={
            'O campo telefone possui uma inconsistencia, por favor, verifique: ' +
            errors!.time!.message?.toString()
          }
          className="h-6 text-xs text-red-500 pl-2"
        >
          {errors!.time!.message?.toString()}
        </span>
      ) : (
        <div className="h-6"></div>
      )}
    </div>
  )
}
