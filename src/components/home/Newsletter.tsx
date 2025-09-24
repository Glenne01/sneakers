'use client'

import React, { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      showToast({
        type: 'error',
        title: 'Email requis',
        message: 'Veuillez saisir votre adresse email'
      })
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showToast({
        type: 'error',
        title: 'Email invalide',
        message: 'Veuillez saisir une adresse email valide'
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call - replace with actual newsletter subscription logic
      await new Promise(resolve => setTimeout(resolve, 2000))

      setIsSubscribed(true)
      showToast({
        type: 'success',
        title: 'Inscription réussie !',
        message: 'Vous recevrez bientôt nos dernières actualités'
      })

      // Reset form after success
      setTimeout(() => {
        setIsSubscribed(false)
        setEmail('')
      }, 3000)

    } catch {
      showToast({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue, veuillez réessayer'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20 bg-secondary text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 w-32 h-32 border border-primary rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 right-10 w-24 h-24 bg-primary/20 rounded-full"
        />
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/10 rounded-full blur-xl"
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mr-4"
              >
                <Mail className="w-8 h-8 text-primary" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Restez <span className="text-primary">connecté</span>
              </h2>
            </div>

            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Inscrivez-vous à notre newsletter pour recevoir les dernières actualités,
              les nouveautés et bénéficier d&apos;offres exclusives.
            </p>
          </motion.div>

          {/* Newsletter Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-md mx-auto mb-12"
          >
            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-primary"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Inscription en cours...' : "S&apos;inscrire à la newsletter"}
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center space-x-3 p-4 bg-green-500/20 rounded-lg border border-green-500/30"
              >
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-green-400 font-semibold">
                  Merci ! Votre inscription a été confirmée.
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid md:grid-cols-3 gap-8 text-center"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-semibold">Offres Exclusives</h4>
              <p className="text-sm text-gray-400">
                Accédez en avant-première aux promotions et réductions spéciales
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold">Nouveautés en Avant-première</h4>
              <p className="text-sm text-gray-400">
                Soyez les premiers informés des nouvelles collections
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">👟</span>
              </div>
              <h4 className="font-semibold">Conseils Style</h4>
              <p className="text-sm text-gray-400">
                Recevez nos tips et tendances sneakers du moment
              </p>
            </div>
          </motion.div>

          {/* Privacy Notice */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-xs text-gray-400 mt-8 max-w-2xl mx-auto"
          >
            En vous inscrivant, vous acceptez de recevoir nos communications marketing.
            Vous pouvez vous désinscrire à tout moment. Consultez notre{' '}
            <a href="/privacy" className="text-primary hover:underline">
              politique de confidentialité
            </a>
            .
          </motion.p>
        </div>
      </div>
    </section>
  )
}

export default Newsletter