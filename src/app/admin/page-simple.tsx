export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Version de test - Dashboard fonctionnel
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Test Vercel</h2>
          <p className="text-gray-600">
            Si vous voyez ce message, l'application fonctionne correctement sur Vercel.
          </p>
        </div>
      </div>
    </div>
  )
}