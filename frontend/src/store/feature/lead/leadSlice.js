import { createSlice } from "@reduxjs/toolkit";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from "./leadThunk.js";

const initialState = {
  leads: [],
  selectedLead: null,
  loading: false,
  error: null,
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  filters: {},
  message: "",
};

const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMsg: (state) => {
      state.message = null;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearSelectedLead: (state) => {
      state.selectedLead = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
      state.message = "";
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    };

    builder
      // CREATE
      .addCase(createLead.pending, handlePending)
      .addCase(createLead.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = [action.payload.lead, ...state.leads]; // new array, new reference
        state.total += 1; // update total 
        state.message = action.payload.message;
      })
      .addCase(createLead.rejected, handleRejected)

      // GET LEADS (list with pagination & filters)
      .addCase(getLeads.pending, handlePending)
      .addCase(getLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.data; // the array of leads
        state.page = action.payload.page; // current page
        state.limit = action.payload.limit; // limit per page
        state.total = action.payload.total; // total number of leads
        state.totalPages = action.payload.totalPages; // total pages
      })
      .addCase(getLeads.rejected, handleRejected)

      // GET BY ID
      .addCase(getLeadById.pending, handlePending)
      .addCase(getLeadById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLead = action.payload;
      })
      .addCase(getLeadById.rejected, handleRejected)

      // UPDATE
      .addCase(updateLead.pending, handlePending)
      .addCase(updateLead.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.leads.findIndex(
          (lead) => lead._id === action.payload.updatedLead._id
        );
        if (index !== -1) state.leads[index] = action.payload.updatedLead;
        state.message = action.payload.message;
      })
      .addCase(updateLead.rejected, handleRejected)

      // DELETE
      .addCase(deleteLead.pending, handlePending)
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = state.leads.filter((lead) => lead._id !== action.payload);
        state.message = action.payload.message;
        state.total -= 1;
      })
      .addCase(deleteLead.rejected, handleRejected);
  },
});

export const { clearError, clearMsg, setPage, setFilters, clearSelectedLead } =
  leadSlice.actions;
export default leadSlice.reducer;
