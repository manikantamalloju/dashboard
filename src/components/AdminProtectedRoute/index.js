import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AdminProtectedRoute = (props) => {
  const role = Cookies.get("role");
  console.log(role);

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkUserToken = () => {
    const accessToken = Cookies.get("jwtToken");

    if (!accessToken || accessToken === undefined) {
      setIsLoggedIn(false);
      return navigate("/login", { replace: true });
    }
    setIsLoggedIn(true);
    if (isLoggedIn && role === "admin") {
      return navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    checkUserToken();
  }, [isLoggedIn]);
  return <React.Fragment>{isLoggedIn ? props.children : null}</React.Fragment>;
};
export default AdminProtectedRoute;
