import React, { useEffect, useRef, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setPage, setFilters } from "../../store/feature/lead/leadSlice";
import { getLeads, deleteLead } from "../../store/feature/lead/leadThunk";
import { useNavigate } from "react-router-dom";
import { LoaderThree } from "../../components/ui/loader";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export default function LeadTable({ darkMode }) {
  const gridRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { leads, page, limit, total, filters, loading } = useSelector(
    (state) => state.lead
  );
  const totalPages = Math.ceil(total / limit);

  const [colDefs] = useState([
    {
      field: "first_name",
      headerName: "First Name",
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      field: "last_name",
      headerName: "Last Name",
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      field: "email",
      headerName: "Email",
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      field: "phone",
      headerName: "Phone",
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      field: "company",
      headerName: "Company",
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      field: "city",
      headerName: "City",
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      field: "state",
      headerName: "State",
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      field: "source",
      headerName: "Source",
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      field: "status",
      headerName: "Status",
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      field: "score",
      headerName: "Score",
      sortable: true,
      filter: "agNumberColumnFilter",
    },
    {
      field: "lead_value",
      headerName: "Lead Value",
      sortable: true,
      filter: "agNumberColumnFilter",
    },
    {
      field: "last_activity_at",
      headerName: "Last Activity",
      sortable: true,
      filter: "agDateColumnFilter",
      valueGetter: (params) =>
        params.data.last_activity_at
          ? new Date(params.data.last_activity_at)
          : null,
    },
    {
      field: "is_qualified",
      headerName: "Qualified",
      sortable: true,
      filter: "agTextColumnFilter",
      valueFormatter: (params) => (params.value ? "Yes" : "No"),
    },
    {
      headerName: "Edit",
      cellRenderer: (params) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/leads/edit/${params.data._id}`)}
        >
          Edit
        </Button>
      ),
    },
    {
      headerName: "Delete",
      cellRenderer: (params) => (
        <Button
          size="sm"
          variant="destructive"
          onClick={async () => {
            await dispatch(deleteLead(params.data._id));
          }}
        >
          Delete
        </Button>
      ),
    },
  ]);

  // Fetch leads whenever page or filters change
  useEffect(() => {
    dispatch(getLeads({ page, limit, filters }));
  }, [dispatch, page, limit, filters]);

  // Server-side filter handling
const onFilterChanged = useCallback(() => {
  if (!gridRef.current) return;

  const filterModel = gridRef.current.api.getFilterModel();
  const newFilters = {};

  Object.entries(filterModel).forEach(([field, model]) => {
    if (!model) return;

    switch (model.filterType) {
      case "text":
        if (model.filter) {
          newFilters[field] = model.filter;
        }
        break;

      case "number":
        if (model.filter !== undefined) {
          if (model.type === "equals") newFilters[field] = model.filter;
          if (model.type === "greaterThan")
            newFilters[`${field}_min`] = model.filter;
          if (model.type === "lessThan")
            newFilters[`${field}_max`] = model.filter;
          if (model.type === "inRange") {
            newFilters[`${field}_min`] = model.filter;
            newFilters[`${field}_max`] = model.filterTo;
          }
        }
        break;

      case "date":
        if (model.dateFrom) {
          if (model.type === "equals") newFilters[field] = model.dateFrom;
          if (model.type === "greaterThan")
            newFilters[`${field}_after`] = model.dateFrom;
          if (model.type === "lessThan")
            newFilters[`${field}_before`] = model.dateFrom;
          if (model.type === "inRange") {
            newFilters[`${field}_after`] = model.dateFrom;
            newFilters[`${field}_before`] = model.dateTo;
          }
        }
        break;

      case "set":
        if (model.values && model.values.length > 0) {
          newFilters[field] = model.values.join(",");
        }
        break;
    }
  });

  dispatch(setFilters(newFilters));
  dispatch(setPage(1));
}, [dispatch]);


  // Pagination handlers
  const handlePrev = () => page > 1 && dispatch(setPage(page - 1));
  const handleNext = () => page < totalPages && dispatch(setPage(page + 1));

  // AG Grid themes
  const myThemeDark = themeQuartz.withParams({
    backgroundColor: "#050505",
    browserColorScheme: "dark",
    chromeBackgroundColor: "#23262C",
    foregroundColor: "#FFF",
    headerFontSize: 14,
  });
  const myThemeLight = themeQuartz.withParams({
    browserColorScheme: "light",
    headerFontSize: 14,
  });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 w-full h-full overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <LoaderThree />
          </div>
        ) : (
          <AgGridReact
            ref={gridRef}
            rowData={leads}
            columnDefs={colDefs}
            theme={darkMode ? myThemeDark : myThemeLight}
            suppressMultiSort
            animateRows
            getRowId={(params) => params.data._id}
            onFilterChanged={onFilterChanged}
          />
        )}
      </div>

      <div className="flex justify-between items-center mt-2">
        <Button onClick={handlePrev} disabled={page === 1}>
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button onClick={handleNext} disabled={page === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}

// Helper function to capitalize field names for min/max filters
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
