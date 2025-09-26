import { useEffect, useCallback, useState } from 'react'

interface UseOrderRefreshProps {
  refreshFunction: () => void | Promise<void>
  intervalMs?: number
}

interface UseOrderRefreshReturn {
  isRefreshing: boolean
  manualRefresh: () => void
  nextRefreshIn: number
}

export function useOrderRefresh({ refreshFunction, intervalMs = 30000 }: UseOrderRefreshProps): UseOrderRefreshReturn {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [nextRefreshIn, setNextRefreshIn] = useState(intervalMs / 1000)

  const refresh = useCallback(async () => {
    if (isRefreshing) return

    setIsRefreshing(true)
    try {
      await refreshFunction()
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error)
    } finally {
      setIsRefreshing(false)
      setNextRefreshIn(intervalMs / 1000)
    }
  }, [refreshFunction, intervalMs, isRefreshing])

  const manualRefresh = useCallback(() => {
    refresh()
  }, [refresh])

  // Countdown pour le prochain rafraîchissement
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setNextRefreshIn(prev => {
        if (prev <= 1) {
          return intervalMs / 1000
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [intervalMs])

  // Rafraîchissement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      refresh()
    }, intervalMs)

    return () => clearInterval(interval)
  }, [refresh, intervalMs])

  // Aussi rafraîchir lors du focus de la page
  useEffect(() => {
    const handleFocus = () => {
      refresh()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refresh])

  return {
    isRefreshing,
    manualRefresh,
    nextRefreshIn
  }
}