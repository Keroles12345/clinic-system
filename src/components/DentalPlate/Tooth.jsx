import React, { useRef } from "react";

const Tooth = ({
  x,
  y,
  id,
  color = "#fff",
  label = "",
  note = "", // ✅ دعم الملاحظات
  onToothClick,
  labelPosition = "top",
}) => {
  const toothNumber = id.replace(/[^\d]/g, "");
  const hasLabel = label && label.trim() !== "";
  const hasNote = note && note.trim() !== "";
  const textColor = hasLabel ? "#1E90FF" : "#000";

  const clickTimeout = useRef(null);

  const handleSingleClick = (e) => {
    e.stopPropagation();
    clickTimeout.current = setTimeout(() => {
      onToothClick?.({ id, x, y, color, label }); // ضغطة واحدة: فتح لوحة الرموز/الألوان
    }, 200); // تأخير بسيط للتمييز عن الضغط المزدوج
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    clearTimeout(clickTimeout.current); // إلغاء الضغطة الواحدة
    if ((color && color !== "#fff") || hasLabel) {
      onToothClick?.({ id, x, y, color: "", label: "" }); // مسح كل المحتوى
    }
  };

  return (
    <g
      onClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
      style={{ cursor: "pointer" }}
    >
      {/* ✅ مستطيل السن مع إبراز ذهبي إن وُجدت ملاحظة */}
      <rect
        x={x - 15}
        y={y - 19}
        width="30"
        height="38"
        rx="6"
        fill={color || "#fff"}
        stroke={hasNote ? "gold" : "#333"}
        strokeWidth={hasNote ? 4 : 2}
      />

      {/* ✅ عرض الرمز و رقم السن حسب الاتجاه */}
      {hasLabel ? (
        labelPosition === "top" ? (
          <>
            <text
              x={x}
              y={y - 4}
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              fill={textColor}
            >
              {label}
            </text>
            <text
              x={x}
              y={y + 14}
              fontSize="10"
              fontWeight="normal"
              textAnchor="middle"
              fill="#000"
            >
              {toothNumber}
            </text>
          </>
        ) : (
          <>
            <text
              x={x}
              y={y - 4}
              fontSize="10"
              fontWeight="normal"
              textAnchor="middle"
              fill="#000"
            >
              {toothNumber}
            </text>
            <text
              x={x}
              y={y + 14}
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              fill={textColor}
            >
              {label}
            </text>
          </>
        )
      ) : (
        <text
          x={x}
          y={y + 4}
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
          fill="#000"
        >
          {toothNumber}
        </text>
      )}
    </g>
  );
};

export default Tooth;
