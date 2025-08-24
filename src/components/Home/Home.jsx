import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaUserInjured,
  FaStethoscope,
  FaToolbox,
  FaSignOutAlt,
} from "react-icons/fa";
import React, { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/Login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/Login");
  };

  const sections = [
    {
      title: "New Patient",
      icon: <FaUserPlus className="text-white text-3xl" />,
      link: "/patient-profile",
      color: "bg-blue-500",
      hover: "hover:bg-blue-700",
    },
    {
      title: "Patients History",
      icon: <FaUserInjured size={28} />,
      link: "/medical-history",
      color: "bg-green-500",
      hover: "hover:bg-green-700",
    },
    {
      title: "Material Checklist",
      icon: <FaToolbox size={28} />,
      link: "/diagnosis",
      color: "bg-purple-500",
      hover: "hover:bg-purple-700",
    },
    {
      title: "Treatment Plan",
      icon: <FaStethoscope size={28} />,
      link: "/treatment-plan",
      color: "bg-red-500",
      hover: "hover:bg-red-700",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 p-4 relative">
      {/* زر Logout */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-900 transition"
      >
        <FaSignOutAlt />
        Logout
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        Clinic Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {sections.map((sec) => (
          <div
            key={sec.link}
            onClick={() => navigate(sec.link)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(sec.link);
              }
            }}
            role="button"
            tabIndex={0}
            className={`cursor-pointer flex flex-col items-center justify-center w-36 h-36 rounded-full ${sec.color} ${sec.hover} text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none`}
          >
            {sec.icon}
            <span className="mt-2 text-sm font-semibold text-center leading-tight">
              {sec.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
