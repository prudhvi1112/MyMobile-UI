import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dummyProducts } from "../mock/Products";
// import BASE_URL from './API_URL'

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await fetch(`https://fakestoreapi.com/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: dummyProducts,
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
