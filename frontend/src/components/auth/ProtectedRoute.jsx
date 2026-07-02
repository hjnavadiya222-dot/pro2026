import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // Redirect to respective login page depending on the allowed role
    if (allowedRoles && allowedRoles.includes("Faculty") && !allowedRoles.includes("Student")) {
      return <Navigate to="/faculty/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated but doesn't have the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "Student") {
      return <Navigate to="/homepage" replace />;
    } else if (user.role === "Faculty") {
      return <Navigate to="/faculty/homepage" replace />;
    } else if (user.role === "Admin") {
      return <Navigate to="/admin/homepage" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
