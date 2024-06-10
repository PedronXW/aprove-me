'use client'

import { ReactNode, createContext, useState } from 'react'
import { useFormContext } from 'react-hook-form'

interface InputRootInterface {
  patternColor: string
  id: string
  initialVisibility?: boolean
  children: ReactNode
}

interface InputContextInterface {
  id: string
  visibility: boolean
  changeVisibility: (visibility: boolean) => void
  patternColor: string
}

export const InputContext = createContext({} as InputContextInterface)

const InputRoot = ({
  patternColor,
  id,
  children,
  initialVisibility = true,
}: InputRootInterface) => {
  const [visibility, setVisibility] = useState(initialVisibility)

  const { setFocus } = useFormContext()

  return (
    <InputContext.Provider
      value={{
        visibility,
        patternColor,
        changeVisibility: setVisibility,
        id,
      }}
    >
      <div
        className={`w-full cursor-pointer ${
          patternColor === 'background_color'
            ? 'drop-shadow-none'
            : 'drop-shadow-md'
        } p-3 flex items-center bg-background_color border-${patternColor} rounded-md`}
        onClick={() => {
          setFocus(id)
        }}
      >
        {children}
      </div>
    </InputContext.Provider>
  )
}

export default InputRoot
