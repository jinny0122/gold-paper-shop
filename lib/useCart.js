import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCart = create(
  persist(
    (set, get) => ({
      cart: [],

      // 添加商品到购物车 (包含了选中的尺寸和单价)
      addToCart: (product, selectedSize) => {
        const currentCart = get().cart;
        // 判断是否已经存在同款且同尺寸的商品
        const existingIndex = currentCart.findIndex(
          (item) => item.id === product.id && item.selectedSize.name === selectedSize.name
        );

        if (existingIndex > -1) {
          const updatedCart = [...currentCart];
          updatedCart[existingIndex].quantity += 1;
          set({ cart: updatedCart });
        } else {
          set({
            cart: [
              ...currentCart,
              {
                id: product.id,
                title: product.title,
                image_url: product.image_url,
                selectedSize: selectedSize, // { name: '大号 60cm', price: 88 }
                quantity: 1,
              },
            ],
          });
        }
      },

      // 移除单个商品
      removeFromCart: (index) => {
        const updatedCart = get().cart.filter((_, i) => i !== index);
        set({ cart: updatedCart });
      },

      // 修改商品数量
      updateQuantity: (index, delta) => {
        const updatedCart = [...get().cart];
        const newQty = updatedCart[index].quantity + delta;
        if (newQty > 0) {
          updatedCart[index].quantity = newQty;
          set({ cart: updatedCart });
        }
      },

      // 清空购物车
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'inquiry-cart-storage', // 存放在 localStorage 的 key 名称
    }
  )
);