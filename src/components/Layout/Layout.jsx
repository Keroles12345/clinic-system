import { Outlet } from "react-router-dom";
import { FaTooth, FaHeartbeat, FaUserMd } from "react-icons/fa";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-blue-100 relative overflow-hidden font-sans">

      {/* خلفية زخرفية بأيقونات شفافة */}
      <div className="absolute inset-0 opacity-10 select-none pointer-events-none z-0">
        <div className="grid grid-cols-12 gap-10 p-20">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="text-5xl text-blue-300">
              {[<FaTooth />, <FaHeartbeat />, <FaUserMd />][i % 3]}
            </div>
          ))}
        </div>
      </div>

      {/* رأس الصفحة */}
      <header className="relative z-10 bg-white/80 backdrop-blur shadow-md py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
          <FaTooth className="text-blue-600" /> Dental Clinic System
        </h1>
       <span className="text-sm text-blue-500">Managed by Dr. Benjamin</span>

      </header>

      {/* المحتوى الرئيسي */}
      <main className="relative z-10 p-8">
        <Outlet />
      </main>

      {/* تذييل الصفحة */}
      <footer className="relative z-10 bg-white/70 backdrop-blur-sm text-center text-sm text-gray-600 py-4">
        &copy; {new Date().getFullYear()} | All rights reserved by keroles malak.
      </footer>
    </div>
  );
}
