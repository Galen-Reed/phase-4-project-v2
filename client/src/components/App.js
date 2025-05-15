import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import DeviceList from "../pages/DeviceList";
import UserDevices from "../pages/UserDevices";
import NavBar from "../components/NavBar";

function App() {

  const [user, setUser] = useState(null);
  const [userDevices, setUserDevices] = useState([])
  const [allDevices, setAllDevices] = useState([]);

  useEffect(() => {
    fetch("/check_session", {
      method: "GET",
      credentials: "same-origin",
    }).then((r) => {
      if (r.ok) {
        r.json().then((userData) => {
          setUser(userData);
          setUserDevices(userData.devices || []);
      });
      }
    });
  }, []);

  useEffect(() => {
    fetch("/devices")
    .then((response) => response.json())
    .then((data) => setAllDevices(data));
  }, []);

  function handleLogin(userData) {
    setUser(userData);
    setUserDevices(userData.devices || []);
  }

  console.log(allDevices);

  if (!user) return <Login onLogin={handleLogin} />

  return (
    <>
      <NavBar user={user} setUser={setUser} setUserDevices={setUserDevices} />
      <Routes>
        <Route path="/devices" element={<DeviceList devices={allDevices} setDevices={setAllDevices}/>} />
        <Route path="/my-devices" element={<UserDevices user={user} userDevices={userDevices} setUserDevices={setUserDevices} allDevices={allDevices}/>} />
      </Routes>
    </>
  );
}

export default App;
