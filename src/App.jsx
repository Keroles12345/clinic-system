import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home/Home.jsx";
import Layout from "./components/Layout/Layout.jsx";
import PatientProfile from "./components/PatientProfile/PatientProfile.jsx";
import MedicalHistory from "./components/MedicalHistory/MedicalHistory.jsx";
import Diagnosis from "./components/Material Checklist/MaterialChecklist.jsx";
import TreatmentPlan from "./components/TreatmentPlan/TreatmentPlan.jsx";
import Notfound from "./components/Notfound/Notfound.jsx";
import PatientDetails from "./components/PatientDetails/PatientDetails.jsx";
import PatientPlan from "./components/PatientPlan/PatientPlan.jsx";
import Login from "./components/Login/Login.jsx";


const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "patient-profile", element: <PatientProfile /> },
      { path: "medical-history", element: <MedicalHistory /> },
      { path: "diagnosis", element: <Diagnosis /> },
      { path: "treatment-plan", element: <TreatmentPlan /> },
      { path: "treatment-plan/:id", element: <PatientPlan /> }, // ✅ المسار الجديد
      { path: "patient/:id", element: <PatientDetails /> },
      { path: "*", element: <Notfound /> },
    ],
  },
   { path: "login", element: <Login /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
