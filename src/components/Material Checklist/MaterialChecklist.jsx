import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  Trash2,
  Plus,
  Save,
  Filter,
} from 'lucide-react';
import { FaToolbox } from "react-icons/fa";
const ToolStatus = () => {
  const [tools, setTools] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [onlyPresent, setOnlyPresent] = useState(false);
  const [newTool, setNewTool] = useState('');
const API_BASE = 'https://sitesbykeroles.com/project1';


  // Load tools from backend
  useEffect(() => {
    fetch(`${API_BASE}/tools.php?month=${selectedMonth}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setTools(data.data.map(tool => ({
            ...tool,
            is_present: tool.is_present === 1 || tool.is_present === true,
            new: false
          })));
        }
      })
      .catch((err) => console.error('Fetch error:', err));
  }, [selectedMonth]);

  // Toggle checkbox
  const toggleTool = (id) => {
    setTools((prev) =>
      prev.map((tool) =>
        tool.id === id ? { ...tool, is_present: !tool.is_present } : tool
      )
    );
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

  // Add new tool locally
  const addTool = () => {
    if (newTool.trim()) {
      const newId = `new-${Date.now()}`;
      setTools([
        ...tools,
        {
          id: newId,
          name: newTool,
          is_present: false,
          new: true
        },
      ]);
      setNewTool('');
    }
  };
// Delete all selected (checked) tools
const deselectSelectedTools = () => {
  const updated = tools.map((tool) =>
    tool.is_present ? { ...tool, is_present: false } : tool
  );
  setTools(updated);
};



  // Delete tool locally
  const deleteTool = (id) => {
    setTools((prev) => prev.filter((tool) => tool.id !== id));
  };

  // Save to backend
 const saveStatus = () => {
  const existingTools = tools.filter((t) => !t.new);
  const newTools = tools.filter((t) => t.new);

  fetch(`${API_BASE}/save_tools.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      month: selectedMonth,
      tools: existingTools.map(({ id, is_present }) => ({
        id,
        is_present: is_present ? 1 : 0,
      })),
      new_tools: newTools.map(({ name, is_present }) => ({
        name,
        is_present: is_present ? 1 : 0,
      })),
    }),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        throw new Error(data.message || "Unknown error");
      }

      alert(data.message || "Saved successfully ✅");

      // بدل ما تعمل تفريغ وإعادة تحميل، حدث قائمة الأدوات إذا لزم الأمر أو سيبها
      // setTools([]); ← احذفها
      // setTimeout(() => setSelectedMonth((prev) => prev), 100); ← احذفها

    })
    .catch((err) => {
      console.error("❌ Error:", err);
      alert("Error saving data ❌\n" + err.message);
    });
};


  const filteredTools = onlyPresent
    ? tools.filter((t) => t.is_present)
    : tools;
   

 return (

 
  <div className="max-w-5xl mx-auto p-8 space-y-8 bg-white shadow-2xl rounded-3xl mt-10 border border-gray-200">
    {/* Header */}
    
   <button
  onClick={() => window.history.back()}
  className="flex items-center w-2/6 gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full shadow-sm transition duration-200"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
  <span className="font-medium">Back</span>
</button>


    <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center flex items-center justify-center gap-3">
      <FaToolbox size={32} className="text-blue-600" />
      <span className="tracking-wide">Material Checklist</span>
    </h1>

    {/* Controls */}
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
      {/* Month Picker */}
      <div className="flex items-center gap-3">
        <label className="text-gray-700 font-medium text-base">Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* Add Tool */}
      <div className="flex items-center gap-3 w-full lg:w-auto">
        <input
          type="text"
          value={newTool}
          onChange={(e) => setNewTool(e.target.value)}
          placeholder="Enter tool name..."
          className="border border-gray-300 px-4 py-2 rounded-xl w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={addTool}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 transition"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Save & Clear */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={saveStatus}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md flex items-center gap-2 transition"
        >
          <Save size={18} /> Save
        </button>
        <button
          onClick={deselectSelectedTools}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-xl shadow-md flex items-center gap-2 transition"
        >
          <Trash2 size={18} /> Deselect
        </button>
      </div>
    </div>

    {/* Filter Checkbox */}
    <div className="flex items-center gap-2 mt-1">
      <input
        type="checkbox"
        id="onlyPresent"
        checked={onlyPresent}
        onChange={() => setOnlyPresent(!onlyPresent)}
        className="w-5 h-5 accent-blue-600"
      />
      <label
        htmlFor="onlyPresent"
        className="text-gray-700 text-sm flex items-center gap-2 cursor-pointer select-none"
      >
        <Filter size={16} /> Show only available tools
      </label>
    </div>

    {/* Tools Table */}
    <div className="overflow-x-auto bg-gray-50 border border-gray-200 rounded-xl">
      {filteredTools.length > 0 ? (
        <table className="w-full table-auto text-sm">
          <thead className="bg-blue-100 text-blue-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Tool Name</th>
              <th className="px-5 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTools.map((tool) => (
              <tr
                key={tool.id}
                className="border-t hover:bg-blue-50 transition"
              >
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggleTool(tool.id)}
                    className="text-blue-600 hover:scale-105 transition"
                  >
                    {tool.is_present ? <CheckSquare /> : <Square />}
                  </button>
                </td>
                <td className="px-5 py-3 text-gray-800 font-medium">
                  {tool.name}
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => deleteTool(tool.id)}
                    className="text-red-500 hover:text-red-700 hover:scale-105 transition"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500 py-8">
          No tools found for this month.
        </p>
      )}
    </div>

  
  </div>
);

};

export default ToolStatus;
