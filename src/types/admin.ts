export type UserRole = 'admin' | 'vendor' | 'user'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Permission {
  resource: string
  actions: ('create' | 'read' | 'update' | 'delete')[]
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { resource: 'orders', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'vendors', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'products', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'categories', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'brands', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'analytics', actions: ['read'] }
  ],
  vendor: [
    { resource: 'orders', actions: ['read', 'update'] },
    { resource: 'products', actions: ['create', 'read', 'update'] },
    { resource: 'analytics', actions: ['read'] }
  ],
  user: []
}

export interface OrderStatus {
  id: string
  name: string
  color: string
}

export const ORDER_STATUSES: OrderStatus[] = [
  { id: 'pending', name: 'En attente', color: 'yellow' },
  { id: 'confirmed', name: 'Confirmée', color: 'blue' },
  { id: 'processing', name: 'En traitement', color: 'orange' },
  { id: 'shipped', name: 'Expédiée', color: 'purple' },
  { id: 'delivered', name: 'Livrée', color: 'green' },
  { id: 'cancelled', name: 'Annulée', color: 'red' }
]