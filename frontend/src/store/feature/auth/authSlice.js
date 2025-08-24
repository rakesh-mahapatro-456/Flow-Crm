import { createSlice } from "@reduxjs/toolkit";
import { signupUser, loginUser, getUserInfo,logoutUser } from "./authThunk.js";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    };

    builder
      // Signup
      .addCase(signupUser.pending, handlePending)
      .addCase(signupUser.fulfilled, (state,action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, handleRejected)

      // Login
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, (state,action) => {
        state.loading = false;
         state.user = action.payload;
      })
      .addCase(loginUser.rejected, handleRejected)

      // Get user info (for authenticated state)
      .addCase(getUserInfo.pending, handlePending)
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUserInfo.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

        // Logout
      .addCase(logoutUser.pending, handlePending)
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.message = action.payload.message;
      })
      .addCase(logoutUser.rejected, handleRejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
