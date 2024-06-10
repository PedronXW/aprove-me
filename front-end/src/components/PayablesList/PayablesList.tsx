'use client'

import { PayableContext } from '@/contexts/PayablesContext'
import { useContext, useEffect, useRef } from 'react'
import PayableCell from './PayableCell'
import PayablesListHeader from './PayablesListHeader'

export default function PayablesList() {
  const { payables, page, fetchPayables, payablesCount } =
    useContext(PayableContext)

  const ref = useRef(null)

  const listRef = useRef<any>(null)

  const getNextPage = async () => {
    if (payables?.length === payablesCount) return
    fetchPayables()
  }

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      const ratio = entry.intersectionRatio

      if (ratio > 0) {
        getNextPage()
      }
    })

    if (ref.current) {
      intersectionObserver.observe(ref.current)
    }

    listRef.current.scrollTop = listRef.current.scrollHeight

    return () => {
      intersectionObserver.disconnect()
    }
  }, [payables, page, getNextPage])

  return (
    <main className="flex flex-1 flex-col w-full justify-center items-center">
      <PayablesListHeader />
      <div
        ref={listRef}
        className="w-full flex flex-col flex-1 overflow-y-scroll align-bottom p-4"
      >
        {payables ? (
          payables.map((payable) => (
            <PayableCell {...payable} key={payable.id} />
          ))
        ) : (
          <div>Erro ao carregar dados</div>
        )}
        {payables?.length === payablesCount ? (
          <div></div>
        ) : (
          <div ref={ref}>Loading...</div>
        )}
      </div>
    </main>
  )
}
