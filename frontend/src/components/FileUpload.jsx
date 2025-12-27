import { useState } from 'react';
import { Upload, FolderUp, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const FileUpload = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('upload'); // 'upload' | 'git'
    const [gitUrl, setGitUrl] = useState('');

    const handleDragOver = (e) => {
        e.preventDefault();
        if (mode === 'upload') setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (mode === 'upload' && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleUpload(e.target.files[0]);
        }
    };

    const handleUpload = async (file) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8080/api/project/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const tree = await response.json();
                onUploadSuccess(tree);
            } else {
                alert("Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Backend connection failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGitClone = async () => {
        if (!gitUrl) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/project/clone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: gitUrl })
            });
            if (response.ok) {
                const tree = await response.json();
                onUploadSuccess(tree);
            } else {
                alert("Clone failed");
            }
        } catch (error) {
            console.error(error);
            alert("Backend error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex-center"
            style={{ height: '100%', width: '100%', flexDirection: 'column' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                    className="btn-primary"
                    style={{
                        background: mode === 'upload' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--primary)',
                        boxShadow: 'none'
                    }}
                    onClick={() => setMode('upload')}
                >
                    <FolderUp size={16} style={{ marginRight: '8px' }} /> Upload Zip
                </button>
                <button
                    className="btn-primary"
                    style={{
                        background: mode === 'git' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--primary)',
                        boxShadow: 'none'
                    }}
                    onClick={() => setMode('git')}
                >
                    <Github size={16} style={{ marginRight: '8px' }} /> GitHub Repo
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-panel ${isDragging ? 'drag-active' : ''}`}
                style={{
                    padding: '50px',
                    textAlign: 'center',
                    border: isDragging ? '2px dashed var(--primary)' : '1px solid var(--glass-border)',
                    width: '80%',
                    maxWidth: '500px'
                }}
            >
                {loading ? (
                    <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {mode === 'git' ? 'Cloning Repository...' : 'Analyzing Project...'}
                    </div>
                ) : mode === 'upload' ? (
                    <>
                        <div className="flex-center" style={{ marginBottom: '20px' }}>
                            <FolderUp size={64} color={isDragging ? 'var(--primary)' : 'var(--text-muted)'} />
                        </div>

                        <h2 style={{ marginBottom: '10px' }}>Upload Project</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                            Drag & Drop a zip file here
                        </p>

                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                style={{
                                    position: 'absolute', opacity: 0, top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer'
                                }}
                            />
                            <button className="btn-primary">
                                Select ZIP File
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex-center" style={{ marginBottom: '20px' }}>
                            <Github size={64} color={'var(--text-muted)'} />
                        </div>
                        <h2 style={{ marginBottom: '10px' }}>Clone from GitHub</h2>
                        <input
                            type="text"
                            placeholder="https://github.com/username/repo"
                            value={gitUrl}
                            onChange={(e) => setGitUrl(e.target.value)}
                            style={{
                                padding: '12px',
                                width: '90%',
                                borderRadius: '6px',
                                border: '1px solid var(--border)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'white',
                                marginBottom: '20px',
                                outline: 'none',
                            }}
                        />
                        <br />
                        <button className="btn-primary" onClick={handleGitClone}>
                            Clone Repository
                        </button>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default FileUpload;
