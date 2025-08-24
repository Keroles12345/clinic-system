import React, { useEffect, useState } from "react";
import axios from "axios";

function ChronicDiseases({ patientId, visitId, onChange }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
 axios.get("https://sitesbykeroles.com/project1/get_chronic_questions.php")
      .then((res) => {
        setQuestions(res.data.questions || []);
      });
  }, []);

  const handleAnswerChange = (qid, value) => {
    const updated = { ...answers, [qid]: { answer: value, note: "" } };
    if (value !== "Yes") delete updated[qid].note;
    setAnswers(updated);
    onChange(updated); // لتمرير الإجابات للصفحة الرئيسية إذا لزم
  };

  const handleNoteChange = (qid, note) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: { ...prev[qid], note }
    }));
    onChange({ ...answers, [qid]: { ...answers[qid], note } });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Chronic Diseases</h2>
      {questions.map((q) => (
        <div key={q.id} className="mb-4">
          <p className="font-medium text-gray-800">{q.question_text}</p>
          <div className="flex gap-4 mt-2">
            {q.options.split(",").map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`q_${q.id}`}
                  value={opt}
                  checked={answers[q.id]?.answer === opt}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
                {opt}
              </label>
            ))}
          </div>

          {answers[q.id]?.answer === "Yes" && (
            <input
              type="text"
              placeholder="Details..."
              value={answers[q.id].note || ""}
              onChange={(e) => handleNoteChange(q.id, e.target.value)}
              className="mt-2 w-full px-3 py-2 border rounded"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default ChronicDiseases;
