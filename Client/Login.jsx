import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const login_url = "http://localhost:8080/backend/login";
  async function onSubmit() {
    var newText = { uname: uname, pass: pass };
    await fetch(login_url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        credentials: "include",
      },
      body: JSON.stringify(newText),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.status);
        if (data.status == "authenticate") {
          navigate("/commands");
        } else if (data.status == "admin") {
          navigate("/admin");
        } else {
          alert("Invalid username/password");
        }
      });
  }

  return (
    <div className="division">
      <h1>Login Page</h1>
      <input
        type="text"
        placeholder="Enter username"
        className="box"
        onInput={(e) => {
          setUname(e.target.value);
        }}
      ></input>
      <br />
      <input
        type="password"
        placeholder="Enter password"
        className="box"
        onInput={(e) => {
          setPass(e.target.value);
        }}
      ></input>
      <br />
      <input type="submit" value="Login" onClick={onSubmit} />
      <br />
      <Link to="/signup">Create an account</Link>
    </div>
  );
}

export default Login;
