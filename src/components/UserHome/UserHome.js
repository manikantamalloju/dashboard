import React from "react";
import SideBar from "../SiderBar"
import UserBarcharts from "../UserBarcharts/UserBarcharts";
import "./UserHome.css"
function UserHome() {
  return <div className="user-home-container">
    <SideBar/>
    <UserBarcharts/>
    </div>;
}

export default UserHome;

