import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import DeviceList from "../pages/DeviceList";
import NewTicket from "../pages/NewTicket";
import NavBar from "../components/NavBar";

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  if (!user) return <Login onLogin={setUser} />

  return (
    <>
      <NavBar user={user} setUser={setUser} />
      <Routes>
        <Route path="/devices" element={<DeviceList />}></Route>
      </Routes>
    </>
  );
}

export default App;
