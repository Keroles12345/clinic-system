import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaUser,
  FaPhone,
  FaBriefcase,
  FaTooth,
  FaUserPlus,
  FaTrashAlt,
  FaHeartbeat,
   FaBirthdayCake,
} from "react-icons/fa";
import { MdPerson } from "react-icons/md";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import DentalPlate from "../DentalPlate/DentalPlate";

function PatientProfile() {
  const [chronicQuestions, setChronicQuestions] = useState([]);
  const [chronicAnswers, setChronicAnswers] = useState({});
  const [teethNotes, setTeethNotes] = useState(() => JSON.parse(localStorage.getItem("patientTeethNotes")) || {});
  const path = useLocation().pathname.replace("/", "");
  const pageTitle = path.charAt(0).toUpperCase() + path.slice(1);
const [age, setAge] = useState("");
  const [form, setForm] = useState(() => JSON.parse(localStorage.getItem("patientForm")) || { name: "", mobile: "", job: "", age: "" });
  const [treatment, setTreatment] = useState(() => localStorage.getItem("patientTreatment") || "");
  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem("patientAnswers")) || {});
  const [visitDate, setVisitDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [teethData, setTeethData] = useState(() => JSON.parse(localStorage.getItem("patientTeethData")) || []);
  const [notes, setNotes] = useState(() => localStorage.getItem("patientNotes") || "");
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [clearSignal, setClearSignal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [xrayImages, setXrayImages] = useState([]);
  const [imageType, setImageType] = useState("");
  const dropRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    ["patientForm", "patientAnswers", "patientTeethData", "patientNotes"].forEach((key) => {
      const val = key === "patientNotes" ? notes : key === "patientTreatment" ? treatment : null;
      if (val !== null) localStorage.setItem(key, val);
    });
    localStorage.setItem("patientForm", JSON.stringify(form));
    localStorage.setItem("patientTreatment", treatment);
    localStorage.setItem("patientAnswers", JSON.stringify(answers));
    localStorage.setItem("patientTeethData", JSON.stringify(teethData));
    localStorage.setItem("patientNotes", notes);
  }, [form, treatment, answers, teethData, notes]);

  useEffect(() => localStorage.setItem("patientTeethNotes", JSON.stringify(teethNotes)), [teethNotes]);

  useEffect(() => {
    axios.get("https://sitesbykeroles.com/project1/get_chronic_questions.php")
      .then(res => setChronicQuestions(Array.isArray(res.data.questions) ? res.data.questions : []))
      .catch(() => setChronicQuestions([]));
  }, []);

  useEffect(() => {
    if (!treatment) return;
    axios.get(`https://sitesbykeroles.com/project1/get_questions.php?treatment=${encodeURIComponent(treatment)}`)
      .then(res => setQuestions(Array.isArray(res.data.questions) ? res.data.questions : []))
      .catch(() => setQuestions([]));
  }, [treatment]);
const handleAnswerChange = (qid, val) =>
  setAnswers(prev => ({ ...prev, [qid]: val }));

const handleFiles = files =>
  setXrayImages(prev => [...prev, ...Array.from(files)]);

const removeImage = idx =>
  setXrayImages(prev => prev.filter((_, i) => i !== idx));

const handleDrag = e => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(e.type === "dragenter" || e.type === "dragover");
};

const handleDrop = e => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  if (e.dataTransfer.files?.length) {
    handleFiles(e.dataTransfer.files);
    e.dataTransfer.clearData();
  }
};
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

