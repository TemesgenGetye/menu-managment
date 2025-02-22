import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return <h1>react</h1>;
}

const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
