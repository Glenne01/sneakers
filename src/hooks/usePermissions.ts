import { useMemo } from 'react'
import { UserRole, ROLE_PERMISSIONS } from '@/types/admin'

export const usePermissions = (userRole: UserRole) => {
  const permissions = useMemo(() => {
    return ROLE_PERMISSIONS[userRole] || []
  }, [userRole])

  const hasPermission = useMemo(() => {
    return (resource: string, action: 'create' | 'read' | 'update' | 'delete') => {
      const resourcePermission = permissions.find(p => p.resource === resource)
      return resourcePermission?.actions.includes(action) || false
    }
  }, [permissions])

  const canAccess = useMemo(() => {
    return (resource: string) => {
      return permissions.some(p => p.resource === resource)
    }
  }, [permissions])

  return {
    permissions,
    hasPermission,
    canAccess
  }
}