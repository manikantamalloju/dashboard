import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { v4 } from "uuid";
// import axios from "axios";
import "./SignUpPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../config";
import { toast, ToastContainer } from "react-toastify";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");
  console.log(submitMsg);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const naviagte = useNavigate();
  const formik = useFormik({
    initialValues: {
      id: v4(),
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      userName: "",
      action: true,
    },
    // validation
    validationSchema: Yup.object({
      userName: Yup.string()
        .min(3, "Username should be at least 3 characters long.")
        .required("Required*"),
      password: Yup.string()
        .min(8, "password should be at least 8 characters long.")
        .matches(
          "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))",
          "needed one (upperCase,lowercase,symbol)"
        )
        .required("Required*"),
      firstName: Yup.string()
        .min(3, "Fullname Should be at least 5 charactes")
        .matches("^[A-Za-z]+(?:[A-Za-z]+)?$", "needed alphabets only")
        .required("Required*"),
      lastName: Yup.string()
        .min(3, "Fullname Should be at least 5 charactes")
        .matches("^[A-Za-z]+(?:[A-Za-z]+)?$", "needed alphabets only")
        .required("Required*"),
      email: Yup.string()
        .email("invalid email id")
        .matches(
          "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$",
          "Invalid Email"
        )
        .required("Required*"),
    }),
    onSubmit: (values) => {
      console.log(values);
      values.role = "user";
      //console.log(values);
      console.log(values);
      axios
        .post(url.API + "user", formik.values)
        .then((response) => {
          console.log(response);
          if (response.statusText === "OK") {
            // Redirect to dashboard on successful login
            setSubmitMsg(response.data.msg);
            // toastcontainer
            toast.success(" signup sucess", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setTimeout(() => {
              naviagte("/login", { replace: true });
            }, 500);

            console.log("User Created");

            formik.resetForm();
          }
        })
        .catch((error) => {
          toast.error(" signup Failed", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          console.log(error);
          setSubmitMsg(error.response.data.msg);
          // Set error message to display to the user
        });
    },
  });
  //console.log(formik.values);
  return (
    <div className="SignUp">
      <div className="login-container">
        <h1 className="heading-signup">SignUp</h1>

        <form className="signup-form" onSubmit={formik.handleSubmit}>
          {/* firstName */}
          <div className="form-control">
            <label className="label-signup" htmlFor="firstName">
              Firstname
            </label>
            <input
              className="input-username"
              type="text"
              {...formik.getFieldProps("firstName")}
              placeholder="Enter Firstname"
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <div className="error">{formik.errors.firstName}</div>
            ) : null}
          </div>
          {/* lastName */}
          <div className="form-control">
            <label className="label-signup" htmlFor="lastName">
              Lastname
            </label>
            <input
              className="input-username"
              type="text"
              {...formik.getFieldProps("lastName")}
              placeholder="Enter Lastname"
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <div className="error">{formik.errors.lastName}</div>
            ) : null}
          </div>
          {/* username */}
          <div className="form-control">
            <label className="label-signup" htmlFor="userName">
              Username
            </label>
            <input
              className="input-username"
              type="text"
              id="userName"
              {...formik.getFieldProps("userName")}
              placeholder="Enter Username"
            />
            {formik.touched.userName && formik.errors.userName ? (
              <div className="error">{formik.errors.userName}</div>
            ) : null}
          </div>
          {/* Email Div */}
          <div className="form-control">
            <label className="label-signup" htmlFor="email">
              Email
            </label>
            <input
              className="input-username"
              type="text"
              id="email"
              {...formik.getFieldProps("email")}
              placeholder="Enter email"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error">{formik.errors.email}</div>
            ) : null}
          </div>
          {/* PasswordDiv */}
          <div className="form-control">
            <label className="label-signup" htmlFor="password">
              Password
            </label>
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

          <button className="signup-button" type="submit">
            SignUp
          </button>
          <p className="signup-submit-msg">{submitMsg}</p>
        </form>
        <Link to="/login">
          <div className="signIn-routing-button">
            <p className="signup-para">LogIn</p>
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

export default SignUpPage;
