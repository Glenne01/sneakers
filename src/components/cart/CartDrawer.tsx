'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/useCartStore'
import { Button } from '@/components/ui/Button'

const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    totalItems,
    totalAmount,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCartStore()

  const shippingCost = totalAmount > 100 ? 0 : 9.99
  const finalTotal = totalAmount + shippingCost

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-secondary">
                Panier ({totalItems})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeCart}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6">
                  <ShoppingBag className="w-16 h-16 text-accent mb-4" />
                  <h3 className="text-lg font-semibold text-secondary mb-2">
                    Votre panier est vide
                  </h3>
                  <p className="text-accent text-center mb-6">
                    Découvrez nos dernières collections de sneakers
                  </p>
                  <Link href="/catalogue">
                    <Button onClick={closeCart}>
                      Découvrir les produits
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-secondary text-sm mb-1 line-clamp-2">
                          {item.productName}
                        </h4>
                        <p className="text-xs text-accent mb-1">
                          {item.variantColor && `Couleur: ${item.variantColor}`}
                        </p>
                        <p className="text-xs text-accent mb-2">
                          Taille: {item.sizeValue}
                        </p>
                        <p className="font-bold text-primary">
                          {item.price.toFixed(2)} €
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4">
                {/* Shipping Info */}
                <div className="text-sm">
                  {shippingCost === 0 ? (
                    <p className="text-green-600 font-semibold">
                      🎉 Livraison gratuite !
                    </p>
                  ) : (
                    <p className="text-accent">
                      Livraison gratuite dès 100€ d&apos;achat
                      <br />
                      <span className="text-primary font-semibold">
                        Plus que {(100 - totalAmount).toFixed(2)}€ !
                      </span>
                    </p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{totalAmount.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>{shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)} €`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{finalTotal.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link href="/checkout" className="block">
                    <Button className="w-full" onClick={closeCart}>
                      Passer commande
                    </Button>
                  </Link>
                  <Link href="/cart" className="block">
                    <Button variant="outline" className="w-full" onClick={closeCart}>
                      Voir le panier
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer