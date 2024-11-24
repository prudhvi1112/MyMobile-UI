import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === product.productId
      );

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice = existingItem.price * existingItem.quantity;
      } else {
        state.items.push({
          ...product,
          quantity: 1,
          totalPrice: product.price,
        });
      }
      state.totalQuantity += 1;
      state.totalPrice += product.price;
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.productId === productId);

      if (item) {
        state.totalQuantity -= item.quantity;
        state.totalPrice -= item.price * item.quantity;
        state.items = state.items.filter(
          (item) => item.productId !== productId
        );
      }
    },

    updateCartItem: (state, action) => {
      const { id: productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);

      if (item) {
        const difference = quantity - item.quantity;
        item.quantity = quantity;
        item.totalPrice = item.price * quantity;
        state.totalQuantity += difference;
        state.totalPrice += item.price * difference;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateCartItem, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
