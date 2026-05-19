import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => set((state) => {
        const existingItem = state.items.find(item => item.product_id === product.id);
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.product_id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        }
        return { items: [...state.items, { product_id: product.id, name: product.name, price: product.price, quantity: 1, image_url: product.image_url }] };
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.product_id !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.product_id === productId ? { ...item, quantity } : item
        )
      })),
      clearCart: () => set({ items: [] }),
      getCartTotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: 'gitanjali-cart-storage',
    }
  )
);

export default useCartStore;
