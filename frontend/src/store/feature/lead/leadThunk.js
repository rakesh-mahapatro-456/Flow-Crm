import axiosInstance from "../../../config/axiosInstance.config.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

// CREATE LEAD
export const createLead = createAsyncThunk(
  "lead/createLead",
  async (lead, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/leads", lead);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lead creation failed");
    }
  }
);

//GET LEAD WITH QUERY PARAMS
export const getLeads = createAsyncThunk(
  "lead/getLeads",
  async ({ page = 1, limit = 20, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, limit });

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value);
        }
      });

      const response = await axiosInstance.get(`/leads?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch leads");
    }
  }
);


// GET LEAD BY ID
export const getLeadById = createAsyncThunk(
  "lead/getLeadById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/leads/${id}`);
      return response.data.leadInfo;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lead retrieval failed");
    }
  }
);

// UPDATE LEAD
export const updateLead = createAsyncThunk(
  "lead/updateLead",
  async ({ id, updatedInfo }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/leads/${id}`, updatedInfo);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lead update failed");
    }
  }
);

// DELETE LEAD
export const deleteLead = createAsyncThunk(
  "lead/deleteLead",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/leads/${id}`);
      return id; // return id so we can remove it from state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lead deletion failed");
    }
  }
);
