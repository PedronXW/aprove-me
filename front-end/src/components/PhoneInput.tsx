import { Phone } from '@phosphor-icons/react/dist/ssr'
import { FieldErrors, FieldValues } from 'react-hook-form'
import { Input } from './InputPattern'

type PhoneInputProps = {
  errors: FieldErrors<FieldValues>
}

export default function PhoneInput({ errors }: PhoneInputProps) {
  return (
    <div>
      <Input.Root
        id="phone"
        patternColor="background_color"
        initialVisibility={false}
      >
        <Input.Icon icon={<Phone color="gray" size={20} />} />
        <Input.Text placeholder="Telefone" />
      </Input.Root>
      {errors.phone ? (
        <span
          aria-label={
            'O campo telefone possui uma inconsistencia, por favor, verifique: ' +
            errors!.phone!.message?.toString()
          }
          className="h-6 text-xs text-red-500 pl-2"
        >
          {errors!.phone!.message?.toString()}
        </span>
      ) : (
        <div className="h-6"></div>
      )}
    </div>
  )
}
