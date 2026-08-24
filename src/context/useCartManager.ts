import { useState, useEffect } from 'react';
import { Product, ProductVariant, CartItem } from '../types';

const STORAGE_KEY = 'sc_cart_v1';

export function useCartManager() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    product: Product,
    quantity = 1,
    color?: string,
    variant?: ProductVariant,
    size?: string
  ) => {
    const selectedColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
    const selectedVariant = variant || (product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    const cartItemId = `${product.id}__${selectedColor || ''}__${selectedVariant?.id || ''}__${selectedSize || ''}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId || (!item.id && item.product.id === product.id && item.selectedColor === selectedColor));
      if (existing) {
        return prev.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          quantity,
          selectedColor,
          selectedVariant,
          selectedSize,
          selected: true,
        },
      ];
    });
  };

  const updateCartItem = (
    oldCartItemId: string,
    updates: {
      quantity?: number;
      selectedColor?: string;
      selectedVariant?: ProductVariant;
      selectedSize?: string;
    }
  ) => {
    setCart((prev) => {
      const target = prev.find((item) => item.id === oldCartItemId);
      if (!target) return prev;

      const newQty = updates.quantity !== undefined ? updates.quantity : target.quantity;
      if (newQty <= 0) {
        return prev.filter((item) => item.id !== oldCartItemId);
      }

      const newColor = updates.selectedColor !== undefined ? updates.selectedColor : target.selectedColor;
      const newVariant = updates.selectedVariant !== undefined ? updates.selectedVariant : target.selectedVariant;
      const newSize = updates.selectedSize !== undefined ? updates.selectedSize : target.selectedSize;
      const newId = `${target.product.id}__${newColor || ''}__${newVariant?.id || ''}__${newSize || ''}`;

      const duplicateIndex = prev.findIndex((item) => item.id === newId && item.id !== oldCartItemId);
      if (duplicateIndex >= 0) {
        return prev
          .filter((item) => item.id !== oldCartItemId)
          .map((item, idx) =>
            idx === duplicateIndex
              ? { ...item, quantity: item.quantity + newQty }
              : item
          );
      }

      return prev.map((item) =>
        item.id === oldCartItemId
          ? {
              ...item,
              id: newId,
              quantity: newQty,
              selectedColor: newColor,
              selectedVariant: newVariant,
              selectedSize: newSize,
            }
          : item
      );
    });
  };

  const updateCartItemQty = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeCartItem(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId || (!item.id && item.product.id === cartItemId)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const toggleCartItemSelect = (cartItemId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId || (!item.id && item.product.id === cartItemId)
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const selectAllCartItems = (select: boolean) => {
    setCart((prev) => prev.map((item) => ({ ...item, selected: select })));
  };

  const removeCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId && item.product.id !== cartItemId));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSelectedTotal = cart
    .filter((item) => item.selected)
    .reduce((acc, item) => {
      const price = item.selectedVariant ? item.selectedVariant.price : item.product.price;
      return acc + price * item.quantity;
    }, 0);

  return {
    cart,
    setCart,
    addToCart,
    updateCartItem,
    updateCartItemQty,
    toggleCartItemSelect,
    selectAllCartItems,
    removeCartItem,
    clearCart,
    cartCount,
    cartSelectedTotal,
  };
}
