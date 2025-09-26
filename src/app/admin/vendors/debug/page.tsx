'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function VendorDebugPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testVendorCreation = async () => {
    setLoading(true)
    try {
      console.log('Début test création vendeur...')

      const testData = {
        email: `test.debug.${Date.now()}@sneakhouse.fr`,
        first_name: 'Debug',
        last_name: 'Test',
        phone: '0123456789',
        role: 'vendor',
        is_active: true
      }

      console.log('Données à insérer:', testData)

      const { data, error } = await supabase
        .from('users')
        .insert(testData)
        .select()
        .single()

      console.log('Résultat Supabase:', { data, error })

      if (error) {
        throw error
      }

      setResult({ success: true, data })
      toast.success('Vendeur créé avec succès!')

    } catch (error: any) {
      console.error('Erreur détaillée:', error)
      setResult({
        success: false,
        error: error.message,
        details: error
      })
      toast.error(`Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'vendor')
        .limit(1)

      console.log('Test lecture vendeurs:', { data, error })
      setResult({
        type: 'read_test',
        success: !error,
        data,
        error: error?.message
      })
    } catch (error: any) {
      console.error('Erreur test lecture:', error)
      setResult({
        type: 'read_test',
        success: false,
        error: error.message
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Debug Création Vendeur</h1>

        <div className="space-y-4 mb-6">
          <Button
            onClick={testVendorCreation}
            disabled={loading}
            className="mr-4"
          >
            {loading ? 'Test en cours...' : 'Tester Création Vendeur'}
          </Button>

          <Button
            onClick={testPermissions}
            variant="secondary"
          >
            Tester Lecture Vendeurs
          </Button>
        </div>

        {result && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Résultat du test:</h3>
            <pre className="text-sm overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
          <ol className="text-blue-700 text-sm space-y-1">
            <li>1. Ouvrez la console du navigateur (F12)</li>
            <li>2. Cliquez sur "Tester Création Vendeur"</li>
            <li>3. Regardez les logs dans la console</li>
            <li>4. Si erreur, copiez le message complet</li>
          </ol>
        </div>
      </div>
    </div>
  )
}