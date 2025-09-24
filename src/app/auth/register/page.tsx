import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-auto px-6">
        <RegisterForm />
      </div>
    </div>
  )
}