// src/pages/Query.jsx
import  { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function Query(){
  const { projectId } = useParams();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]); // {role:'user'|'ai', text, sources?}
  const [loading, setLoading] = useState(false);
  const boxRef = useRef();




  useEffect(()=> {
    // optional: load previous queries from backend if available
  }, [projectId]);

  useEffect(() => {
    // auto-scroll
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    if (!question.trim()) return;
    
    const userMsg = { role: "user", text: question };
    setMessages((m)=>[...m, userMsg]);
    setQuestion("");
    setLoading(true);
    try {

      

      const res = await API.post("/query", { project_id: projectId, question });
      // backend may return { res: { ans: "...", sources: [...] } } or { answer: "...", sources: [...] }
      const ans = res.data?.res?.ans || res.data?.answer || res.data?.answer_text || res.data?.res?.answer;
      const sources = res.data?.res?.sources || res.data?.sources || [];
      const aiMsg = { role: "ai", text: ans || "No answer", sources };
      setMessages((m)=>[...m, aiMsg]);
    } catch (e) {
      const err = e.response?.data?.message || e.message || "Query failed";
      setMessages((m)=>[...m, { role: "ai", text: `Error: ${err}`, sources: [] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Project Query</h1>

      <div ref={boxRef} className="h-96 overflow-auto bg-white p-4 rounded shadow mb-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div className={`inline-block p-3 rounded ${m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
              {m.text}
            </div>
            {m.sources && m.sources.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                Sources: {m.sources.map((s, idx) => <span key={idx} className="mr-2">{s.file || s}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>

      <textarea className="input" value={question} onChange={(e)=>setQuestion(e.target.value)} placeholder="Ask a question about the repository..." />
      <div className="flex justify-end gap-2">
        <button className="btn-secondary" onClick={() => setQuestion("")}>Clear</button>
        <button className="btn" onClick={send} disabled={loading}>{loading ? "Thinking..." : "Send"}</button>
      </div>
    </div>
  );
}
