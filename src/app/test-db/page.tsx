'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestDBPage() {
  const [status, setStatus] = useState<any>({
    loading: true,
    env: {},
    products: null,
    error: null
  })

  useEffect(() => {
    async function testConnection() {
      try {
        // Test 1: Check environment variables
        const env = {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
          urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined',
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
          keyStart: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) || 'undefined'
        }

        // Test 2: Try to fetch products
        const { data, error, count } = await supabase
          .from('products')
          .select('*', { count: 'exact' })
          .eq('is_active', true)
          .limit(5)

        setStatus({
          loading: false,
          env,
          products: {
            count: count || 0,
            data: data || [],
            error: error?.message || null
          },
          supabaseClient: !!supabase
        })
      } catch (err) {
        setStatus({
          loading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          env: {},
          products: null
        })
      }
    }

    testConnection()
  }, [])

  if (status.loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>

      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Environment Variables:</h2>
          <pre className="text-sm">{JSON.stringify(status.env, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Supabase Client:</h2>
          <p>Client initialized: {status.supabaseClient ? 'YES' : 'NO'}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Products Query:</h2>
          <p>Count: {status.products?.count || 0}</p>
          <p>Error: {status.products?.error || 'None'}</p>
          <p>Data length: {status.products?.data?.length || 0}</p>
        </div>

        {status.products?.data && status.products.data.length > 0 && (
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold mb-2">Sample Products:</h2>
            <ul>
              {status.products.data.slice(0, 3).map((p: any) => (
                <li key={p.id}>{p.name}</li>
              ))}
            </ul>
          </div>
        )}

        {status.error && (
          <div className="bg-red-100 p-4 rounded">
            <h2 className="font-bold mb-2">Error:</h2>
            <p className="text-red-600">{status.error}</p>
          </div>
        )}
      </div>
    </div>
  )
}