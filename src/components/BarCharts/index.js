import { url } from "../config";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

import "./index.css";

const BarCharts = () => {
  const [getUsersCount, setgetUsersCount] = useState({
    active_users: 0,
    inactive_users: 0,
  });
  const [chartData, setchartData] = useState([]);
  const getChartsData = async () => {
    axios.get(url.API + "getUserData").then((respose) => {
      if (respose.statusText === "OK") {
        console.log(respose);
        setchartData(respose.data.user_data);

        setgetUsersCount(respose.data.status_count);
      }
    });
  };
  // console.log(getUsersCount);
  useEffect(() => {
    getChartsData();
  }, []);
  return (
    <div className="barchart-bg-container">
      {/* active-container */}
      <div className="count-container">
        <div className="count-container-1">
          <h1 className="heading-count">Active users</h1>
          <p className="para-count">{getUsersCount.active_users}</p>
        </div>
        <div className="count-container-2">
          <h1 className="heading-count">Inactive users</h1>
          <p className="para-count">{getUsersCount.inactive_users}</p>
        </div>
      </div>

      {/* <ResponsiveContainer> */}
      <div className="barchart-container">
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="username" />
          <YAxis />
          <Tooltip />

          <Bar dataKey="no_surveys" fill="#8884d8" barSize={40} />
        </BarChart>
      </div>
    </div>
  );
};

export default BarCharts;
