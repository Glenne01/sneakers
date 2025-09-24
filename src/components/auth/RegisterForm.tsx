'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from './AuthProvider'
import { useToast } from '@/components/ui/Toast'

const registerSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter les conditions d\'utilisation'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { signUp } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)

    try {
      const { data: authData, error } = await signUp(
        data.email,
        data.password,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        }
      )

      if (error) {
        let errorMessage = 'Une erreur est survenue lors de l\'inscription'

        const errorMsg = (error as Error)?.message || ''
        if (errorMsg.includes('already registered')) {
          errorMessage = 'Cette adresse email est déjà utilisée'
        } else if (errorMsg.includes('weak password')) {
          errorMessage = 'Le mot de passe est trop faible'
        } else if (errorMsg.includes('invalid email')) {
          errorMessage = 'Adresse email invalide'
        }

        showToast({
          type: 'error',
          title: 'Erreur d\'inscription',
          message: errorMessage
        })
        return
      }

      if ((authData as { user?: unknown })?.user) {
        showToast({
          type: 'success',
          title: 'Inscription réussie',
          message: 'Vérifiez votre email pour confirmer votre compte'
        })

        // Redirect to login or email verification page
        router.push('/auth/verify-email')
      }
    } catch (error) {
      console.error('Registration error:', error)
      showToast({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue lors de l\'inscription'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary mb-2">Créer un compte</h2>
        <p className="text-accent">Rejoignez la communauté SneakHouse</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            label="Prénom"
            placeholder="John"
            icon={User}
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            type="text"
            label="Nom"
            placeholder="Doe"
            icon={User}
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        {/* Email */}
        <Input
          type="email"
          label="Adresse email"
          placeholder="votre@email.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Phone (Optional) */}
        <Input
          type="tel"
          label="Téléphone (optionnel)"
          placeholder="+33 6 12 34 56 78"
          icon={Phone}
          error={errors.phone?.message}
          {...register('phone')}
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

        {/* Confirm Password */}
        <div className="relative">
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirmer le mot de passe"
            placeholder="••••••••"
            icon={Lock}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-[2.5rem] text-accent hover:text-secondary transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="acceptTerms"
            className="mt-1 w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            {...register('acceptTerms')}
          />
          <label htmlFor="acceptTerms" className="text-sm text-accent">
            J&apos;accepte les{' '}
            <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
              conditions d&apos;utilisation
            </Link>{' '}
            et la{' '}
            <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
              politique de confidentialité
            </Link>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          Créer mon compte
        </Button>

        {/* Login Link */}
        <div className="text-center text-sm">
          <span className="text-accent">Déjà un compte ? </span>
          <Link
            href="/auth/login"
            className="text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            Se connecter
          </Link>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm