import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChatRuntime from "./RuntimeComponents/ChatRuntime";

export default function App() {
  const projectId = import.meta.env.VITE_projectID;
  const uiid = import.meta.env.VITE_UIID;

  return (
    <div className="h-screen">
      <Router>
        <Routes>
          {/* Default route → redirect to /path/:projectId/:uiid using env values */}
          <Route
            path="*"
            element={<Navigate to={`/${projectId}/${uiid}`} replace />}/>
          <Route path="/:projectId/:uiid" element={<ChatRuntime />} />
        </Routes>
      </Router>
    </div>
  );
}
