import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User, Send, Globe, Award, CheckCircle, XCircle, BrainCircuit, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MentorPanel = ({ activeCode, activeFile }) => {
    const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'quiz'

    // Chat State
    const [messages, setMessages] = useState([
        { role: 'system', content: "Hi! I'm your AI Code Mentor. Select a file and ask me to explain it, or switch to the Quiz tab to test your knowledge!" }
    ]);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("beginner");
    const [language, setLanguage] = useState("english");

    // Quiz State
    const [quizQuestions, setQuizQuestions] = useState(null);
    const [quizLoading, setQuizLoading] = useState(false);
    const [userAnswers, setUserAnswers] = useState({}); // { questionIndex: optionIndex }
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    // --- Chat Logic ---
    const askAI = async (customPrompt = null) => {
        if (!activeCode) return;

        setLoading(true);
        const userMsg = { role: 'user', content: customPrompt || "Explain this file." };
        setMessages(prev => [...prev, userMsg]);

        try {
            const response = await fetch('http://localhost:8081/api/ai/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: activeCode.substring(0, 5000),
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

    const clearChat = () => {
        setMessages([
            { role: 'system', content: "Chat cleared. Ready for your next question!" }
        ]);
    };

    // --- Quiz Logic ---
    const generateQuiz = async () => {
        if (!activeCode) return;
        setQuizLoading(true);
        setQuizQuestions(null);
        setQuizSubmitted(false);
        setUserAnswers({});

        try {
            const response = await fetch('http://localhost:8081/api/ai/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: activeCode.substring(0, 5000) })
            });
            if (response.ok) {
                const data = await response.json();
                setQuizQuestions(data); // Expecting array
            } else {
                console.error("Quiz failed");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setQuizLoading(false);
        }
    };

    const handleAnswerSelect = (qIndex, optionIndex) => {
        if (quizSubmitted) return;
        setUserAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
    };

    const submitQuiz = () => {
        let correctCount = 0;
        quizQuestions.forEach((q, idx) => {
            if (userAnswers[idx] === q.correctAnswer) correctCount++;
        });
        setScore(correctCount);
        setQuizSubmitted(true);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                <button
                    onClick={() => setActiveTab('chat')}
                    style={{
                        flex: 1,
                        padding: '15px',
                        background: activeTab === 'chat' ? 'rgba(108, 92, 231, 0.1)' : 'transparent',
                        color: activeTab === 'chat' ? 'var(--primary)' : 'var(--text-muted)',
                        border: 'none',
                        borderBottom: activeTab === 'chat' ? '2px solid var(--primary)' : 'none',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        fontWeight: '600'
                    }}
                >
                    <MessageSquare size={16} /> Mentor Chat
                </button>
                <button
                    onClick={() => setActiveTab('quiz')}
                    style={{
                        flex: 1,
                        padding: '15px',
                        background: activeTab === 'quiz' ? 'rgba(108, 92, 231, 0.1)' : 'transparent',
                        color: activeTab === 'quiz' ? 'var(--primary)' : 'var(--text-muted)',
                        border: 'none',
                        borderBottom: activeTab === 'quiz' ? '2px solid var(--primary)' : 'none',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        fontWeight: '600'
                    }}
                >
                    <BrainCircuit size={16} /> Knowledge Quiz
                </button>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>

                {/* --- CHAT VIEW --- */}
                {activeTab === 'chat' && (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ padding: '15px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <select
                                    className="glass-panel"
                                    style={{ color: 'white', padding: '5px', outline: 'none' }}
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="interview">Interview</option>
                                </select>

                                <select
                                    className="glass-panel"
                                    style={{ color: 'white', padding: '5px', outline: 'none' }}
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    <option value="english">EN</option>
                                    <option value="hinglish">Hinglish</option>
                                    <option value="hindi">HI</option>
                                </select>
                            </div>
                            <button
                                onClick={clearChat}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
                            >
                                Clear
                            </button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {messages.map((msg, idx) => (
                                <div key={idx} style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '90%'
                                }}>
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
                            {loading && <div style={{ color: 'var(--text-muted)' }}>Thinking...</div>}
                        </div>
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
                )}

                {/* --- QUIZ VIEW --- */}
                {activeTab === 'quiz' && (
                    <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {!activeFile ? (
                            <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)' }}>
                                Select a file to generate a quiz
                            </div>
                        ) : !quizQuestions && !quizLoading ? (
                            <div className="flex-center" style={{ height: '100%', flexDirection: 'column', gap: '20px' }}>
                                <BrainCircuit size={48} color="var(--primary)" />
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Test your understanding of <b>{activeFile}</b>.<br />
                                    The AI will generate 3 custom questions.
                                </p>
                                <button className="btn-primary" onClick={generateQuiz}>
                                    Generate Quiz
                                </button>
                            </div>
                        ) : quizLoading ? (
                            <div className="flex-center" style={{ height: '100%' }}>
                                Generating Questions...
                            </div>
                        ) : (
                            <div style={{ paddingBottom: '20px' }}>
                                {quizSubmitted && (
                                    <div className="glass-panel" style={{ padding: '15px', marginBottom: '20px', background: 'rgba(0, 206, 201, 0.1)', borderColor: 'var(--secondary)' }}>
                                        <h3 style={{ margin: 0, color: 'var(--secondary)' }}>
                                            Score: {score} / {quizQuestions.length}
                                        </h3>
                                    </div>
                                )}

                                {quizQuestions.map((q, idx) => (
                                    <div key={idx} className="glass-panel" style={{ padding: '15px', marginBottom: '15px' }}>
                                        <p style={{ fontWeight: '600', marginBottom: '10px' }}>{idx + 1}. {q.question}</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {q.options.map((opt, optIdx) => {
                                                const isSelected = userAnswers[idx] === optIdx;
                                                const isCorrect = q.correctAnswer === optIdx;

                                                let bg = 'rgba(255,255,255,0.05)';
                                                if (quizSubmitted) {
                                                    if (isCorrect) bg = 'rgba(46, 204, 113, 0.3)';
                                                    else if (isSelected && !isCorrect) bg = 'rgba(231, 76, 60, 0.3)';
                                                } else if (isSelected) {
                                                    bg = 'var(--primary)';
                                                }

                                                return (
                                                    <div
                                                        key={optIdx}
                                                        onClick={() => handleAnswerSelect(idx, optIdx)}
                                                        style={{
                                                            padding: '10px',
                                                            borderRadius: '8px',
                                                            background: bg,
                                                            cursor: quizSubmitted ? 'default' : 'pointer',
                                                            border: '1px solid transparent',
                                                            display: 'flex', justifyContent: 'space-between'
                                                        }}
                                                    >
                                                        {opt}
                                                        {quizSubmitted && isCorrect && <CheckCircle size={16} color="#2ecc71" />}
                                                        {quizSubmitted && isSelected && !isCorrect && <XCircle size={16} color="#e74c3c" />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {!quizSubmitted && (
                                    <button className="btn-primary" style={{ width: '100%' }} onClick={submitQuiz} disabled={Object.keys(userAnswers).length < quizQuestions.length}>
                                        Submit Answers
                                    </button>
                                )}
                                {quizSubmitted && (
                                    <button className="btn-primary" style={{ width: '100%', marginTop: '10px', background: 'var(--glass)' }} onClick={generateQuiz}>
                                        Try New Quiz
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorPanel;
