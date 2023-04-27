import React from "react";
import SideBar from "../SiderBar";
import UserTable from "../UserTable/UserTable";

// import SampleSideBar from "../SampleSideBar/SampleSideBar"
import "./Users.css";
function Users() {
  return (
    <>
      <main>
        <div className="user-table-container-main">
          <SideBar />
          {/* <SampleSideBar/> */}
          <UserTable />
          
        </div>
      </main>
    </>
  );
}

export default Users;
