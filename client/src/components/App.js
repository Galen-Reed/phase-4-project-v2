import React, { useEffect, useState } from "react";
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

  function handleLogin(userData) {
    setUser(userData);
    setTickets(userData.tickets || []);
  }

  if (!user) return <Login onLogin={handleLogin} />

  return (
    <>
      <NavBar user={user} setUser={setUser} setTickets={setTickets} />
      <Routes>
        <Route path="/devices" element={<DeviceList devices={devices} setDevices={setDevices}/>} />
        <Route path="/tickets" element={<UserTickets user={user} tickets={tickets} setTickets={setTickets} devices={devices}/>} />
      </Routes>
    </>
  );
}

export default App;