const handleSubmit = async e => {
  e.preventDefault();
  setIsSubmitting(true);

  // تحقق من صحة رقم الهاتف
  if (!/^01[0-2,5][0-9]{8}$/.test(form.mobile)) {
    setIsSubmitting(false);
    return setMessage({
      type: "error",
      text: "❌ رقم الموبايل غير صالح، يجب أن يكون رقم مصري.",
    });
  }

  try {
    const { data } = await axios.post("https://sitesbykeroles.com/project1/check_name.php", {
      name: form.name,
    });

    if (data.status === "exists") {
      setIsSubmitting(false);
      return setMessage({
        type: "error",
        text: "❌ هذا الاسم موجود بالفعل.",
      });
    }
  } catch {
    setIsSubmitting(false);
    return setMessage({
      type: "error",
      text: "❌ خطأ أثناء التحقق من الاسم.",
    });
  }
  

  // تجهيز البيانات للإرسال
  const formData = new FormData();
  formData.append("form", JSON.stringify(form)); // يحتوي على name, mobile, job, age
  formData.append("treatment", treatment);
  formData.append("answers", JSON.stringify(answers));
  formData.append("chronicAnswers", JSON.stringify(chronicAnswers));
  formData.append("teethData", JSON.stringify(teethData));
  formData.append("teethNotes", JSON.stringify(teethNotes));
  formData.append("visitDate", visitDate);
  formData.append("notes", notes);
  formData.append("imageType", imageType);

  // إرفاق صور الأشعة
  xrayImages.forEach(file => formData.append("xrayImages[]", file));

  try {
    const res = await axios.post("https://sitesbykeroles.com/project1/save_patient.php", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data.status === "success") {
      setMessage({
        type: "success",
        text: "✅ تم حفظ بيانات المريض بنجاح.",
      });

      // إعادة تعيين الحقول بعد الحفظ
      localStorage.clear();
      setForm({ name: "", mobile: "", job: "", age: "" });
        setTreatment("");
        setQuestions([]);
        setAnswers({});
        setChronicAnswers({});
        setTeethData([]);
        setTeethNotes({});
        setNotes("");
        setXrayImages([]);
        setImageType("");
        setVisitDate(new Date().toISOString().split("T")[0]);
        setClearSignal(true);
        setTimeout(() => setClearSignal(false), 100);
      } else {
        setMessage({ type: "error", text: res.data.message });
      }
    } catch {
      setMessage({ type: "error", text: "❌ فشل الاتصال بالخادم." });
    }

    setIsSubmitting(false);
  };

  return (
    
    <div className="min-h-screen bg-[#eef4fc00] flex flex-col justify-between">
      {message.text && createPortal(
        <div className={`fixed bottom-5 right-5 z-50 px-6 py-4 rounded-xl shadow-lg transition-all duration-300 ${message.type === "success" ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
          {message.text}
        </div>, document.body
      )}
            

      <div className="text-center mt-8 mb-4">
     
        <h1 className="text-3xl font-bold text-blue-700 tracking-wide flex justify-center items-center gap-2">
          <FaUserPlus className="text-blue-700 text-3xl" /> New Patient
        </h1>
      </div>


      <form onSubmit={handleSubmit} className="max-w-[800px] w-full mx-auto p-6 bg-white shadow-lg rounded-xl" 
        onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
        >
<button
  onClick={() => window.history.back()}
  className="flex items-center w-2/6 gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full shadow-sm transition duration-200"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
  <span className="font-medium">Back</span>
</button>
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 text-blue-700 rounded-full w-24 h-24 flex items-center justify-center text-5xl shadow-md">
            <MdPerson />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <FaUser className="text-blue-600" />
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border px-3 py-2 rounded-xl"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <FaPhone className="text-green-600" />
            <input
              type="text"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="w-full border px-3 py-2 rounded-xl"
              required
            />
          </div>

<div className="flex items-center gap-2">
  <FaBirthdayCake className="text-purple-600" />
  <input
    type="number"
    placeholder="Age"
    value={form.age !== '' ? form.age : ''}
    onChange={(e) => {
      const value = e.target.value;
      // لو المدخل فاضي يرجّع القيمة ''، لو رقم يحوّله
      setForm({ ...form, age: value === '' ? '' : parseInt(value) });
    }}
    className="w-full border px-3 py-2 rounded-xl"
    required
  />
</div>


          <div className="flex items-center gap-2">
            <FaBriefcase className="text-gray-700" />
            <input
              type="text"
              placeholder="Job"
              value={form.job}
              onChange={(e) => setForm({ ...form, job: e.target.value })}
              className="w-full border px-3 py-2 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2">
            <FaTooth className="text-pink-600" />
<select
  value={treatment}
  onChange={(e) => setTreatment(e.target.value)}
  className="w-full border px-3 py-2 rounded-xl"
  required
>
  <option value="">Chief Complain</option>
  <option value="Acute Pulpitis">Acute Pulpitis</option>
  <option value="Reversible Pulpitis">Reversible Pulpitis</option>
  <option value="Acute Abscess">Acute Abscess</option>
  <option value="Impacted Third Molar">Impacted Third Molar</option>
  <option value="Acute Gingivitis & Periodontitis ">Acute Gingivitis & Periodontitis </option>
  <option value="TMJ Disorders">TMJ Disorders</option>
</select>


          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="visitDate" className="font-semibold text-sm text-gray-600">Visit Date:</label>
            <input
              type="date"
              id="visitDate"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full border px-3 py-2 rounded-xl"
              required
            />
          </div>
        </div>

        {/* ======= واجهة رفع الصور المحسنة ======= */}
      
        {/* ======= نهاية واجهة رفع الصور ======= */}

        <div className="space-y-4 mb-6 min-h-[200px]">
          {questions.length > 0 && (
            <>
              <h3 className="font-semibold text-lg text-blue-600">Answer the following questions:</h3>
           {questions.map((q) => (
  <div
    key={q.id}
    className="p-4 mb-4 bg-gray-50 rounded-xl shadow-sm border border-gray-200"
  >
    <p className="mb-3 font-semibold text-gray-800">{q.question_text}</p>
    <div className="flex gap-6 flex-wrap">
      {(q.options || "Yes,No").split(",").map((opt, i) => (
        <label
          key={i}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer ${
            answers[q.id] === opt
              ? "bg-blue-100 border-blue-400 text-blue-800"
              : "bg-white border-gray-300 text-gray-700"
          }`}
        >
          <input
            type="radio"
            name={`question_${q.id}`}
            value={opt}
            checked={answers[q.id] === opt}
            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            className="accent-blue-600"
            required={i === 0}
          />
          {opt}
        </label>
      ))}
    </div>
  </div>
))}

            </>
          )}
          
        </div>
        {/* ===== Chronic Questions Section ===== */}

