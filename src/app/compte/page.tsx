'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

interface LoginForm {
  email: string
  password: string
}

interface RegisterForm {
  firstName: string
  lastName: string  
  phone: string
  email: string
  password: string
  acceptTerms: boolean
}

export default function ComptePage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin, isSubmitting: isSubmittingLogin }
  } = useForm<LoginForm>()

  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: errorsRegister, isSubmitting: isSubmittingRegister }
  } = useForm<RegisterForm>()

  const onLoginSubmit = async (data: LoginForm) => {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        throw new Error(error.message)
      }

      toast.success('Connexion réussie !')
      // Redirect to settings or home
      window.location.href = '/settings'
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Erreur de connexion')
    }
  }

  const onRegisterSubmit = async (data: RegisterForm) => {
    try {
      // 1. Créer un utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error('Erreur lors de la création du compte')
      }

      // 2. Créer l'enregistrement utilisateur dans la table users
      const { error: userError } = await supabase
        .from('users')
        .insert({
          auth_user_id: authData.user.id,
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          role: 'customer',
          is_active: true
        })

      if (userError) {
        throw new Error(userError.message)
      }

      toast.success('Compte créé avec succès !')
      setIsLogin(true)
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Erreur lors de la création du compte')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </h1>
          <p className="text-gray-600">
            {isLogin 
              ? 'Connectez-vous à votre compte SneakHouse' 
              : 'Rejoignez la communauté SneakHouse'
            }
          </p>
        </motion.div>

        {/* Tab Toggle */}
        <motion.div 
          className="bg-white rounded-2xl p-2 shadow-soft mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setIsLogin(true)}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                isLogin 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                !isLogin 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Créer un compte
            </button>
          </div>
        </motion.div>

        {/* Forms */}
        <motion.div 
          className="bg-white rounded-2xl p-8 shadow-soft"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmitLogin(onLoginSubmit)}
                className="space-y-6"
              >
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    {...registerLogin('email', {
                      required: 'L\'email est requis',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email invalide'
                      }
                    })}
                    className="input-field"
                    placeholder="votre@email.com"
                  />
                  {errorsLogin.email && (
                    <p className="text-red-500 text-sm mt-1">{errorsLogin.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...registerLogin('password', {
                        required: 'Le mot de passe est requis',
                        minLength: {
                          value: 6,
                          message: 'Le mot de passe doit contenir au moins 6 caractères'
                        }
                      })}
                      className="input-field pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errorsLogin.password && (
                    <p className="text-red-500 text-sm mt-1">{errorsLogin.password.message}</p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <a href="#" className="text-sm text-orange-500 hover:text-orange-600">
                    Mot de passe oublié ?
                  </a>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={isSubmittingLogin}
                >
                  Se connecter
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmitRegister(onRegisterSubmit)}
                className="space-y-6"
              >

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    {...registerRegister('firstName', {
                      required: 'Le prénom est requis',
                      minLength: {
                        value: 2,
                        message: 'Le prénom doit contenir au moins 2 caractères'
                      }
                    })}
                    className="input-field"
                    placeholder="Jean"
                  />
                  {errorsRegister.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errorsRegister.firstName.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    {...registerRegister('lastName', {
                      required: 'Le nom est requis',
                      minLength: {
                        value: 2,
                        message: 'Le nom doit contenir au moins 2 caractères'
                      }
                    })}
                    className="input-field"
                    placeholder="Dupont"
                  />
                  {errorsRegister.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errorsRegister.lastName.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    {...registerRegister('phone', {
                      required: 'Le numéro de téléphone est requis',
                      pattern: {
                        value: /^[0-9+\-\s()]{8,15}$/,
                        message: 'Numéro de téléphone invalide'
                      }
                    })}
                    className="input-field"
                    placeholder="06 12 34 56 78"
                  />
                  {errorsRegister.phone && (
                    <p className="text-red-500 text-sm mt-1">{errorsRegister.phone.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    {...registerRegister('email', {
                      required: 'L\'email est requis',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email invalide'
                      }
                    })}
                    className="input-field"
                    placeholder="votre@email.com"
                  />
                  {errorsRegister.email && (
                    <p className="text-red-500 text-sm mt-1">{errorsRegister.email.message}</p>
                  )}
                </div>


                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...registerRegister('password', {
                        required: 'Le mot de passe est requis',
                        minLength: {
                          value: 6,
                          message: 'Le mot de passe doit contenir au moins 6 caractères'
                        }
                      })}
                      className="input-field pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errorsRegister.password && (
                    <p className="text-red-500 text-sm mt-1">{errorsRegister.password.message}</p>
                  )}
                </div>


                {/* Terms */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    {...registerRegister('acceptTerms', {
                      required: 'Vous devez accepter les conditions'
                    })}
                    className="mt-1 text-orange-500 focus:ring-orange-500 rounded"
                  />
                  <label className="ml-3 text-sm text-gray-600">
                    J&apos;accepte les{' '}
                    <a href="#" className="text-orange-500 hover:text-orange-600">
                      conditions d&apos;utilisation
                    </a>{' '}
                    et la{' '}
                    <a href="#" className="text-orange-500 hover:text-orange-600">
                      politique de confidentialité
                    </a>
                  </label>
                </div>
                {errorsRegister.acceptTerms && (
                  <p className="text-red-500 text-sm">{errorsRegister.acceptTerms.message}</p>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={isSubmittingRegister}
                >
                  Créer mon compte
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  )
}