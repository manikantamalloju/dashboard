import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { url } from "../config";
import "react-toastify/dist/ReactToastify.css";
import "./SurveyForm.css";
import axios from "axios";

function Survey() {
  if (localStorage.getItem("index") === null) {
    localStorage.setItem("index", 0);
  }
  const i = JSON.parse(localStorage.getItem("index"));
  const [currentQuestion, setCurrentQuestion] = useState(i);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showErrMsg, setShowErrMsg] = useState(false);
  const { surveyId } = useParams();

  const [isSurveyCompleted, setIsSurveyCompleted] = useState("");

  const getSurveyStatus = () => {
    axios
      .get(url.API+`survey/${surveyId}`)
      .then((response) => {
        if (response.statusText === "OK") {
          console.log(response);
          console.log("Response Got", response.data.status);
          setIsSurveyCompleted(response.data.status);
        }
      })
      .catch((e) => {
        setIsSurveyCompleted("NO_SURVEY");
        console.log(e);
      });
  };

  useEffect(() => {
    getSurveyStatus();
  }, [isSurveyCompleted]);

  const errorMsg = "Please select an option";

  const questions = [
    {
      id: 1,
      question: "Are you satisfied with our customer service?",
      options: [
        { option: "Yes", isCorrect: true },
        { option: "No", isCorrect: false },
      ],
    },
    {
      id: 2,
      question: "Do you use our product/service often?",
      options: [
        { option: "Yes", isCorrect: true },
        { option: "No", isCorrect: false },
      ],
    },
    {
      id: 3,
      question: "Would you recommend our product/service to a friend?",
      options: [
        { option: "Yes", isCorrect: true },
        { option: "No", isCorrect: false },
      ],
    },
    {
      id: 4,
      question: "Do you rate the quality of our product/service as good?",
      options: [
        { option: "Yes", isCorrect: true },
        { option: "No", isCorrect: false },
      ],
    },
    {
      id: 5,
      question: "Would you recommend our product/service to a friend?",
      options: [
        { option: "Yes", isCorrect: true },
        { option: "No", isCorrect: false },
      ],
    },
  ];

  const handleNext = () => {
    if (selectedOptions[currentQuestion]) {
      if (currentQuestion === questions.length - 1) {
        axios
          .patch("/submitSurveyForm", { survey_id: surveyId })
          .then((response) => {
            if (response.statusText === "OK") {
              console.log(response);
              localStorage.removeItem("index");
              toast.success("submitted", {
                position: "top-left",
              });

              setTimeout(() => {
                setIsSurveyCompleted(true);
              }, 1500);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        // Go to the next question
        localStorage.setItem("index", currentQuestion + 1);
        //console.log(i);
        setCurrentQuestion(currentQuestion + 1);
        setShowErrMsg(false); // hide error message when moving to next question
      }
    } else {
      setShowErrMsg(true); // show error message if no option selected
    }
  };

  const handleOptionSelect = (event) => {
    const optionSelected = event.target.value;

    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestion] = optionSelected;
    setSelectedOptions(newSelectedOptions);

    setShowErrMsg(false); // hide error message when an option is selected
  };

  const renderSurveyCompletedView = () => (
    <div className="survey-completed-view-container">
      <h1 className="survey-completed-view-heading">Your Survey Completed </h1>
      <p className="survey-completed-caption">You can close your browser</p>
    </div>
  );

  const renderSurveyForm = () => (
    <div className="survey-form-main-container">
      <Formik
        initialValues={{}}
        onSubmit={(values, { setSubmitting }) => {
          console.log("mohan");
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="survey-form-container">
            <div className="survey-form-responsive-container">
              <h1 className="survey-form-question">
                {currentQuestion + 1}.{questions[currentQuestion].question}
              </h1>
              <ul className="survey-options-list-container">
                {questions[currentQuestion].options.map((option, index) => (
                  <li key={index}>
                    <Field
                      type="radio"
                      name={`question${currentQuestion}`}
                      id={`option${index}`}
                      value={option.option}
                      checked={
                        selectedOptions[currentQuestion] === option.option
                      }
                      onChange={handleOptionSelect}
                      className="survey-form-radio-btn"
                    />
                    <label
                      className="survey-form-option-label"
                      htmlFor={`option${index}`}
                    >
                      {option.option}
                    </label>
                  </li>
                ))}
              </ul>
              {showErrMsg ? (
                <p className="survey-form-error-msg">{errorMsg}</p>
              ) : (
                <p className="survey-form-error-msg">{}</p>
              )}
            </div>
            <div className="survey-button-container">
              <button type="button" onClick={handleNext} className="survey-btn">
                {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <ToastContainer />
    </div>
  );

  const renderSurveyNotFoundView = () => (
    <div className="survey-completed-view-container">
      <h1 className="survey-completed-view-heading">
        Sorry! You have no survey yet
      </h1>
      <p className="survey-completed-caption">You can close your browser</p>
    </div>
  );

  const renderingViews = () => {
    switch (isSurveyCompleted) {
      case true:
        return renderSurveyCompletedView();
      case false:
        return renderSurveyForm();
      case "NO_SURVEY":
        return renderSurveyNotFoundView();
      default:
        return null;
    }
  };

  return renderingViews();
}

export default Survey;
