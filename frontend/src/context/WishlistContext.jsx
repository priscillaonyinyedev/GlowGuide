import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { wishlistService } from '../services/shoppingService'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [productIds, setProductIds] = useState([])

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setProductIds([])
      return
    }
    try {
      const data = await wishlistService.get()
      setProductIds(data.productIds ?? [])
    } catch {
      setProductIds([])
    }
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
  }, [refresh])

  const isWishlisted = useCallback((productId) => productIds.includes(productId), [productIds])

  const toggle = useCallback(async (productId) => {
    if (!isAuthenticated) {
      toast.error('Sign in to save products')
      return
    }
    if (isWishlisted(productId)) {
      const data = await wishlistService.remove(productId)
      setProductIds(data.productIds ?? [])
      toast.success('Removed from wishlist')
    } else {
      const data = await wishlistService.add(productId)
      setProductIds(data.productIds ?? [])
      toast.success('Added to wishlist')
    }
  }, [isAuthenticated, isWishlisted])

  const value = useMemo(
    () => ({ productIds, isWishlisted, toggle, refresh }),
    [productIds, isWishlisted, toggle, refresh]
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider')
  return ctx
}
