import React, { useState, useEffect, useRef } from "react";
import UpperJaw from "./UpperJaw";
import LowerJaw from "./LowerJaw";
import { FaRegNoteSticky } from "react-icons/fa6";

const colors = ["red", "green", "blue", "black"];
const labels = ["C", "R", "F", "E", "X"];

const DentalPlate = ({ teeth = [], setTeeth, clearSignal, onTeethNotesReady }) => {
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [lastClicked, setLastClicked] = useState({ id: null, time: 0 });
  const [showNoteArea, setShowNoteArea] = useState(false);
  const [xrayImages, setXrayImages] = useState([]);
  const previousNotesRef = useRef("");

  useEffect(() => {
    if (onTeethNotesReady) {
      const notesObj = teeth.reduce((acc, t) => {
        if (t.note?.trim()) acc[t.id] = t.note;
        return acc;
      }, {});
      const currentNotes = JSON.stringify(notesObj);
      if (currentNotes !== previousNotesRef.current) {
        previousNotesRef.current = currentNotes;
        onTeethNotesReady(currentNotes);
      }
    }
  }, [teeth, onTeethNotesReady]);

  useEffect(() => {
    if (clearSignal) {
      setTeeth([]);
      setSelectedTooth(null);
      setShowNoteArea(false);
    }
  }, [clearSignal]);

  const handleToothClick = ({ id, x, y }) => {
    const now = Date.now();

    if (lastClicked.id === id && now - lastClicked.time < 500) {
      setTeeth((prev) => prev.filter((t) => t.id !== id));
      setSelectedTooth(null);
      setShowNoteArea(false);
    } else {
      const existing = teeth.find((t) => t.id === id);
      const toothData = existing || { id, color: "", label: "", note: "", x, y };
      if (!existing) {
        setTeeth((prev) => [...prev, toothData]);
      }
      setSelectedTooth(toothData);
      setShowNoteArea(!!toothData.note?.trim());
    }

    setLastClicked({ id, time: now });
  };

  const updateTooth = (id, color, label, note) => {
    setTeeth((prevTeeth) => {
      const updated = prevTeeth.some((t) => t.id === id)
        ? prevTeeth.map((t) => (t.id === id ? { id, color, label, note } : t))
        : [...prevTeeth, { id, color, label, note }];
      return updated;
    });

    if (selectedTooth && selectedTooth.id === id) {
      setSelectedTooth({ id, color, label, note });
    }
  };

  const handleNoteChange = (e) => {
    setSelectedTooth((prev) => ({
      ...prev,
      note: e.target.value,
    }));
  };

  const submitNoteAndClose = () => {
    if (!selectedTooth) return;
    updateTooth(
      selectedTooth.id,
      selectedTooth.color,
      selectedTooth.label,
      selectedTooth.note
    );
    setShowNoteArea(false);
    setSelectedTooth(null);
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files);
    setXrayImages((prev) => [...prev, ...newFiles]);
  };
  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <svg width="320" height="340" style={{ userSelect: "none" }}>
        <UpperJaw teeth={teeth} onToothClick={handleToothClick} />
        <LowerJaw teeth={teeth} onToothClick={handleToothClick} />

        {/* رموز 📌 تظهر فوق الأسنان التي بها ملاحظات */}
        {teeth.map((t, idx) => (
          t.note?.trim() && (
            <text
              key={`note-${t.id}`}
              x={t.x || 0}
              y={t.y || 0}
              fontSize="10"
              fill="#e74c3c"
            >
              📌
            </text>
          )
        ))}

        {selectedTooth && (
          <g transform="translate(160, 180)">
          <foreignObject x="-110" y="-110" width="230" height="240">
  <div
    xmlns="http://www.w3.org/1999/xhtml"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      padding: "10px",
      background: "#fff",
      border: "2px solid #ccc",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    }}
  >
    {/* العنوان و زر الإغلاق */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <strong style={{ fontSize: "14px", color: "#333" }}>
        Tooth ID: {selectedTooth.id}
      </strong>

      <button
        onClick={() => {
          setSelectedTooth(null);
          setShowNoteArea(false);
        }}
        style={{
          background: "transparent",
          border: "none",
          fontSize: "20px",
          color: "#ff4d4f",
          cursor: "pointer",
          marginLeft: "auto",
        }}
        title="Close"
      >
        ❌
      </button>
    </div>

    {/* ألوان + زر المسح + أيقونة الملاحظات */}
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      {colors.map((c) => (
        <div
          key={c}
          title={`Set color: ${c}`}
          onClick={() =>
            updateTooth(selectedTooth.id, c, selectedTooth.label, selectedTooth.note)
          }
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: c,
            border:
              selectedTooth.color === c ? "2px solid #000" : "1px solid #ccc",
            cursor: "pointer",
          }}
        ></div>
      ))}

      {/* زر المسح */}
      <button
      type="button"
        onClick={() => updateTooth(selectedTooth.id, "", "", selectedTooth.note)}
        style={{

          background: "#ff4d4f",
          color: "white",
          border: "none",
          padding: "3px 6px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "15px",
        }}
        title="delete"
      >
        🗑
      </button>

      {/* أيقونة الملاحظات */}
      <div
        title="Add Note"
        onClick={() => setShowNoteArea((prev) => !prev)}
        style={{
          marginLeft: "8px",
          cursor: "pointer",
          fontSize: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: showNoteArea ? "#1E90FF" : "#555",
        }}
      >
        <FaRegNoteSticky />
      </div>
    </div>

    {/* الرموز */}
    <div style={{ display: "flex", gap: "12px" }}>
      {labels.map((l) => (
        <div
          key={l}
          title={`Label: ${l}`}
          onClick={() =>
            updateTooth(selectedTooth.id, selectedTooth.color, l, selectedTooth.note)
          }
          style={{
            width: 26,
            height: 28,
            borderRadius: "50%",
            background:
              selectedTooth.label === l ? "#d8b0ff" : "#f5f5f5",
            border: "1px solid #aaa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight:
              selectedTooth.label === l ? "bold" : "normal",
            fontSize: "14px",
            cursor: "pointer",
            color:
              selectedTooth.label === l ? "#4b0082" : "#000",
          }}
        >
          {l}
        </div>
      ))}
    </div>
  </div>
</foreignObject>


          </g>
        )}
      </svg>
    </div>
  );
};

export default DentalPlate;
