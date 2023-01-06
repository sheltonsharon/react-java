import "./App.css";
import React, { useState } from "react";

function App() {
  const [text, setText] = useState("");
  async function onSubmit() {
    var newText = { text: text }; //object
    await fetch(`http://localhost:8080/backend/link`, {
      method: "POST",
      //mode: 'no-cors',
      headers: {
        "Content-Type": "text/plain",
        Origin: "http://localhost:3000/",
      },
      body: JSON.stringify(newText), //body is a string
    })
      .then((response) => response.text())
      .then((datas) => {
        console.log(datas);
        console.log("Success");
      });
  }

  return (
    <div>
      <input
        type="text"
        onInput={(e) => {
          setText(e.target.value);
          console.log(text);
        }}
      ></input>
      <input type="submit" value="Submit" onClick={onSubmit}></input>
    </div>
  );
}

export default App;
