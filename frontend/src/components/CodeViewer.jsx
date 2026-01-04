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

    return (
        <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
             <button 
                onClick={handleCopy}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '25px',
                    zIndex: 10,
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
        </div>
    );
};

export default CodeViewer;
