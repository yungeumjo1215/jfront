import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import MemberRegistration from "./components/MemberRegistration";
import MemberList from "./components/MemberList";
import AttendanceCheck from "./components/AttendanceCheck";
import AttendanceList from "./components/AttendanceList";
import EditCompany from "./components/EditCompany";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/register/:companyId" element={<MemberRegistration />} />
          <Route path="/company/:companyId/members" element={<MemberList />} />
          <Route path="/company/:companyId/attendance/check" element={<AttendanceCheck />} />
          <Route path="/company/:companyId/attendance" element={<AttendanceList />} />
          <Route path="/edit-company/:companyId" element={<EditCompany />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
