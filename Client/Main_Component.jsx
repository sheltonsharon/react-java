import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dnd from "./Dnd";
import React from "react";
import Auth from "./Auth";
import SignUp from "./SignUp";
import Admin from "./Admin";

function Main_Component() {
  const [value, setValue] = React.useState(false);

  return (
    <div>
      <Auth.Provider value={{ value, setValue }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/commands" element={<Dnd />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </Auth.Provider>
    </div>
  );
}

export default Main_Component;
