import { File } from '@phosphor-icons/react/dist/ssr'
import { FieldErrors, FieldValues } from 'react-hook-form'
import { Input } from './InputPattern'

type DocumentInputProps = {
  errors: FieldErrors<FieldValues>
}

export default function DocumentInput({ errors }: DocumentInputProps) {
  return (
    <div>
      <Input.Root
        id="document"
        patternColor="background_color"
        initialVisibility={false}
      >
        <Input.Icon icon={<File color="gray" size={20} />} />
        <Input.Text placeholder="Documento Identificador" />
      </Input.Root>
      {errors.document ? (
        <span
          aria-label={
            'O campo documento possui uma inconsistencia, por favor, verifique: ' +
            errors!.document!.message?.toString()
          }
          className="h-6 text-xs text-red-500 pl-2"
        >
          {errors!.document!.message?.toString()}
        </span>
      ) : (
        <div className="h-6"></div>
      )}
    </div>
  )
}
