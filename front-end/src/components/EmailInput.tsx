import { Envelope } from '@phosphor-icons/react/dist/ssr'
import { FieldErrors, FieldValues } from 'react-hook-form'
import { Input } from './InputPattern'

type EmailInputProps = {
  errors: FieldErrors<FieldValues>
}

export default function EmailInput({ errors }: EmailInputProps) {
  console.log()
  return (
    <div>
      <Input.Root
        id="email"
        patternColor="background_color"
        initialVisibility={false}
      >
        <Input.Icon icon={<Envelope color="gray" size={20} />} />
        <Input.Text placeholder="Email" />
      </Input.Root>
      {errors && errors.email! ? (
        <span
          aria-label={
            'O campo email possui uma inconsistencia, por favor, verifique: ' +
            errors!.email!.message?.toString()
          }
          className="h-6 text-xs text-red-500 pl-2"
        >
          {errors!.email!.message?.toString()}
        </span>
      ) : (
        <div className="h-6"> </div>
      )}
    </div>
  )
}
