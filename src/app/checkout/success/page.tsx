import { Suspense } from 'react'
import CheckoutSuccessContent from './CheckoutSuccessContent'

export const dynamic = 'force-dynamic'

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
