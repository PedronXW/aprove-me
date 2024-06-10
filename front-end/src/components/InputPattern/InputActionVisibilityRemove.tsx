import { Eye, EyeClosed } from '@phosphor-icons/react'
import { useContext } from 'react'
import { InputContext } from './InputRoot'

const InputActionVisibilityRemove = () => {
  const { visibility, changeVisibility } = useContext(InputContext)

  function handleChangeVisibility() {
    changeVisibility(!visibility)
  }

  return (
    <div className="flex">
      <button
        type="button"
        className="h-5 w-5 mr-4"
        onClick={handleChangeVisibility}
      >
        {visibility ? (
          <EyeClosed
            size={20}
            className="text-primary_color"
            onClick={(event) => {
              changeVisibility(false)
            }}
          />
        ) : (
          <Eye
            size={20}
            className="text-primary_color"
            onClick={(event) => {
              changeVisibility(true)
            }}
          />
        )}
      </button>
    </div>
  )
}

export default InputActionVisibilityRemove
