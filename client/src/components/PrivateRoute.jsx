import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (role && storedRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
}
