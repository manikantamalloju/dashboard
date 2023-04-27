import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";
function SideBar() {
  
  const navigate = useNavigate();
  const role = Cookies.get("role");

  const logout = () => {
    console.log("logout working");
    Cookies.remove("role");
    Cookies.remove("id");
    Cookies.remove("jwtToken");

    navigate("/login",{replace:true});
  };

  console.log(role, "check");
  return (
    <>
      <div className="sidebar-container">
        <div className="admin-container">
          <h1 className="heading-admin">
            {role === "user" ? "User" : "Admin"}
          </h1>
        </div>
        <hr className="sidebar-line" />
        {role === "admin" ? (
          <>
            <Link to="/" className="link">
              <p className="sidebar-para-list">Dashboard</p>
            </Link>
            <Link to="/executives" className="link">
              <p className="sidebar-para-list"> Execuitives</p>
            </Link>
          </>
        ) : (
          <>
            <Link to="/" className="link">
              <p className="sidebar-para-list">Dashboard</p>
            </Link>
            <Link to="/users" className="link">
              <p className="sidebar-para-list">Users</p>
            </Link>
          </>
        )}

        <div className="logout-container">
          <button className="sidebar-button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
export default SideBar;
