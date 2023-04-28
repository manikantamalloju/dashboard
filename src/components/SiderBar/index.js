import React from "react";
import {  NavLink, useNavigate } from "react-router-dom";
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

    navigate("/login", { replace: true });
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
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "color-sidebar-para-list " : "sidebar-para-list"
              }
            >
              <p>Dashboard</p>
            </NavLink>
            <NavLink
              to="/executives"
              className={({ isActive }) =>
                isActive ? "color-sidebar-para-list " : "sidebar-para-list"
              }
            >
              <p> Execuitives</p>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "color-sidebar-para-list " : "sidebar-para-list"
              }
            >
              <p>Dashboard</p>
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                isActive ? "color-sidebar-para-list " : "sidebar-para-list"
              }
            >
              <p>Users</p>
            </NavLink>
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
