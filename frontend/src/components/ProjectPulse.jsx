import React from 'react';
import { Activity, Shield, Zap, Coffee, FileCode, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectPulse = ({ onClose, projectData }) => {
    // Mock project health data
    const stats = [
        { label: 'Overall Health', value: '92%', icon: <Activity size={20} />, color: '#2ecc71' },
        { label: 'Security Score', value: '88%', icon: <Shield size={20} />, color: '#3498db' },
        { label: 'Optimization', value: '76%', icon: <Zap size={20} />, color: '#f1c40f' },
        { label: 'Cognitive Load', value: 'High', icon: <Brain size={20} />, color: '#e74c3c' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                background: 'rgba(10, 10, 12, 0.95)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                flexDirection: 'column',
                padding: '40px'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'white' }}>Project Pulse</h2>
                    <p style={{ color: 'var(--text-muted)' }}>AI-Driven Architectural Health Monitoring</p>
                </div>
                <button
                    onClick={onClose}
                    className="btn-ghost"
                    style={{ fontSize: '1.5rem', padding: '10px' }}
                >
                    ✕
                </button>
            </div>

            <div className="grid grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ color: stat.color }}>{stat.icon}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '40px', flex: 1, display: 'flex', gap: '20px' }}>
                <div className="glass-panel" style={{ flex: 2, padding: '25px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Complexity Distribution</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '200px' }}>
                        {[40, 70, 45, 90, 65, 30, 85].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.1 }}
                                style={{ flex: 1, background: 'linear-gradient(to top, var(--primary), var(--secondary))', borderRadius: '4px 4px 0 0', opacity: 0.8 }}
                            />
                        ))}
                    </div>
                </div>
                <div className="glass-panel" style={{ flex: 1, padding: '25px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Recent Alerts</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', gap: '10px', color: '#ff4757', fontSize: '0.9rem' }}>
                            <AlertCircle size={16} /> <span>Circular Dependency in Backend</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', color: '#ffa502', fontSize: '0.9rem' }}>
                            <AlertCircle size={16} /> <span>Large File detected: FileService.java</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Helper for Brain icon (missing in current Lucide import)
const Brain = ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A5 5 0 0 1 12 7v10a5 5 0 0 1-2.5 4.3" /><path d="M14.5 2A5 5 0 0 0 12 7v10a5 5 0 0 0 2.5 4.3" /><path d="M21 15a2 2 0 0 1-2-2 2 2 0 0 0-2-2 1 1 0 0 1-1-1 4 4 0 0 0-4-4" /><path d="M3 15a2 2 0 0 0 2-2 2 2 0 0 1 2-2 1 1 0 0 0 1-1 4 4 0 0 1 4-4" /></svg>
);

export default ProjectPulse;
