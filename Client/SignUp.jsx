import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function SignUp() {
  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  async function onSubmit() {
    var newText = { uname: uname, pass: pass };

    const signup_url = "http://localhost:8080/backend/sign_up";
    await fetch(signup_url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        credentials: "include",
      },
      body: JSON.stringify(newText),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status == "duplicate") {
          alert("The username already exists, try another username");
        } else if (data.status == "inserted") {
          alert("New user with username " + uname + " has been created");
          navigate("/");
        }
      });
  }

  return (
    <div className="division">
      <h1>Sign Up</h1>
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
      <input type="submit" value="Sign up" onClick={onSubmit} />
      <br />
      <Link to="/">Login instead</Link>
    </div>
  );
}

export default SignUp;
