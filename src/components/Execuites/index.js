import React from "react";

import SideBar from "../SiderBar";

import "./index.css";

import AdminTable from "../AdminTable/AdminTable";

function Execuites() {
  return (
    <>
      <main>
        <div className="admin-table-container-main">
          <SideBar />

          <AdminTable />
        </div>
      </main>
    </>
  );
}

export default Execuites;

//  <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100vh",
//         justifyContent: "space-between",
//       }}
//     >
//       <SideBar />
//       {/* <h1>Dashboard</h1> */}
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <AdminTable />

//       </Box>
//     </Box>
