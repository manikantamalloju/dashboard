import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const UserProtectedRoute = (props) => {
  const role = Cookies.get("role");
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const checkAccessToken = () => {
    const userToken = Cookies.get("jwtToken");
    if (userToken === undefined) {
      setIsLoggedIn(false);
      return navigate("/login",{replace:true});
    }
    if (isLoggedIn && role === "user") {
      return navigate("/",{replace:true});
    }
    setIsLoggedIn(true);
  };
  useEffect(() => {
    checkAccessToken();
  }, [isLoggedIn]);
  return <React.Fragment>{isLoggedIn ? props.children : null}</React.Fragment>;
};
export default UserProtectedRoute;