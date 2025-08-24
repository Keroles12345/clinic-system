import React from "react";

const Tooth = ({
  x,
  y,
  id,
  color = "#fff",
  label = "",
  onToothClick,
  labelPosition = "top",
}) => {
  const hasLabel = label && label.trim() !== "";
  const textColor = label ? "#1E90FF" : "#000";

  return (
    <g
      onClick={(e) => {
        e.stopPropagation();
        onToothClick?.({ id, x, y, color, label });
      }}
      style={{ cursor: "pointer" }}
    >
      {/* مستطيل السن */}
      <rect
        x={x - 15}
        y={y - 19}
        width="30"
        height="38"
        rx="6"
        fill={color}
        stroke="#333"
        strokeWidth="2"
      />

      {/* عرض الرمز و الـ ID */}
      {hasLabel ? (
        labelPosition === "top" ? (
          <>
            {/* الرمز فوق */}
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
            {/* الـ ID تحت */}
            <text
              x={x}
              y={y + 14}
              fontSize="10"
              fontWeight="normal"
              textAnchor="middle"
              fill="#000"
            >
              {id}
            </text>
          </>
        ) : (
          <>
            {/* الـ ID فوق */}
            <text
              x={x}
              y={y - 4}
              fontSize="10"
              fontWeight="normal"
              textAnchor="middle"
              fill="#000"
            >
              {id}
            </text>
            {/* الرمز تحت */}
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
        // عرض الـ ID فقط في المنتصف
        <text
          x={x}
          y={y + 4}
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
          fill="#000"
        >
          {id}
        </text>
      )}
    </g>
  );
};

export default Tooth;
