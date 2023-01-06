import { useNavigate } from "react-router-dom";
import React, { useLayoutEffect, useEffect, useState } from "react";
import Posts from "./Posts";
import Pagination from "./Pagination";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import "./App.css";

function Admin() {
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [arr, setArr] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [commands] = useState([
    { command: "sort", isSelected: false },
    { command: "uniq", isSelected: false },
    { command: "wc", isSelected: false },
    { command: "trim", isSelected: false },
    { command: "regex", isSelected: false },
  ]);

  const admin_url = "http://localhost:8080/backend/admin";
  const check_user_url = "http://localhost:8080/backend/checkuser";
  const logout_url = "http://localhost:8080/backend/logout";

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
        console.log("Hi");
        console.log("data: " + data.status);
        if (data.status != "admin") {
          navigate("/");
        } else {
          setLoadingPage(false);
        }
      });
  };

  useLayoutEffect(() => {
    fetch_access();
  }, []);

  const fetching = async () => {
    setLoading(true);
    await fetch(admin_url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        credentials: "include",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const newData = data
          .filter((val) => {
            if (search == "") {
              return val;
            } else if (
              val.username.toLowerCase().includes(search.toLowerCase())
            ) {
              setCurrentPage(1);
              return val;
            }
          })
          .filter((val) => {
            if (startDate != "") {
              if (Date.parse(convertDate(val.time)) >= Date.parse(startDate)) {
                return val;
              }
            } else {
              return val;
            }
          })
          .filter((val) => {
            if (endDate != "") {
              if (Date.parse(convertDate(val.time)) <= Date.parse(endDate)) {
                return val;
              }
            } else {
              return val;
            }
          })
          .filter((val) => {
            var flag = false;
            arr.forEach(function (x) {
              if (arr.length == 0) {
                return val;
              }
              if (!val.commands.includes(x)) {
                flag = true;
              }
            });
            if (flag == false) {
              return val;
            }
          })
          .map((object) => ({
            time: object.time,
            commands: object.commands,
            username: object.username,
          }));
        setResponse(newData);
      });
    setLoading(false);
  };

  useEffect(() => {
    fetching();
  }, [search, arr, startDate, endDate]);

  const navigate = useNavigate();
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
      });
    navigate("/");
  }

  //Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPost = response.slice(indexOfFirstPost, indexOfLastPost);

  //Navigating to other pages
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  function convertDate(inputFormat) {
    var date1 = new Date(inputFormat),
      mnth = ("0" + (date1.getMonth() + 1)).slice(-2),
      day = ("0" + date1.getDate()).slice(-2);
    return [date1.getFullYear(), mnth, day].join("-");
  }

  if (loadingPage) {
    return <h2>Loading...</h2>;
  } else {
    return (
      <>
        <input
          type="submit"
          value="Log out"
          className="out float-left"
          onClick={handleOnClick}
        />
        <div className="container mt-5">
          <h2 className="text-primary mb">Admin Page</h2>
        </div>

        <div className="container mt-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search username..."
            onInput={(event) => {
              setSearch(event.target.value);
            }}
          />
        </div>
        <div className="my_class container-sm float-left col-2 align-self-center">
          <DatePickerComponent
            placeholder="From"
            format={"yyyy - MM - dd"}
            change={(e) => {
              setStartDate(convertDate(e.value));
            }}
          ></DatePickerComponent>
          <DatePickerComponent
            placeholder="To"
            format={"yyyy - MM - dd"}
            change={(e) => {
              setEndDate(convertDate(e.value));
            }}
          ></DatePickerComponent>
          {commands.map((item) => (
            <div className="checkbox">
              <label>
                <input
                  type="checkbox"
                  value=""
                  key={item.command}
                  onChange={() => {
                    item.isSelected = !item.isSelected;
                    if (item.isSelected) {
                      setArr([...arr, item.command]);
                    } else {
                      setArr(arr.filter((x) => x !== item.command));
                    }
                  }}
                />
                {item.command}
              </label>
            </div>
          ))}
        </div>
        <div className="container mt-5">
          <Posts posts={currentPost} loading={loading} />
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={response.length}
            paginate={paginate}
          />
        </div>
      </>
    );
  }
}

export default Admin;
