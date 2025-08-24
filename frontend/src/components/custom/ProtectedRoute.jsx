import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { getUserInfo } from "../../store/feature/auth/authThunk";
import { LoaderThree } from "../ui/loader";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) dispatch(getUserInfo());
  }, [dispatch, isAuthenticated]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderThree />
      </div>
    );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
