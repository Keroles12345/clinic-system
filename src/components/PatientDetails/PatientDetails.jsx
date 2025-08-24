import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  MdPerson,
  MdWork,
  MdPhone,
  MdNote,
  MdHistory,
  MdImage,
  MdClose,
} from "react-icons/md";
import { FaHeartbeat, FaUserClock } from "react-icons/fa";
import DentalPlate from "../DentalPlate/DentalPlate";
import { motion, AnimatePresence } from "framer-motion";
function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [visit, setVisit] = useState(null);
  const [teethData, setTeethData] = useState([]);
  const [history, setHistory] = useState([]);
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [xrayImages, setXrayImages] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [chronicQuestions, setChronicQuestions] = useState([]);
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
    const fetchData = async () => {
      try {
       const res1 = await axios.get(`https://sitesbykeroles.com/project1/get_patient_details.php?id=${id}`);

        if (res1.data.status === "success") {
          setPatient(res1.data.patient);
          setVisit({
            ...res1.data.visit,
            answers: res1.data.answers || [],
            chronicAnswers: res1.data.chronicAnswers || {},
          });
          setNotes(res1.data.visit?.notes || "");
        }

        const res2 = await axios.get(`https://sitesbykeroles.com/project1/get_teeth_history.php?patient_id=${id}`);
        if (res2.data.status === "success") {
          setHistory(res2.data.history);
          if (res2.data.history.length > 0) {
            const latest = res2.data.history[0];
            setTeethData(JSON.parse(latest.teeth_data));
            setNotes(latest.notes || "");
          }
        }

        const res3 = await axios.get(`https://sitesbykeroles.com/project1/get_chronic_questions.php`);
        if (res3.data.status === "success") {
          setChronicQuestions(res3.data.questions);
        }
      } catch (err) {
        console.error("❌ Error loading data", err);
      }
    };
    fetchData();
  }, [id]);

  const handleFiles = (files) => {
    const newFiles = Array.from(files);
    setXrayImages((prev) => [...prev, ...newFiles]);
  };

  const removeImage = (index) => {
    setXrayImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("form", JSON.stringify({ patientId: parseInt(id) }));
      formData.append("teethData", JSON.stringify(teethData));
      formData.append("notes", notes);
      xrayImages.forEach((file) => formData.append("xrayImages[]", file));

      const res = await axios.post("https://sitesbykeroles.com/project1/update_teeth_and_notes.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.status === "success") {
        alert("✅ تم التحديث بنجاح");
        const refresh = await axios.get(`http://sitesbykeroles.com/project1/get_teeth_history.php?patient_id=${id}`);
        setHistory(refresh.data.history);
        const latest = refresh.data.history[0];
        setTeethData(JSON.parse(latest.teeth_data));
        setNotes(latest.notes || "");
        setXrayImages([]);
      } else {
        alert("❌ فشل التحديث: " + (res.data.message || ""));
      }
    } catch (err) {
      alert("❌ Update error: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!patient) {
    return <div className="text-center py-20 text-gray-500 font-medium animate-pulse">👤 Loading patient data...</div>;
  }

  return (
    <motion.div className="min-h-screen py-10 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div className="max-w-[800px] mx-auto bg-white rounded-3xl shadow-lg p-6 md:p-10 border border-blue-100" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
<button
  onClick={() => window.history.back()}
  className="flex items-center w-2/6 gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full shadow-sm transition duration-200"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
  <span className="font-medium">Back</span>
</button>
        {/* معلومات المريض */}
        <motion.div className="flex flex-col items-center mb-8" initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center text-5xl shadow-md">
            <MdPerson className="text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-blue-900 tracking-wide">{patient.name}</h2>
          {visit?.date && (
            <div className="mt-2 flex items-center gap-2 text-blue-600 text-sm font-medium">
              <MdCalendarToday />
              <span>{new Date(visit.date).toLocaleDateString("en-EG", { timeZone: "Africa/Cairo", year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          )}
        </motion.div>

        {/* الوظيفة والموبايل */}
   

<div className="grid md:grid-cols-2 gap-4 mb-8">
  {[
    {
      icon: <MdWork className="text-blue-700 text-xl" />,
      value: patient.job || "No Job"
    },
    {
      icon: <MdPhone className="text-green-600 text-xl" />,
      value: patient.mobile
    },
    {
      icon: <FaUserClock className="text-indigo-600 text-xl" />,
      value: patient.age ? `${patient.age} Years Old` : "Age Unknown"
    }
  ].map((item, i) => (
    <div
      key={i}
      className="flex items-center gap-3 bg-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm"
    >
      {item.icon}
      <span className="text-gray-700 font-medium">{item.value}</span>
    </div>
  ))}
</div>

        

        {/* الإجابات العادية */}
        {visit?.answers?.length > 0 && (
          <motion.div className="mb-8 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
            <h3 className="text-lg font-semibold text-blue-800 mb-2 border-b pb-1 border-blue-200">Answered Questions:</h3>
            {visit.answers.map((ans, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                <p className="text-gray-800 font-medium mb-2">{ans.question_text}</p>
                <div className="inline-block bg-blue-100 text-blue-800 font-semibold px-4 py-1 rounded-full text-sm">{ans.answer}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* أسئلة الأمراض المزمنة */}
        {visit?.chronicAnswers && chronicQuestions.length > 0 && (
          <motion.div className="mb-8 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}>
            <h3 className="text-lg font-semibold text-red-600 mb-2 border-b pb-1 border-red-300 flex items-center gap-2">
              <FaHeartbeat className="text-red-500" /> Chronic Diseases:
            </h3>
{chronicQuestions.map((q, i) => {
  const answer = visit.chronicAnswers[q.id] || "No answer";
  const note = visit.chronicAnswers[`note_${q.id}`];

  return (
    <div key={q.id} className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 shadow-sm">
      <p className="text-red-800 font-semibold mb-2">{q.question_text}</p>
      <div className="inline-block bg-red-100  font-semibold px-4 py-1 rounded-full text-sm">
        {answer}
      </div>
      {answer === "Yes" && note && (
        <p className="mt-2  text-sm bg-red-200 p-2 rounded">{note}</p>
      )}
    </div>
  );
})}

          </motion.div>
        )}

        {/* الملاحظات */}
        <motion.div className="mb-4 bg-yellow-50 border border-yellow-200 p-4 rounded-xl shadow-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
          <div className="flex items-center gap-2 text-yellow-800 font-semibold mb-2">
            <MdNote className="text-xl" />
            <span>Treatment plan</span>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="اكتب ملاحظات الطبيب هنا..."
            className="w-full p-2 border border-yellow-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </motion.div>

        {/* لوحة الأسنان + رفع الصور */}
        <motion.div className="mb-4 flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}>
          <DentalPlate teeth={teethData} setTeeth={setTeethData} clearSignal={false} editable={true} />

          <div className="mt-6 w-full text-center">
            <input type="file" id="xrayUpload" multiple accept="image/*" onChange={(e) => handleFiles(e.target.files)} className="hidden" />
            <label htmlFor="xrayUpload" className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-blue-400 text-blue-700 rounded-xl cursor-pointer hover:bg-blue-50 transition font-medium shadow-sm">
              <MdImage className="text-xl" /> Upload X-ray Images
            </label>
            {xrayImages.length > 0 && (
              <>
                <div className="mt-2 text-sm text-gray-600">{xrayImages.length} image{ xrayImages.length > 1 ? "s" : "" } selected</div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {xrayImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img src={URL.createObjectURL(file)} onClick={() => setFullscreenImage(URL.createObjectURL(file))} alt={`Xray ${index + 1}`} className="w-full h-24 object-cover rounded border shadow-sm group-hover:scale-105 transition-transform cursor-pointer" />
                      <span className="absolute top-1 right-1 bg-white text-xs text-gray-800 rounded px-1 shadow">{index + 1}</span>
                      <button onClick={() => removeImage(index)} className="absolute top-1 left-1 text-xs text-white bg-red-500 rounded-full px-2 py-0.5 shadow hover:bg-red-600">
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <button onClick={handleUpdate} disabled={isUpdating} className={`${isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white px-6 py-2 rounded-xl font-semibold mt-6`}>
            {isUpdating ? "Updating..." : "Update"}
          </button>
        </motion.div>

        {/* سجل التحديثات */}
        {history.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2 border-b pb-1 border-blue-200">
              <MdHistory /> Teeth Update History:
            </h3>
            {history.map((item, i) => {
              let parsed = [];
              try {
                parsed = JSON.parse(item.teeth_data);
              } catch {}

              const imageArray = item.images && Array.isArray(item.images)
                ? item.images
                : typeof item.images === "string" && item.images.includes("[")
                ? JSON.parse(item.images)
                : [];

              return (
                <motion.div
                  key={i}
                  className="mb-6 bg-white border-l-4 border-blue-600 shadow-md p-5 rounded-2xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-blue-800 font-bold text-lg">
                      🕒 Update #{history.length - i}
                    </h4>
                    <span className="text-sm text-gray-500 font-medium">
                      {new Date(item.update_date).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "Africa/Cairo",
                      })}
                    </span>
                  </div>

                  {item.notes && (
                    <div className="mb-3 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded text-sm text-yellow-800">
                      📝 <strong>Doctor Note:</strong> {item.notes}
                    </div>
                  )}

                  {imageArray.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                      {imageArray.map((imgId, idx) => (
                        <img
                          key={idx}
                          src={`https://sitesbykeroles.com/project1/get_xray.php?id=${imgId}`}
                          onClick={() => setFullscreenImage(`https://sitesbykeroles.com/project1/get_xray.php?id=${imgId}`)}
                          alt={`X-ray ${idx + 1}`}
                          className="w-full h-24 object-cover rounded shadow-sm border hover:scale-105 transition-transform duration-200 cursor-pointer"
                        />
                      ))}
                    </div>
                  )}

                  <div className="rounded-xl border border-blue-100 p-3 bg-blue-50">
                    <DentalPlate
                      teeth={parsed}
                      setTeeth={() => {}}
                      clearSignal={false}
                      editable={false}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Fullscreen Image */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setFullscreenImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={fullscreenImage}
              alt="Fullscreen"
              className="max-w-full max-h-full rounded shadow-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 text-white text-3xl font-bold bg-red-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-red-700"
            >
              <MdClose />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default PatientDetails;
