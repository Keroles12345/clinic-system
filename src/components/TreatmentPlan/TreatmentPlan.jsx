import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdPerson } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import { FaStethoscope } from 'react-icons/fa';

function TreatmentPlane() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const navigate = useNavigate();
const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl shadow-md"
    >
      ⬅️ Go Back
    </button>
  );
};
  useEffect(() => {
    axios
      .get("https://sitesbykeroles.com/project1/get_patients.php")
      .then((res) => {
        if (res.data.status === "success") {
          setPatients(res.data.patients);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch patients", err);
      });
  }, []);

  // ✅ تعديل الفلترة: تطابق بداية الاسم فقط
  const filtered = patients.filter((p) =>
    p.name.toLowerCase().startsWith(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      <div className="max-w-[900px] mx-auto">
        <button
  onClick={() => window.history.back()}
  className="flex items-center w-2/6 gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full shadow-sm transition duration-200"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
  <span className="font-medium">Back</span>
</button>
        <h1 className="text-3xl my-2 font-semibold text-blue-900 mb-8 text-center flex items-center justify-center gap-3">
        <FaStethoscope size={28} />
          <span className="tracking-wide">Treatment Plan</span>
        </h1>

        {/* 🔍 Search */}
        <div
          className={`flex items-center gap-3 mb-6 px-4 py-4 rounded-xl shadow transition-all duration-200 border ${
            isFocused ? "border-blue-500" : "border-gray-300"
          } bg-white`}
        >
          <FaSearch className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="find the patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent outline-none text-sm placeholder-gray-600"
          />
        </div>

        {/* 📋 Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <table className="w-full text-sm text-gray-800">
            <thead className="bg-blue-600 text-white text-left">
              <tr>
                <th className="px-6 py-4 w-[80px] border-r border-blue-400">#</th>
                <th className="px-6 py-4">اسم المريض</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((patient, index) => (
                <tr
                  key={patient.id}
                  onClick={() => navigate(`/treatment-plan/${patient.id}`)}
                  className="cursor-pointer border-t hover:bg-blue-50 transition duration-150"
                >
                  <td className="px-6 py-3 border-r border-gray-300">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-3 font-semibold text-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow">
                        <MdPerson className="text-blue-700 text-xl" />
                      </div>
                      <span className="text-base">{patient.name}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-center text-gray-400">
                    لا يوجد مرضى بهذا الاسم.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TreatmentPlane;
