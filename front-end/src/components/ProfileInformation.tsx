import { AssignorContext } from '@/contexts/AssignorContext'
import { useContext } from 'react'
import ProfileInformationHeader from './ProfileInformationHeader'

export default function ProfileInformation() {
  const { assignor } = useContext(AssignorContext)
  return (
    <main className="flex flex-1 flex-col w-full justify-center items-center">
      <ProfileInformationHeader />
      <div className="flex flex-1 gap-4 flex-col w-full">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">Nome</span>
          <span className="text-sm">{assignor ? assignor!.name : ''}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">Email</span>
          <span className="text-sm">{assignor ? assignor!.email : ''}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">Telefone</span>
          <span className="text-sm">{assignor ? assignor!.phone : ''}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">Documento</span>
          <span className="text-sm">{assignor ? assignor!.document : ''}</span>
        </div>
      </div>
    </main>
  )
}
