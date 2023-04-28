import React from "react";
import { Routes, Route } from "react-router-dom";
import UserHome from "./components/UserHome/UserHome";
import AdminHome from "./components/AdminHome";
import LoginPage from "./components/LoginPage/LoginPage";
import SignUpPage from "./components/SignUpPage/SignUpPage";
import UserProtectedRoute from "./components/UserProtectedRoute/index";
import Cookies from "js-cookie";
import Users from "./components/Users/Users";
import Execuites from "./components/Execuites/index";
import Survey from "./components/SurveyForm/SurveyForm";
import NotFound from "./components/NotFound/NotFound";
import AdminProtectedRoute from "./components/AdminProtectedRoute/index";
function App() {
  const role = Cookies.get("role");
  console.log(role);
  return (
    <Routes>
      <Route path="/login" exact element={<LoginPage />} />
      <Route path="/signUp" exact element={<SignUpPage />} />
      <Route path="/surveyF/:surveyId" exact element={<Survey />} />

      <Route
        path="/"
        element={
          role === "user" ? (
            <UserProtectedRoute>
              <UserHome />
            </UserProtectedRoute>
          ) : (
            <AdminProtectedRoute>
              <AdminHome />
            </AdminProtectedRoute>
          )
        }
      />
      <Route
        path="/executives"
        element={
          role === "admin" ? (
            <AdminProtectedRoute>
              <Execuites />
            </AdminProtectedRoute>
          ) : (
            <NotFound />
          )
        }
      />
      <Route
        path="/users"
        
        element={
          role === "user" ? (
            <UserProtectedRoute>
              <Users />
            </UserProtectedRoute>
          ) : (
            <NotFound />
          )
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
