import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define the async thunk for posting the cart
export const postCart = createAsyncThunk(
  "cart/postCart",
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await fetch("https://your-api-endpoint.com/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartData), // Convert the cart data to a JSON string
      });

      if (!response.ok) {
        throw new Error("Failed to post cart");
      }

      const data = await response.json();
      return data; // Return the response data on success
    } catch (error) {
      return rejectWithValue(error.message || "Failed to post cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
    status: null, // Status for tracking the async operation (loading, succeeded, failed)
    error: null,  // Error message if the operation fails
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
  extraReducers: (builder) => {
    builder
      .addCase(postCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Handle the response from the server if needed
      })
      .addCase(postCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { addToCart, removeFromCart, updateCartItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
