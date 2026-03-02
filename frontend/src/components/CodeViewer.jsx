import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Sparkles, Zap, ShieldAlert, Copy, Download } from 'lucide-react';
import CodeInsights from './CodeInsights';

const CodeViewer = ({ code, language, onAction }) => {
    if (!code) {
        return (
            <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)', flexDirection: 'column' }}>
                <p>Select a file to view code</p>
            </div>
        );
    }

    // Basic cleanup of language for highlighter
    const langMap = {
        'js': 'javascript',
        'jsx': 'jsx',
        'java': 'java',
        'py': 'python',
        'html': 'html',
        'css': 'css',
        'json': 'json',
        'xml': 'xml',
        'md': 'markdown'
    };

    const mappedLang = langMap[language] || language;

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([code], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `download.${language}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '10px', right: '25px', zIndex: 10, display: 'flex', gap: '10px' }}>
                <button
                    onClick={handleDownload}
                    style={{
                        background: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                    }}
                >
                    Download
                </button>
                <button
                    onClick={handleCopy}
                    style={{
                        background: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                    }}
                >
                    Copy
                </button>
            </div>

            {/* AI Action Bar Overlay */}
            <div style={{
                position: 'absolute',
                bottom: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                display: 'flex',
                gap: '12px',
                padding: '8px 16px',
                background: 'rgba(19, 19, 31, 0.8)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--glass-border)',
                borderRadius: '30px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
            }}>
                <button
                    onClick={() => onAction('explain')}
                    style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '500' }}
                    title="Explain Code"
                >
                    <Sparkles size={16} color="#a29bfe" /> Explain
                </button>
                <div style={{ width: '1px', height: '16px', background: 'var(--border)' }}></div>
                <button
                    onClick={() => onAction('optimize')}
                    style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '500' }}
                    title="Optimize Code"
                >
                    <Zap size={16} color="#ffeaa7" /> Optimize
                </button>
                <div style={{ width: '1px', height: '16px', background: 'var(--border)' }}></div>
                <button
                    onClick={() => onAction('security')}
                    style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '500' }}
                    title="Security Audit"
                >
                    <ShieldAlert size={16} color="#ff7675" /> Security
                </button>
            </div>

            <CodeInsights code={code} />
            <div style={{ flex: 1, overflow: 'auto', fontSize: '14px' }}>
                <SyntaxHighlighter
                    language={mappedLang}
                    style={vscDarkPlus}
                    customStyle={{ background: 'transparent', margin: 0, padding: '20px' }}
                    showLineNumbers={true}
                    lineNumberStyle={{ color: '#444' }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
            <div style={{
                padding: '5px 15px',
                borderTop: '1px solid var(--border)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                background: 'rgba(0,0,0,0.2)',
                display: 'flex',
                gap: '15px'
            }}>
                <span>{mappedLang.toUpperCase()}</span>
                <span>{code.split('\n').length} Lines</span>
                <span>{code.length} Chars</span>
            </div>
        </div>
    );
};

export default CodeViewer;
