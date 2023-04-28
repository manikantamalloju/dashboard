import React, { useState } from "react";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./LoginPage.css";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { url } from "../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [showPassword, setshowPassword] = useState(false);
  const [errMsg, setErrorMsg] = useState("");
  const togglePasswordVisibility = () => {
    setshowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },

    validationSchema: Yup.object({
      userName: Yup.string()
        //.min(3, "Username should be at least 3 characters long.")
        .required("Required*"),
      password: Yup.string()
        //.min(8, "password should be at least 8 characters long.")
        .required("Required*"),
    }),
    onSubmit: (values) => {
      axios
        .post(url.API + "login", formik.values)
        .then((response) => {
          setErrorMsg("");

          if (response.statusText === "OK") {
            console.log(response.data);
            const { jwt_token, user_details } = response.data;
            console.log(user_details.role);
            Cookies.set("jwtToken", jwt_token, { expires: 10 });

            Cookies.set("role", user_details.role, {
              expires: 10,
            });
            console.log(user_details.username, "username");
            Cookies.set("id", user_details.id, {
              expires: 10,
            });

            // toast_container

            toast.success(" login sucess", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            // use dealy of navigation /UserHome /AdminHome
            setTimeout(() => {
              //console.log( user_details.role === "admin",role,"RaviSabbi");
              const role = Cookies.get("role");
              console.log(role);

              navigate("/", { replace: true });
            }, 400);
            // navigate("/", { replace: true });
          }
          formik.resetForm();
        })
        .catch((e) => {
          toast.error(e.response.data.msg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setErrorMsg(e.response.data.msg);
          console.log(e.response.data.msg);
        });
    },
  });
  
 
  return (
    <div className="login">
      <div className="login-container">
        <h1 className="login-head">Login</h1>
        {/* formik */}
        <form className="login-form" onSubmit={formik.handleSubmit}>
          <div className="form-control">
            <label htmlFor="userName">Username</label>
            <input
              className="user-input"
              type="text"
              id="userName"
              {...formik.getFieldProps("userName")}
              placeholder="Enter username"
            />
            {formik.touched.userName && formik.errors.userName ? (
              <div className="error">{formik.errors.userName}</div>
            ) : null}
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <div className="password-row">
              <input
                className="password-input"
                type={showPassword ? "text" : "password"}
                id="password"
                {...formik.getFieldProps("password")}
                placeholder="Enter password"
              />
              <div
                className="icon-container"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {formik.touched.password && formik.errors.password ? (
              <div className="error">{formik.errors.password}</div>
            ) : null}
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="login-errMsg">{errMsg}</p>
        {/* {formik.values && <p>Login successful!</p>} */}
        <Link to="/signUp">
          <div className="signIn-routing-button">
            <p className="signup-link">signUp</p>
          </div>
        </Link>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {/* Same as */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginPage;
