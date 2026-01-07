import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import base_url from "../baseUrl";


const ProtectedRoute = ({ component: Component }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
        return;
      }

      try {
        const res = await axios.get(`${base_url}/get-all-users?page=1`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
        });
        if (res?.data?.status) {
          setIsAuthenticated(true);
        } else {
          throw new Error("Invalid token");
        }
      } catch (error) {
        const toastId = "token-Id"
        console.log("Token validation error:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        if (!toast.isActive(toastId)) {
          toast.error("Token expired. Please log in again.", { toastId: toastId });
        }
        navigate("/login", { replace: true });
      }
    };

    validateToken();
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  return isAuthenticated ? <Component /> : null;
};

export default ProtectedRoute;