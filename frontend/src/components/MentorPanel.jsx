import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User, Send, Globe, Award } from 'lucide-react';

const MentorPanel = ({ activeCode, activeFile }) => {
    const [messages, setMessages] = useState([
        { role: 'system', content: "Hi! I'm your AI Code Mentor. Select a file and ask me to explain it, or select a specific block of code." }
    ]);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("beginner"); // beginner | interview
    const [language, setLanguage] = useState("english"); // english | hinglish | hindi

    const askAI = async (customPrompt = null) => {
        if (!activeCode) return;

        setLoading(true);
        const userMsg = { role: 'user', content: customPrompt || "Explain this file." };
        setMessages(prev => [...prev, userMsg]);

        try {
            const response = await fetch('http://localhost:8080/api/ai/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: activeCode.substring(0, 5000), // Limit payload for demo
                    mode: mode,
                    language: language
                })
            });
            const data = await response.json();
            setMessages(prev => [...prev, { role: 'system', content: data.explanation }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'system', content: "Error: Could not reach AI service." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Controls */}
            <div style={{ padding: '15px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <select
                    className="glass-panel"
                    style={{ color: 'white', padding: '5px', outline: 'none' }}
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                >
                    <option value="beginner">Beginner Mode</option>
                    <option value="interview">Interview Mode</option>
                </select>

                <select
                    className="glass-panel"
                    style={{ color: 'white', padding: '5px', outline: 'none' }}
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="english">English</option>
                    <option value="hinglish">Hinglish</option>
                    <option value="hindi">Hindi</option>
                </select>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '90%'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            marginBottom: '5px',
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                        }}>
                            {msg.role === 'system' ? <Bot size={16} color="var(--secondary)" /> : <User size={16} color="var(--primary)" />}
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{msg.role === 'user' ? 'You' : 'Mentor'}</span>
                        </div>
                        <div className="glass-panel" style={{
                            padding: '12px',
                            borderRadius: '12px',
                            background: msg.role === 'user' ? 'rgba(108, 92, 231, 0.2)' : 'rgba(28, 28, 46, 0.7)',
                            border: msg.role === 'user' ? '1px solid var(--primary-glow)' : '1px solid var(--glass-border)'
                        }}>
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {loading && <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Thinking...</div>}
            </div>

            {/* Input Area */}
            <div style={{ padding: '15px', borderTop: '1px solid var(--border)' }}>
                <button
                    className="btn-primary"
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}
                    onClick={() => askAI()}
                    disabled={!activeFile || loading}
                >
                    <Award size={18} />
                    Explain This File
                </button>
            </div>
        </div>
    );
};

export default MentorPanel;
