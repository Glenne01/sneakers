'use client'

import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, PlusIcon, MinusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

export const CartDrawer = () => {
  const router = useRouter()
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } = useCartStore()
  const total = getTotal()

  const handleQuantityChange = (variantId: string, sizeId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(variantId, sizeId)
    } else {
      updateQuantity(variantId, sizeId, newQuantity)
    }
  }

  const handleCheckout = () => {
    console.log('🛒 Checkout depuis le panier')
    closeCart()

    // Petit délai pour que le drawer se ferme d'abord
    setTimeout(() => {
      console.log('🔄 Redirection vers /checkout')
      router.push('/checkout')
    }, 300)
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeCart}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <ShoppingBagIcon className="h-6 w-6 text-orange-500" />
                        <h2 className="text-lg font-semibold text-gray-900">
                          Panier ({items.length})
                        </h2>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={closeCart}
                        className="p-1"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </Button>
                    </div>

                    {/* Content */}
                    {items.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center p-6">
                        <div className="text-center">
                          <ShoppingBagIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Votre panier est vide
                          </h3>
                          <p className="text-gray-500 mb-6">
                            Découvrez notre collection de sneakers Adidas
                          </p>
                          <Button onClick={closeCart} className="w-full">
                            Continuer mes achats
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                          <AnimatePresence>
                            {items.map((item) => (
                              <motion.div
                                key={`${item.variant.id}-${item.size.id}`}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 last:mb-0"
                              >
                                <div className="flex space-x-4">
                                  {/* Product Image */}
                                  <div className="flex-shrink-0">
                                    <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-100">
                                      {item.variant.image_url ? (
                                        <Image
                                          src={item.variant.image_url}
                                          alt={item.variant.product?.name || ''}
                                          width={80}
                                          height={80}
                                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                                        />
                                      ) : (
                                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                          <span className="text-gray-400 text-xs">No image</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Product Details */}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                      {item.variant.product?.name || ''}
                                    </h4>
                                    <p className="mt-1 text-xs text-gray-500">
                                      {item.variant.color && `Couleur: ${item.variant.color}`}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Pointure: {item.size.size_display}
                                    </p>
                                    <p className="mt-2 text-sm font-medium text-gray-900">
                                      {formatPrice(item.variant.price)}
                                    </p>

                                    {/* Quantity Controls */}
                                    <div className="mt-3 flex items-center space-x-3">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleQuantityChange(item.variant.id, item.size.id, item.quantity - 1)}
                                        className="p-1 h-8 w-8"
                                      >
                                        <MinusIcon className="h-4 w-4" />
                                      </Button>
                                      
                                      <span className="text-sm font-medium min-w-[2rem] text-center">
                                        {item.quantity}
                                      </span>
                                      
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleQuantityChange(item.variant.id, item.size.id, item.quantity + 1)}
                                        className="p-1 h-8 w-8"
                                      >
                                        <PlusIcon className="h-4 w-4" />
                                      </Button>

                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeItem(item.variant.id, item.size.id)}
                                        className="text-red-500 hover:text-red-700 text-xs ml-auto"
                                      >
                                        Supprimer
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 px-6 py-6 bg-gray-50">
                          {/* Shipping Notice */}
                          <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                            <p className="text-sm text-orange-800">
                              {total >= 100 ? (
                                <span className="flex items-center">
                                  ✅ <span className="ml-2">Livraison gratuite incluse !</span>
                                </span>
                              ) : (
                                <span>
                                  Livraison gratuite dès {formatPrice(100)}
                                  <span className="block text-xs mt-1">
                                    Plus que {formatPrice(100 - total)} pour la livraison gratuite
                                  </span>
                                </span>
                              )}
                            </p>
                          </div>

                          {/* Total */}
                          <div className="flex items-center justify-between mb-6">
                            <span className="text-base font-medium text-gray-900">Total</span>
                            <span className="text-xl font-bold text-gray-900">
                              {formatPrice(total)}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-3">
                            <Link href="/checkout" onClick={closeCart}>
                              <Button
                                className="w-full"
                                size="lg"
                              >
                                Finaliser la commande
                              </Button>
                            </Link>
                            <Button
                              variant="secondary"
                              onClick={closeCart}
                              className="w-full"
                              size="lg"
                            >
                              Continuer mes achats
                            </Button>
                          </div>

                          {/* Payment Methods */}
                          <div className="mt-4 text-center">
                            <p className="text-xs text-gray-500 mb-2">Paiements sécurisés</p>
                            <div className="flex justify-center space-x-2">
                              <span className="text-xs bg-white px-2 py-1 rounded border">💳 VISA</span>
                              <span className="text-xs bg-white px-2 py-1 rounded border">💳 MC</span>
                              <span className="text-xs bg-white px-2 py-1 rounded border">💰 PayPal</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}