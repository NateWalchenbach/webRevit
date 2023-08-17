import React from "react";
import RevitDemo from "./components/RevitDemo";
import logo from "./assets/logo.png";

function App() {
  return (
    <div>
      <img src={logo} alt="Logo" height="100" />
      <RevitDemo />
    </div>
  );
}

export default App;
