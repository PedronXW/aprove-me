import { ReactNode, createContext } from 'react'
import { useFormContext } from 'react-hook-form'

interface InputRootInterface {
  patternColor: string
  id: string
  type?: string
  initialVisibility?: boolean
  children: ReactNode
}

interface InputNumberContextInterface {
  id: string
  patternColor: string
}

export const InputNumberContext = createContext(
  {} as InputNumberContextInterface,
)

const InputRootNumber = ({
  patternColor,
  id,
  children,
}: InputRootInterface) => {
  const { setFocus } = useFormContext()

  return (
    <InputNumberContext.Provider
      value={{
        patternColor,
        id,
      }}
    >
      <div
        className={`w-full cursor-pointer ${
          patternColor === 'background_color'
            ? 'drop-shadow-none'
            : 'drop-shadow-md'
        } p-3 flex items-center bg-${patternColor} border-${patternColor} rounded-md`}
        onClick={() => {
          setFocus(id)
        }}
      >
        {children}
      </div>
    </InputNumberContext.Provider>
  )
}

export default InputRootNumber
