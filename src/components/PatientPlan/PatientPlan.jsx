import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MdPerson, MdCalendarToday } from "react-icons/md";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const LABELS = {
  color: {
    red: "Root Canal",
    blue: "Composite",
    green: "Crown",
    black: "Extraction",
  },
  symbol: {
    C: "Has Crown",
    E: "Endodontic Treated",
    R: "Composite Restoration",
    F: "Filling",
    X: "Extracted",
  },
};

const SEVERITY = {
  "Extracted": 5,
  "Root Canal": 4,
  "Crown": 3,
  "Composite": 2,
  "Filling": 1,
  "Has Crown": 3,
  "Endodontic Treated": 4,
  "Composite Restoration": 2,
};

const COLORS = {
  "Root Canal": "#e74c3c",
  "Composite": "#3498db",
  "Crown": "#f1c40f",
  "Extraction": "#2c3e50",
  "Filling": "#9b59b6",
  "Has Crown": "#bdc3c7",
  "Endodontic Treated": "#1abc9c",
  "Composite Restoration": "#9b59b6",
};

const RADIAN = Math.PI / 180;

export default function PatientPlan() {
  const { id } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    axios
      .get(`https://sitesbykeroles.com/project1/get_patient_plan.php?patient_id=${id}&t=${Date.now()}`)
      .then(({ data }) => {
        if (data.status === "success") {
          setData({ patient: data.patient, visit: data.last_visit });
        } else {
          console.warn("❌ API error:", data.message);
        }
      })
      .catch((err) => {
        console.error("❌ Axios error:", err);
      });
  }, [id]);
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
  const { patient, visit } = data;
  const teeth = (visit?.teeth_data || []).filter(
    (t) =>
      (t.color && t.color.toLowerCase() !== "white") ||
      (t.label && t.label.trim() !== "") ||
      (t.notes && t.notes.trim() !== "")
  );

  const pieCount = {};
  teeth.forEach((t) => {
    const label = LABELS.symbol[t.label] || LABELS.color[t.color];
    if (label) pieCount[label] = (pieCount[label] || 0) + 1;
  });

  const pieData = Object.entries(pieCount).map(([name, value]) => ({
    name,
    value,
    severity: SEVERITY[name] || 0,
  }));

  const total = pieData.reduce((sum, p) => sum + p.value, 0);
  const dominant = pieData.sort((a, b) => b.value * b.severity - a.value * a.severity)[0];

  const severityText =
    dominant?.severity >= 5
      ? "🟥 Severe"
      : dominant?.severity >= 4
      ? "🟧 Moderate"
      : dominant?.severity >= 2
      ? "🟨 Noticeable"
      : "🟩 Mild";

  const angles = [];
  let currentAngle = 0;
  pieData.forEach((entry) => {
    const angle = (entry.value / total) * 360;
    angles.push({ startAngle: currentAngle, endAngle: currentAngle + angle });
    currentAngle += angle;
  });

  const renderCurvedLabel = ({ index }) => {
    const entry = pieData[index];
    const label = `${entry.name} (${((entry.value / total) * 100).toFixed(0)}%)`;
    return (
      <text fontSize="10" fontWeight="bold" fill="#fff">
        <textPath href={`#arc${index}`} startOffset="50%" textAnchor="middle">
          {label}
        </textPath>
      </text>
    );
  };

  if (!patient || !visit)
    return <div className="text-center py-20 text-gray-500 animate-pulse">👤 Loading patient data...</div>;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      
      <div className="max-w-[900px] mx-auto bg-white rounded-3xl shadow-lg p-8 border border-blue-100">
        <button
  onClick={() => window.history.back()}
  className="flex items-center w-2/6 gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full shadow-sm transition duration-200"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
  <span className="font-medium">Back</span>
</button>


        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-300 to-blue-600 flex items-center justify-center text-white text-5xl shadow-lg">
            <MdPerson />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-blue-900 flex items-center gap-4">
            {patient.name}
          
          </h2>
          <div className="mt-2 flex items-center gap-2 text-blue-600 text-sm font-medium">
            <MdCalendarToday />
            {new Date(visit.visit_date).toLocaleDateString("en-GB", {
              timeZone: "Africa/Cairo",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {visit.notes && (
          <div className="mb-6 p-4 bg-gray-50 border rounded-xl shadow-sm">
            <h4 className="text-blue-900 font-semibold mb-2">📌 Treatment plan:</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{visit.notes}</p>
          </div>
        )}


        {teeth.length > 0 && (
          <div className="mt-6">
            <h3 className="text-blue-800 font-semibold mb-3">🦷 Teeth Status in Last Visit:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teeth.map((t, i) => {
                const hasColor = t.color?.toLowerCase() !== "white";
                const hasSymbol = t.label?.trim();
                const bg = hasColor ? t.color : "#fff";
                const text =
                  hasSymbol && !hasColor
                    ? "#1E90FF"
                    : hasColor && hasSymbol
                    ? "#1E90FF"
                    : "#fff";
                const colorLabel = hasColor ? LABELS.color[t.color] || t.color : null;
                const symbolLabel = hasSymbol ? LABELS.symbol[t.label] || t.label : null;

                return (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow flex items-start gap-3"
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center font-bold rounded-full shadow-sm text-sm"
                      style={{ backgroundColor: bg, color: text }}
                    >
                      {hasSymbol ? t.label : t.id}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">Tooth: {t.id}</div>
                      {colorLabel && (
                        <div className="text-xs text-gray-600">Color: {colorLabel}</div>
                      )}
                      {symbolLabel && (
                        <div className="text-xs text-gray-600">Symbol: {symbolLabel}</div>
                      )}
                      {t.notes && (
                        <div className="text-xs text-gray-500 mt-1">
                          📝 Note: <em>{t.notes}</em>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {pieData.length > 0 && (
          <div className="mt-12">
            <h3 className="text-blue-800 text-xl font-semibold mb-4 border-b pb-2">
              📊 Patient Condition Summary
            </h3>
            <div className="flex justify-center items-center">
              <ResponsiveContainer width={320} height={320}>
                <PieChart>
                  <defs>
                    {angles.map((a, i) => {
                      const r = 110,
                        cx = 160,
                        cy = 160;
                      const x1 = cx + r * Math.cos(-a.startAngle * RADIAN);
                      const y1 = cy + r * Math.sin(-a.startAngle * RADIAN);
                      const x2 = cx + r * Math.cos(-a.endAngle * RADIAN);
                      const y2 = cy + r * Math.sin(-a.endAngle * RADIAN);
                      const largeArc = a.endAngle - a.startAngle > 180 ? 1 : 0;
                      return (
                        <path
                          key={i}
                          id={`arc${i}`}
                          d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2}`}
                          fill="none"
                        />
                      );
                    })}
                  </defs>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    label={renderCurvedLabel}
                    labelLine={false}
                  >
                    {pieData.map((e, i) => (
                      <Cell key={i} fill={COLORS[e.name] || "#ccc"} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 bg-blue-50 rounded-xl p-4 text-sm text-gray-700 shadow-sm border border-blue-200">
              <p className="font-semibold text-blue-900 mb-2">🧠 System Evaluation:</p>
              <ul className="list-disc list-inside space-y-1">
                {pieData.map((p) => (
                  <li key={p.name}>
                    {p.name}: <strong>{p.value} teeth</strong>
                  </li>
                ))}
                <li>
                  Dominant Condition: <strong>{dominant.name}</strong>
                </li>
                <li>
                  Total Affected Teeth: <strong>{teeth.length}</strong>
                </li>
                <li>
                  General Severity: <strong>{severityText}</strong>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
