import React from "react";
import Tooth from "./Tooth";

const LowerJaw = ({ teeth = [], onToothClick }) => {
  const safeTeeth = Array.isArray(teeth) ? teeth : [];

  const centerX = 160;
  const centerY = 160;
  const radius = 100;
  const teethPerSide = 8;
  const gap = -45;

  const renderTooth = (id, x, y, labelPosition) => {
    const tooth = safeTeeth.find((t) => t.id === id) || {};
    return (
      <Tooth
        key={id}
        id={id}
        x={x}
        y={y}
        color={tooth.color}
        label={tooth.label}
        note={tooth.note} // ✅ أضف هذا السطر ليمرر الملاحظة إلى مكون Tooth
        onToothClick={onToothClick}
        labelPosition={labelPosition}
      />
    );
  };

  const rightTeeth = Array.from({ length: teethPerSide }, (_, i) => {
    const angle = (Math.PI / 2) * (i / (teethPerSide - 1));
    const x = centerX - gap + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle) + 40;
    const id = `LR${i - 8}`;
    return renderTooth(id, x, y, "top");
  });

  const leftTeeth = Array.from({ length: teethPerSide }, (_, i) => {
    const angle = Math.PI - (Math.PI / 2) * (i / (teethPerSide - 1));
    const x = centerX + gap + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle) + 40;
    const id = `LL${i - 8}`;
    return renderTooth(id, x, y, "top");
  });

  return <g>{[...rightTeeth, ...leftTeeth]}</g>;
};

export default LowerJaw;
