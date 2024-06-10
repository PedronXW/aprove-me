import { useState } from 'react'
import AssignorForm from './AssignorForm'
import Popup from './Popup'

export default function ProfileInformationHeader() {
  const [updateProfileModalStatus, setUpdateProfileModalStatus] =
    useState(false)

  const handleChangeUpdateProfileStatus = () => {
    setUpdateProfileModalStatus(!updateProfileModalStatus)
  }

  return (
    <header className="bg-white w-full h-16 flex justify-between items-center ">
      <h1 className="text-2xl font-bold">Meus dados</h1>
      <div className="flex gap-4">
        <div className="flex flex-col items-end">
          <button
            onClick={handleChangeUpdateProfileStatus}
            className="bg-primary_color text-white px-4 py-2 rounded-md"
          >
            Alterar dados de Usuário
          </button>

          <div className={`${updateProfileModalStatus ? 'block' : 'hidden'}`}>
            <Popup>
              <AssignorForm
                closeForm={handleChangeUpdateProfileStatus}
                hasX={true}
              />
            </Popup>
          </div>
        </div>
      </div>
    </header>
  )
}
