import { Money } from '@phosphor-icons/react/dist/ssr'
import { FieldErrors, FieldValues } from 'react-hook-form'
import { Input } from './InputPattern'

type ValueInputProps = {
  errors: FieldErrors<FieldValues>
}

export default function ValueInput({ errors }: ValueInputProps) {
  return (
    <div>
      <Input.RootNumber
        id="value"
        patternColor="background_color"
        initialVisibility={false}
      >
        <Input.Icon icon={<Money color="gray" size={20} />} />
        <Input.Number placeholder="Valor" />
      </Input.RootNumber>
      {errors.value ? (
        <span
          aria-label={
            'O campo telefone possui uma inconsistencia, por favor, verifique: ' +
            errors!.value!.message?.toString()
          }
          className="h-6 text-xs text-red-500 pl-2"
        >
          {errors!.value!.message?.toString()}
        </span>
      ) : (
        <div className="h-6"></div>
      )}
    </div>
  )
}
