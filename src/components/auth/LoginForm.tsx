'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from './AuthProvider'
import { useToast } from '@/components/ui/Toast'

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

type LoginForm = z.infer<typeof loginSchema>

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { signIn } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)

    try {
      const { data: authData, error } = await signIn(data.email, data.password)

      if (error) {
        showToast({
          type: 'error',
          title: 'Erreur de connexion',
          message: (error as Error)?.message === 'Invalid login credentials'
            ? 'Email ou mot de passe incorrect'
            : (error as Error)?.message || 'Une erreur est survenue'
        })
        return
      }

      if ((authData as { user?: unknown })?.user) {
        showToast({
          type: 'success',
          title: 'Connexion réussie',
          message: 'Vous êtes maintenant connecté'
        })

        // Redirect based on user role or to homepage
        router.push('/')
      }
    } catch (error) {
      console.error('Login error:', error)
      showToast({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la connexion'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary mb-2">Connexion</h2>
        <p className="text-accent">Accédez à votre espace personnel</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <Input
          type="email"
          label="Adresse email"
          placeholder="votre@email.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Password */}
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            label="Mot de passe"
            placeholder="••••••••"
            icon={Lock}
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[2.5rem] text-accent hover:text-secondary transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          Se connecter
        </Button>

        {/* Sign Up Link */}
        <div className="text-center text-sm">
          <span className="text-accent">Pas encore de compte ? </span>
          <Link
            href="/auth/register"
            className="text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            Créer un compte
          </Link>
        </div>
      </form>

      {/* Social Login (Optional) */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-accent">Ou continuer avec</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              showToast({
                type: 'info',
                title: 'Bientôt disponible',
                message: 'La connexion Google sera bientôt disponible'
              })
            }}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              showToast({
                type: 'info',
                title: 'Bientôt disponible',
                message: 'La connexion Facebook sera bientôt disponible'
              })
            }}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LoginForm