import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import { InputContext } from './InputRoot'

export default function InputCalendar() {
  const { patternColor, id } = useContext(InputContext)
  const { register } = useFormContext()

  return (
    <input
      {...register(id)}
      type={'date'}
      placeholder="Data"
      autoComplete="nope"
      className={`font-medium text-sm ml-2 bg-${patternColor} border-${patternColor} w-full pr-1`}
    />
  )
}
