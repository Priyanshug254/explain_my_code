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

    return (
        <div style={{ height: '100%', overflow: 'auto', fontSize: '14px' }}>
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
    );
};

export default CodeViewer;
