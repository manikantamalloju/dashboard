import React from "react";

import SideBar from "../SiderBar";

import "./index.css";
import { Box } from "@mui/system";
import AdminTable from "../AdminTable/AdminTable"

function Execuites() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "space-between",
      }}
    >
      <SideBar />
      {/* <h1>Dashboard</h1> */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AdminTable />
        
      </Box>
    </Box>
  );
}

export default Execuites;
