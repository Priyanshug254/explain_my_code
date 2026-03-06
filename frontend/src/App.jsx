import { useState } from 'react';
import './index.css';

// Components (We will create these next)
import FileUpload from './components/FileUpload';
import FileTree from './components/FileTree';
import CodeViewer from './components/CodeViewer';
import MentorPanel from './components/MentorPanel';
import ProjectPulse from './components/ProjectPulse';
import Footer from './components/Footer';
import { Activity } from 'lucide-react';

function App() {
  const [projectTree, setProjectTree] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [activeCode, setActiveCode] = useState("");
  const [activePath, setActivePath] = useState("");
  const [aiAction, setAiAction] = useState(null);
  const [isZenMode, setIsZenMode] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  const toggleZenMode = () => setIsZenMode(!isZenMode);

  const handleAiAction = (actionType) => {
    setAiAction({ type: actionType, timestamp: Date.now() });
  };

  const handleProjectLoaded = (tree) => {
    setProjectTree(tree);
  };

  const handleFileSelect = async (path) => {
    setActivePath(path);
    // Fetch file content from backend
    try {
      const response = await fetch(`http://localhost:8081/api/project/file?path=${encodeURIComponent(path)}`);
      const data = await response.json();
      if (data.content) {
        setActiveCode(data.content);
        setActiveFile(path.split(/[\\/]/).pop()); // Get filename
      }
    } catch (err) {
      console.error("Failed to load file", err);
    }
  };

  return (
    <div className={`fullscreen ${isZenMode ? 'zen-mode' : ''}`}>
      {/* Header */}
      <header className="glass-panel" style={{ height: '60px', margin: '10px', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' }}>
        <h1 className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>
          CodeMentor AI
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {projectTree && (
            <button
              onClick={() => setShowPulse(true)}
              className="badge badge-warning"
              style={{ cursor: 'pointer', border: '1px solid currentColor', display: 'flex', gap: '5px' }}
            >
              <Activity size={14} /> Project Pulse
            </button>
          )}
          <button
            onClick={toggleZenMode}
            className={`badge ${isZenMode ? 'badge-success' : 'badge-info'}`}
            style={{ cursor: 'pointer', border: '1px solid currentColor' }}
          >
            {isZenMode ? 'Exit Zen Mode' : 'Zen Mode'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div style={{ display: 'flex', flex: 1, gap: '10px', padding: '0 10px 10px 10px', overflow: 'hidden' }}>

        {/* Left: Project Explorer */}
        <div className="glass-panel explorer-panel" style={{ width: '250px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '15px', borderBottom: '1px solid var(--border)', fontWeight: '600' }}>Explorer</div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {!projectTree ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>No project loaded</div>
            ) : (
              <FileTree node={projectTree} onSelect={handleFileSelect} />
            )}
          </div>
        </div>

        {/* Center: Code Viewer */}
        <div className="glass-panel code-workspace" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          {!projectTree ? (
            <FileUpload onUploadSuccess={handleProjectLoaded} />
          ) : (
            <>
              <div style={{ padding: '10px 15px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontWeight: '500' }}>{activeFile || "Select a file"}</span>
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <CodeViewer
                  code={activeCode}
                  language={activeFile ? activeFile.split('.').pop() : 'text'}
                  onAction={handleAiAction}
                />
              </div>
            </>
          )}
        </div>

        {/* Right: AI Mentor */}
        <div className="glass-panel mentor-sidebar" style={{ width: '350px', display: 'flex', flexDirection: 'column' }}>
          <MentorPanel activeCode={activeCode} activeFile={activeFile} externalAction={aiAction} />
        </div>

      </div>
      <Footer />
      {showPulse && <ProjectPulse onClose={() => setShowPulse(false)} />}
    </div>
  );
}

export default App;
