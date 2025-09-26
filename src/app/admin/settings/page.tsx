'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CogIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CurrencyEuroIcon,
  TruckIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  EyeIcon,
  KeyIcon
} from '@heroicons/react/24/outline'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/Button'
import { useAdminStore } from '@/stores/adminStore'

interface Setting {
  id: string
  name: string
  description: string
  value: string | boolean | number
  type: 'text' | 'email' | 'phone' | 'textarea' | 'boolean' | 'number' | 'select'
  options?: string[]
}

const settingsCategories = [
  {
    id: 'general',
    name: 'Paramètres généraux',
    icon: CogIcon,
    settings: [
      { id: 'site_name', name: 'Nom du site', description: 'Le nom de votre boutique', value: 'SneakHouse', type: 'text' },
      { id: 'site_description', name: 'Description', description: 'Description de votre boutique', value: 'Votre boutique de sneakers premium', type: 'textarea' },
      { id: 'contact_email', name: 'Email de contact', description: 'Email principal de la boutique', value: 'contact@sneakhouse.fr', type: 'email' },
      { id: 'contact_phone', name: 'Téléphone', description: 'Numéro de téléphone de contact', value: '01 23 45 67 89', type: 'phone' },
      { id: 'timezone', name: 'Fuseau horaire', description: 'Fuseau horaire de la boutique', value: 'Europe/Paris', type: 'select', options: ['Europe/Paris', 'UTC', 'Europe/London', 'America/New_York'] }
    ]
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: BellIcon,
    settings: [
      { id: 'email_notifications', name: 'Notifications par email', description: 'Recevoir des notifications par email', value: true, type: 'boolean' },
      { id: 'order_notifications', name: 'Notifications de commandes', description: 'Être notifié des nouvelles commandes', value: true, type: 'boolean' },
      { id: 'low_stock_notifications', name: 'Alertes stock bas', description: 'Être alerté quand le stock est bas', value: true, type: 'boolean' },
      { id: 'review_notifications', name: 'Notifications d\'avis', description: 'Être notifié des nouveaux avis clients', value: false, type: 'boolean' }
    ]
  },
  {
    id: 'payments',
    name: 'Paiements',
    icon: CurrencyEuroIcon,
    settings: [
      { id: 'currency', name: 'Devise', description: 'Devise par défaut', value: 'EUR', type: 'select', options: ['EUR', 'USD', 'GBP'] },
      { id: 'stripe_enabled', name: 'Stripe activé', description: 'Accepter les paiements par Stripe', value: true, type: 'boolean' },
      { id: 'paypal_enabled', name: 'PayPal activé', description: 'Accepter les paiements par PayPal', value: false, type: 'boolean' },
      { id: 'minimum_order', name: 'Commande minimum', description: 'Montant minimum pour commander (€)', value: 20, type: 'number' }
    ]
  },
  {
    id: 'shipping',
    name: 'Livraison',
    icon: TruckIcon,
    settings: [
      { id: 'free_shipping_threshold', name: 'Livraison gratuite à partir de', description: 'Montant pour la livraison gratuite (€)', value: 80, type: 'number' },
      { id: 'shipping_cost', name: 'Frais de livraison', description: 'Coût de livraison standard (€)', value: 5.99, type: 'number' },
      { id: 'express_shipping_cost', name: 'Livraison express', description: 'Coût de livraison express (€)', value: 12.99, type: 'number' },
      { id: 'processing_time', name: 'Délai de traitement', description: 'Temps de préparation des commandes (jours)', value: 2, type: 'number' }
    ]
  },
  {
    id: 'security',
    name: 'Sécurité',
    icon: ShieldCheckIcon,
    settings: [
      { id: 'two_factor_auth', name: 'Authentification à deux facteurs', description: 'Sécuriser votre compte admin', value: false, type: 'boolean' },
      { id: 'session_timeout', name: 'Expiration de session', description: 'Durée avant déconnexion automatique (minutes)', value: 60, type: 'number' },
      { id: 'login_attempts', name: 'Tentatives de connexion', description: 'Nombre maximum de tentatives avant blocage', value: 5, type: 'number' },
      { id: 'ip_whitelist', name: 'Liste blanche IP', description: 'Adresses IP autorisées pour l\'admin', value: '', type: 'textarea' }
    ]
  }
]

export default function SettingsPage() {
  const { user } = useAdminStore()
  const [activeCategory, setActiveCategory] = useState('general')
  const [settings, setSettings] = useState<Record<string, any>>(() => {
    const initialSettings: Record<string, any> = {}
    settingsCategories.forEach(category => {
      category.settings.forEach(setting => {
        initialSettings[setting.id] = setting.value
      })
    })
    return initialSettings
  })
  const [savedSettings, setSavedSettings] = useState<Record<string, any>>({})

  const updateSetting = (settingId: string, value: any) => {
    setSettings(prev => ({ ...prev, [settingId]: value }))
  }

  const saveSettings = () => {
    setSavedSettings({ ...settings })
    // TODO: Envoyer vers API
    console.log('Settings saved:', settings)
  }

  const resetSettings = () => {
    const resetSettings: Record<string, any> = {}
    settingsCategories.forEach(category => {
      category.settings.forEach(setting => {
        resetSettings[setting.id] = setting.value
      })
    })
    setSettings(resetSettings)
  }

  const activeSettings = settingsCategories.find(cat => cat.id === activeCategory)?.settings || []

  const renderSettingInput = (setting: Setting) => {
    const value = settings[setting.id]

    switch (setting.type) {
      case 'boolean':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => updateSetting(setting.id, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        )

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        )

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {setting.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => updateSetting(setting.id, parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        )

      default:
        return (
          <input
            type={setting.type}
            value={value}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        )
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-gray-600 mt-1">
              Configurez les paramètres de votre boutique
            </p>
          </div>

          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={resetSettings}
              variant="secondary"
            >
              Réinitialiser
            </Button>
            <Button
              onClick={saveSettings}
            >
              Enregistrer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <nav className="space-y-2">
              {settingsCategories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeCategory === category.id
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{category.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-soft"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {settingsCategories.find(cat => cat.id === activeCategory)?.name}
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {activeSettings.map((setting) => (
                    <div key={setting.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-900">
                            {setting.name}
                          </label>
                          <p className="text-sm text-gray-500">
                            {setting.description}
                          </p>
                        </div>
                        {setting.type !== 'boolean' && (
                          <div className="flex-shrink-0 w-64">
                            {renderSettingInput(setting)}
                          </div>
                        )}
                        {setting.type === 'boolean' && (
                          <div className="flex-shrink-0">
                            {renderSettingInput(setting)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations système</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="font-medium text-gray-700">Version:</span>
              <span className="ml-2 text-gray-600">v1.0.0</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Environnement:</span>
              <span className="ml-2 text-gray-600">Production</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Base de données:</span>
              <span className="ml-2 text-gray-600">Supabase</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}