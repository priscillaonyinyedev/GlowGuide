import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { cartService } from '../services/shoppingService'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null)
      setError('')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      const data = await cartService.get()
      setCart(data)
    } catch (err) {
      setError(err.message || 'Could not load your saved shopping list.')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addItem = useCallback(async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Sign in to add items to your cart')
      return
    }
    try {
      const data = await cartService.addItem(productId, quantity)
      setCart(data)
      setError('')
      toast.success('Added to cart')
    } catch (err) {
      toast.error(err.message || 'Could not add this product to your cart')
    }
  }, [isAuthenticated])

  const updateItem = useCallback(async (productId, quantity) => {
    try {
      setCart(await cartService.updateItem(productId, quantity))
      setError('')
    } catch (err) {
      toast.error(err.message || 'Could not update this product')
    }
  }, [])

  const removeItem = useCallback(async (productId) => {
    try {
      setCart(await cartService.removeItem(productId))
      setError('')
      toast.success('Removed from cart')
    } catch (err) {
      toast.error(err.message || 'Could not remove this product')
    }
  }, [])

  const itemCount = useMemo(
    () => cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    [cart]
  )

  const value = useMemo(
    () => ({ cart, isLoading, error, itemCount, refresh, addItem, updateItem, removeItem }),
    [cart, isLoading, error, itemCount, refresh, addItem, updateItem, removeItem]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
