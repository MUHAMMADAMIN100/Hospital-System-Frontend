import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HospitalsList from "./pages/Hospitals/List";
import HospitalForm from "./pages/Hospitals/Form"
import HospitalById from "./pages/Hospitals/Hospital-by-id/HospitalById";
import PatientsList from "./pages/Patients/List";
import HospitalEdit from "./pages/Hospitals/HospitalEdit/HospitalEdit";
import PatientForm from "./pages/Patients/Form";
import EditPatientForm from "./pages/Patients/EditForm";
import PatientInfo from "./pages/Patients/PatientInfo";
import Reports from "./pages/Reports/ReportPage";
import Navbar from "./components/Navbar";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HospitalsList />} />
        <Route path="/hospitals" element={<HospitalsList/>} />
        <Route path="/hospitals/new" element={<HospitalForm />} />
        <Route path="/hospitals/:id" element={<HospitalById />} />
        <Route path="/hospitals/edit/:id" element={<HospitalEdit />} />
        <Route path="/patients" element={<PatientsList />} />
        <Route path="/patients/new" element={<PatientForm />} />
        <Route path="/patients/edit/:id" element={<EditPatientForm />} />
        <Route path="/patients/:id" element={<PatientInfo />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}
