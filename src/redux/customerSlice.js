import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  userName: "",
  userPassword: "",
  confirmPassword: "",
  userNumber: "",
  email: "",
  userMobileNum: "",
  userAddress: "",
  userPincode: "",
  userGstNumber: "",
  userPanNumber: "",
  userRole: "customer",
  status: "idle", // Could be 'idle', 'loading', 'succeeded', 'failed'
  error: null, // To store error message in case of failure
  response: null, // To store the successful response from the API
};

export const submitCustomerForm = createAsyncThunk(
  "customer/submitForm",
  async (formData, { rejectWithValue }) => {
    try {
      // Make the POST request to the server
      const response = await fetch(`http://192.168.0.124:9998/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if the response is OK
      if (!response.ok) {
        const errorText = await response.text(); // Read the error message as text
        let errorData;
        try {
          // Attempt to parse it as JSON
          errorData = JSON.parse(errorText);
        } catch (e) {
          // If it's not valid JSON, just return the raw text
          errorData = { message: errorText };
        }
        return rejectWithValue(errorData);
      }

      // If the response is OK, parse the data
      const data = await response.json();
      return data;
    } catch (err) {
      // In case of network errors, return the error message
      return rejectWithValue({ message: err.message });
    }
  }
);

// Create the slice with actions and reducers
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    // Action to set form data dynamically
    setFormData: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
    // Action to reset the form data
    resetFormData: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitCustomerForm.pending, (state) => {
        state.status = "loading"; // Set status to loading while waiting for the request
      })
      .addCase(submitCustomerForm.fulfilled, (state, action) => {
        state.status = "succeeded"; // Set status to succeeded on successful API response
        state.response = action.payload; // Store the successful response

        // Reset form data after successful registration
        Object.keys(initialState).forEach((key) => {
          if (key !== "status" && key !== "error" && key !== "response") {
            state[key] = ""; // Clear form data except status, error, and response
          }
        });
      })
      .addCase(submitCustomerForm.rejected, (state, action) => {
        state.status = "failed"; // Set status to failed if the request fails
        state.error = action.payload.message || "Something went wrong"; // Display error message
      });
  },
});

// Export actions to use in components
export const { setFormData, resetFormData } = customerSlice.actions;

// Export the reducer to be included in the store
export default customerSlice.reducer;
