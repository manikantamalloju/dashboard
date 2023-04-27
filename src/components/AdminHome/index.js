

import React from "react";

import BarCharts from "../BarCharts";
import SideBar from "../SiderBar";

import "./index.css";

function AdminHome() {
  // const role = Cookies.get("role");
  return (
    <div className="dashboard-container">
      <SideBar />
      
       <BarCharts />

    </div>
  );
}

export default AdminHome;