<div className="space-y-6 mb-10">
  {chronicQuestions.length > 0 && (
    <>
      <motion.h3
        className="font-bold text-2xl text-red-600 flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaHeartbeat className="text-red-500" /> Chronic Diseases
      </motion.h3>

      {chronicQuestions.map((q, idx) => (
        <motion.div
          key={`chronic_${q.id}`}
          className="p-5 bg-red-50 rounded-2xl border border-red-200 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
        >
          <p className="mb-4 font-semibold text-gray-800 text-lg">{q.question_text}</p>
          <div className="flex gap-4 flex-wrap">
            {(q.options || "Yes,No").split(",").map((opt, i) => (
              <label
                key={i}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all duration-200 ${
                  chronicAnswers[q.id] === opt
                    ? "bg-red-100 border-red-400 text-red-800 shadow-sm"
                    : "bg-white border-gray-300 text-gray-700 hover:border-red-300 hover:bg-red-50"
                }`}
              >
                <input
                  type="radio"
                  name={`chronic_${q.id}`}
                  value={opt}
                  checked={chronicAnswers[q.id] === opt}
                  onChange={(e) =>
                    setChronicAnswers((prev) => ({
                      ...prev,
                      [q.id]: e.target.value,
                    }))
                  }
                  className="accent-red-600"
                  required={i === 0}
                />
                {opt}
              </label>
            ))}
          </div>

          {chronicAnswers[q.id] === "Yes" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                placeholder="Please provide more details..."
                className="mt-4 w-full border border-red-300 px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                onChange={(e) =>
                  setChronicAnswers((prev) => ({
                    ...prev,
                    [`note_${q.id}`]: e.target.value,
                  }))
                }
              />
            </motion.div>
          )}
        </motion.div>
      ))}
    </>
  )}
</div>


        

<DentalPlate
  teeth={teethData}
  setTeeth={setTeethData}
  clearSignal={clearSignal}
  onTeethNotesReady={(notesObj) => setTeethNotes(JSON.parse(notesObj))}
/>




        <div className="mb-6 mt-8">
          <label className="block text-blue-700 font-semibold text-lg mb-2">📝 Dental Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write any notes about the dental condition..."
            rows="4"
            className="w-full border border-blue-200 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
          />
        </div>

       <button
  type="submit"
  className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 w-full flex justify-center items-center gap-2"
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <>
      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    
    </>
  ) : (
    "Submit"
  )}
</button>

      </form>
    </div>
  );
}

export default PatientProfile;