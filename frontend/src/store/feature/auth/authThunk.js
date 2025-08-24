import axiosInstance from "../../../config/axiosInstance.config.js";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const signupUser = createAsyncThunk(
    "auth/signupUser", 
    async (user, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/signup", user);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Signup failed");
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/loginUser", 
    async (user, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/login", user);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Login failed");
        }
    }
);


export const getUserInfo = createAsyncThunk(
    "auth/getUserInfo", 
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/user/get-user");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Failed to get user info");
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout", 
    async (user, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/user/logout", user);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || "logout failed");
        }
    }
);



