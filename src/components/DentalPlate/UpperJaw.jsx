import React from "react";
import Tooth from "./Tooth";

const UpperJaw = ({ teeth = [], onToothClick }) => {
  const safeTeeth = Array.isArray(teeth) ? teeth : [];

  const centerX = 160;
  const centerY = 170;
  const radius = 100;
  const teethPerSide = 8;
  const gap = 45;

  const renderToothWithHighlight = (id, x, y, color, label, note) => (
  <Tooth
    key={id}
    id={id}
    x={x}
    y={y}
    color={color}
    label={label}
    note={note} // ✅ مهم علشان يظهر البوردر الذهبي داخل Tooth
    onToothClick={onToothClick}
    labelPosition="bottom"
  />
);


  const rightTeeth = Array.from({ length: teethPerSide }, (_, i) => {
    const angle = Math.PI + (Math.PI / 2) * (i / (teethPerSide - 1));
    const x = centerX - gap + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle) - 50;
    const id = `UR${i - 8}`;
    const tooth = safeTeeth.find((t) => t.id === id) || {};
    return renderToothWithHighlight(id, x, y, tooth.color, tooth.label, tooth.note);
  });

  const leftTeeth = Array.from({ length: teethPerSide }, (_, i) => {
    const angle = 2 * Math.PI - (Math.PI / 2) * (i / (teethPerSide - 1));
    const x = centerX + gap + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle) - 50;
    const id = `UL${i - 8}`;
    const tooth = safeTeeth.find((t) => t.id === id) || {};
    return renderToothWithHighlight(id, x, y, tooth.color, tooth.label, tooth.note);
  });

  return <g>{[...rightTeeth, ...leftTeeth]}</g>;
};

export default UpperJaw;
