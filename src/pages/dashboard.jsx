// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard(){
  const [name, setName] = useState("");
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const createProject = async () => {
  
    if (!name.trim() || !repo.trim()) {
      alert("Name and repo required");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/project", {
        name: name.trim(),
        repourl: repo.trim(),
      });

      const projectId = res.data.project?._id;
      navigate(`/query/${projectId}`);

    } catch (e) {
      alert(e.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6">

      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>

      
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-medium mb-3">New Project</h2>

<input
  id="projectName"
  name="projectName"
  className="input"
  placeholder="Project Name"
  autoComplete="off"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

<input
  id="repoUrl"
  name="repoUrl"
  className="input"
  placeholder="Repository URL"
  autoComplete="off"
  value={repo}
  onChange={(e) => setRepo(e.target.value)}
/>

        <div className="flex gap-3 justify-end">
          <button
            className="btn"
            onClick={createProject}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create project"}
          </button>
        </div>
      </div>

    </div>
  );

}
