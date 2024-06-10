import { Lock } from '@phosphor-icons/react/dist/ssr'
import { FieldErrors, FieldValues } from 'react-hook-form'
import { Input } from './InputPattern'

type PasswordInputProps = {
  errors: FieldErrors<FieldValues>
}

export default function PasswordInput({ errors }: PasswordInputProps) {
  return (
    <div>
      <Input.Root id="password" patternColor="background_color">
        <Input.Icon icon={<Lock color="gray" size={20} />} />
        <Input.Text placeholder="Senha" />
        <Input.ActionPassword />
      </Input.Root>
      {errors.password ? (
        <span
          aria-label={
            'O campo senha possui uma inconsistencia, por favor, verifique: ' +
            errors!.password!.message?.toString()
          }
          className="h-6 text-xs text-red-500 pl-2"
        >
          {errors!.password!.message?.toString()}
        </span>
      ) : (
        <div className="h-6"> </div>
      )}
    </div>
  )
}
