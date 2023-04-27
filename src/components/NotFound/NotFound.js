import React from "react";
import "./NotFound.css";

const NotFound = () => (
  <>
    <div className="not-found-container">
      <h1 className="heading-404">404</h1>
      <h1 className="not-found-heading">Not Found</h1>
      <p className="not-found-description">
        The resource requested could not be found on this server!
      </p>
    </div>
  </>
);

export default NotFound;
