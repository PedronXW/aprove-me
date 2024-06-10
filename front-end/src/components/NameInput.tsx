import { Person } from '@phosphor-icons/react/dist/ssr'
import { FieldErrors, FieldValues } from 'react-hook-form'
import { Input } from './InputPattern'

type NameInputProps = {
  errors: FieldErrors<FieldValues>
}

export default function NameInput({ errors }: NameInputProps) {
  return (
    <div>
      <Input.Root
        id="name"
        patternColor="background_color"
        initialVisibility={false}
      >
        <Input.Icon icon={<Person color="gray" size={20} />} />
        <Input.Text placeholder="Nome" />
      </Input.Root>
      {errors.name ? (
        <span
          aria-label={
            'O campo nome possui uma inconsistencia, por favor, verifique: ' +
            errors!.name!.message?.toString()
          }
          className="h-6 text-xs text-red-500 pl-2"
        >
          {errors!.name!.message?.toString()}
        </span>
      ) : (
        <div className="h-6"> </div>
      )}
    </div>
  )
}
