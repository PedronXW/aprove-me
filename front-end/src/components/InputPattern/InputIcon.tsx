interface InputIconInterface {
  icon: React.ReactNode
}

const InputIcon = ({ icon }: InputIconInterface) => {
  return <div className="h-5 w-5">{icon}</div>
}

export default InputIcon
