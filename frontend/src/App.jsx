import { useState } from 'react';
import './index.css';

// Components (We will create these next)
import FileUpload from './components/FileUpload';
import FileTree from './components/FileTree';
import CodeViewer from './components/CodeViewer';
import MentorPanel from './components/MentorPanel';
import Footer from './components/Footer';

function App() {
  const [projectTree, setProjectTree] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [activeCode, setActiveCode] = useState("");
  const [activePath, setActivePath] = useState("");

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
    <div className="fullscreen">
      {/* Header */}
      <header className="glass-panel" style={{ height: '60px', margin: '10px', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: '800', background: 'linear-gradient(to right, #6c5ce7, #00cec9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CodeMentor AI
        </h1>
        {projectTree && <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{projectTree.name}</span>}
      </header>

      {/* Main Workspace */}
      <div style={{ display: 'flex', flex: 1, gap: '10px', padding: '0 10px 10px 10px', overflow: 'hidden' }}>

        {/* Left: Project Explorer */}
        <div className="glass-panel" style={{ width: '250px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          {!projectTree ? (
            <FileUpload onUploadSuccess={handleProjectLoaded} />
          ) : (
            <>
              <div style={{ padding: '10px 15px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontWeight: '500' }}>{activeFile || "Select a file"}</span>
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <CodeViewer code={activeCode} language={activeFile ? activeFile.split('.').pop() : 'text'} />
              </div>
            </>
          )}
        </div>

        {/* Right: AI Mentor */}
        <div className="glass-panel" style={{ width: '350px', display: 'flex', flexDirection: 'column' }}>
          <MentorPanel activeCode={activeCode} activeFile={activeFile} />
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default App;
