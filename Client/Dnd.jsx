import React, { useState, useLayoutEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";
import "./index.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const commands = ["sort", "uniq", "wc", "trim", "regex"];
var hasRegex = false;

function Dnd() {
  const navigate = useNavigate();
  const [characters, updateCharacters] = useState(commands);
  const [new_list, updateNewList] = useState([]);
  const [text, setText] = useState("");
  const [reg, setReg] = useState("");
  const [res, setRes] = useState("");
  const [flag, setFlag] = useState("");
  const [loading, setLoading] = useState(true);

  const check_user_url = "http://localhost:8080/backend/checkuser";
  const logout_url = "http://localhost:8080/backend/logout";
  const output_url = "http://localhost:8080/backend/link";

  const fetch_access = () => {
    fetch(check_user_url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        credentials: "include",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data: " + data.status);
        if (data.status == "deny") {
          navigate("/");
        } else {
          setLoading(false);
        }
      });
  };

  useLayoutEffect(() => {
    fetch_access();
  }, []);

  async function handleOnClick() {
    await fetch(logout_url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        credentials: "include",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data: " + data.response_code);
        if (data.response_code == "200") {
          navigate("/");
          alert("Logout successful");
        }
      });
  }

  async function onSubmit() {
    if (text === "") {
      alert("Please enter input");
      return;
    }
    if (hasRegex == true && reg == "") {
      alert("Please input the regular expression");
      return;
    }
    if (new_list.length == 0) {
      alert("No commands to be executed");
      return;
    }

    var newText = {
      text: text,
      commands: new_list.join(),
      reg: reg,
      user: Cookies.get("user"),
    };

    await fetch(output_url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        credentials: "include",
      },
      body: JSON.stringify(newText),
    })
      .then((response) => response.json())
      .then((data) => {
        setRes(regex(data.output));
      });
  }

  function regex(str) {
    str = str.replace(/,/g, "\n");
    str = str.replace("[", " ");
    return str.replace("]", "");
  }

  function handleOnDragEnd(result) {
    setRes("");
    if (
      result.draggableId == "regex" &&
      result.destination.droppableId == "dropping_area"
    )
      setFlag(true);
    if (
      result.draggableId == "regex" &&
      result.destination.droppableId == "characters"
    ) {
      setFlag(false);
    }
    if (
      !result.destination ||
      (result.destination.droppableId === result.source.droppableId &&
        result.destination.index === result.source.index)
    )
      return;
    else if (result.destination.droppableId === result.source.droppableId) {
      var items;
      if (result.source.droppableId === "characters") {
        items = characters;
      } else {
        items = new_list;
      }
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      if (result.source.droppableId === "characters") {
        updateCharacters(items);
      } else {
        updateNewList(items);
      }
    } else {
      let add,
        active = characters,
        complete = new_list;

      if (result.source.droppableId === "characters") {
        add = active[result.source.index];
        active.splice(result.source.index, 1);
        complete.splice(result.destination.index, 0, add);
      } else {
        add = complete[result.source.index];
        complete.splice(result.source.index, 1);
        active.splice(result.destination.index, 0, add);
      }

      updateCharacters(active);
      updateNewList(complete);
    }
  }

  if (loading) {
    return <h2>Loading...</h2>;
  } else {
    return (
      <>
        <div>
          <input type="submit" value="Log out" onClick={handleOnClick} />
        </div>
        <h1 className="App-header">Pipe Commands</h1>
        <div className="App">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="characters">
              {(provided) => (
                <div
                  className="left"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <ul className="characters">
                    <label className="label">
                      <b>Drag commands from here</b>
                    </label>
                    {characters.map((name, index) => {
                      return (
                        <Draggable key={name} draggableId={name} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              key={name}
                            >
                              {name}
                            </li>
                          )}
                        </Draggable>
                      );
                    })}
                  </ul>
                </div>
              )}
            </Droppable>
            <Droppable droppableId="dropping_area">
              {(provided) => (
                <div
                  className="right"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <ul className="chars">
                    <label className="label">
                      <b>--Drop here--</b>
                    </label>
                    {new_list.map((name, index) => {
                      if (name == "regex") {
                        hasRegex = true;
                        return [
                          <Draggable
                            key={name}
                            draggableId={name}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                key={name}
                              >
                                {name}
                              </li>
                            )}
                          </Draggable>,
                          <input
                            className="reg"
                            type="text"
                            placeholder="Enter regex"
                            key="key"
                            onInput={(e) => {
                              setReg(e.target.value);
                              setRes("");
                            }}
                          ></input>,
                        ];
                      } else {
                        return (
                          <Draggable
                            key={name}
                            draggableId={name}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                key={name}
                              >
                                {name}
                              </li>
                            )}
                          </Draggable>
                        );
                      }
                    })}
                  </ul>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className="lower-left" style={{ clear: "both" }}>
          <label htmlFor="input" className="input_label">
            <b>Enter input in multiple lines: </b>
          </label>
          <textarea
            type="text"
            name="input"
            className="input"
            value={text}
            onInput={(e) => {
              setText(e.target.value);
              setRes("");
            }}
          />
        </div>
        <div>
          <textarea
            className="lower-right"
            style={{ float: "left" }}
            value={res}
            readOnly
            placeholder="---output displayed here---"
          />
        </div>
        <div style={{ clear: "both" }}></div>
        <input
          type="submit"
          className="submit"
          value="Submit"
          onClick={onSubmit}
        />
      </>
    );
  }
}

export default Dnd;
