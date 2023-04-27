import { url } from "../config";
import axios from "axios";
import addDays from "date-fns/addDays";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

import "./UserBarcharts.css";
import Cookies from "js-cookie";

// const userseveyList = [
//   { id: 3, survey_date: "18/06/2023", no_surveys: 1 },
//   { id: 7, survey_date: "25/04/2023", no_surveys: 6 },
// ];
const UserBarcharts = () => {
  const userId = Cookies.get("id");
  
  //const [storeList, setStoreList] = useState([]);
  const formatedList = [
    {
      id: 0,
      survey_date: addDays(new Date(), -4).toLocaleDateString("en-GB"),
      no_surveys: 0,
    },
    {
      id: 0,
      survey_date: addDays(new Date(), -3).toLocaleDateString("en-GB"),
      no_surveys: 0,
    },
    {
      id: 0,
      survey_date: addDays(new Date(), -2).toLocaleDateString("en-GB"),
      no_surveys: 0,
    },
    {
      id: 0,
      survey_date: addDays(new Date(), -1).toLocaleDateString("en-GB"),
      no_surveys: 0,
    },
    {
      id: 0,
      survey_date: addDays(new Date(), 0).toLocaleDateString("en-GB"),
      no_surveys: 0,
    },
  ];

  const [getStatusCount, setgetStatusCount] = useState({
    no_of_completed: 0,
    no_of_incompleted: 0,
  });
  const [chartData, setchartData] = useState([]);

  // function for formated date

  const formateDateFromList = (surveyList) => {
    const updatedList = formatedList.map((item) => {
      const matchingItem = surveyList.find(
        (data) => data.survey_date === item.survey_date
      );
      if (matchingItem) {
        return { ...matchingItem };
      } else {
        return item;
      }
    });

    //setStoreList([...updatedList]);
    return updatedList;
  };
  console.log(chartData);
  const getChartsData = async () => {
    axios.get(url.API + "getUserSurveysData/" + `${userId}`).then((respose) => {
      if (respose.statusText === "OK") {
        //console.log(respose.data.user_survey_list, "userbarchars");
        const data = formateDateFromList(respose.data.user_survey_list);
        setchartData(data);

        setgetStatusCount(respose.data.status_count);
      }
    });
  };

  useEffect(() => {
    getChartsData();
    //formateDateFromList();
  }, []);

  return (
    <div className="user-barchart-bg-container">
      {/* active-container */}
      <div className="user-count-container">
        <div className="user-count-container-1">
          <h1 className="user-heading-count">Completed</h1>
          <p className="user-para-count">{getStatusCount.no_of_completed}</p>
        </div>
        <div className="user-count-container-2">
          <h1 className="user-heading-count">In Completed</h1>
          <p className="user-para-count">{getStatusCount.no_of_incompleted}</p>
        </div>
      </div>

      {/* <ResponsiveContainer> */}
      <div className="user-barchart-container">
        <BarChart
          width={600}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="4 4" />

          <XAxis dataKey="survey_date" />
          <YAxis dataKey="no_surveys" />
          <Tooltip />

          <Bar dataKey="no_surveys" fill="#8884d8" barSize={"20"} />
        </BarChart>
      </div>
      {/* </ResponsiveContainer> */}
    </div>
  );
};

export default UserBarcharts;
