import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeViewer = ({ code, language }) => {
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
