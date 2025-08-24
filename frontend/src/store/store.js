import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./feature/auth/authSlice.js"
import leadReducer from "./feature/lead/leadSlice.js"

export const store = configureStore({
  reducer: {
   auth: authReducer,
   lead : leadReducer
  },
});
