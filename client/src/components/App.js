import React, { useEffect, useInsertionEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import DeviceList from "../pages/DeviceList";
import UserTickets from "../pages/UserTickets";
import NavBar from "../components/NavBar";

function App() {

  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([])
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetch("/check_session", {
      method: "GET",
      credentials: "same-origin",
    }).then((r) => {
      if (r.ok) {
        r.json().then((userData) => {
          setUser(userData);
          setTickets(userData.tickets || []);
      });
      }
    });
  }, []);

  useEffect(() => {
    fetch("/devices")
    .then((response) => response.json())
    .then((data) => setDevices(data));
  }, []);

  if (!user) return <Login onLogin={setUser} />

  return (
    <>
      <NavBar user={user} setUser={setUser} />
      <Routes>
        <Route path="/devices" element={<DeviceList devices={devices} setDevices={setDevices}/>} />
        <Route path="/tickets" element={<UserTickets tickets={tickets} devices={devices}/>} />
      </Routes>
    </>
  );
}

export default App;
